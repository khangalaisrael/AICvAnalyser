"""Deterministic, explainable scoring engine.

Design principle: the LLM EXTRACTS facts (which skills matched per tier, how
many quantified achievements, seniority). Python COMPUTES the score. The LLM's
holistic match_score is only a small, clamped blend on top — so the same CV
produces (near-)identical scores run after run, and every point is traceable.
"""

from config import (
    SCORE_WEIGHTS, SCORE_WEIGHTS_BY_SENIORITY,
    VERDICT_HIRE, VERDICT_MAYBE, VERDICT_THRESHOLDS_BY_SENIORITY,
    CERT_MULTIPLIER_BY_SENIORITY,
    SKILL_TIER_WEIGHTS, LLM_SCORE_BLEND, LLM_SCORE_CLAMP,
    ACHIEVEMENTS_FULL_CREDIT, PROJECTS_FULL_CREDIT,
)
from role_profiles import RoleProfile


# ── Skill coverage (deterministic core of the score) ─────────────────────────

def _norm(s: str) -> str:
    return "".join(ch for ch in s.lower() if ch.isalnum())


def _tier_coverage(profile_skills: list[str], matched_in_tier: list[str]) -> float:
    """Fraction of a tier's skills the candidate covers (fuzzy-normalised)."""
    if not profile_skills:
        return 0.0
    matched_norm = {_norm(m) for m in matched_in_tier}
    hits = 0
    for skill in profile_skills:
        sn = _norm(skill)
        if sn in matched_norm:
            hits += 1
        elif len(sn) >= 3 and any(
            (sn in m or m in sn) for m in matched_norm if len(m) >= 3
        ):
            hits += 1
    return min(hits / len(profile_skills), 1.0)


def _skill_coverage_score(ai_result: dict, role_profile: RoleProfile) -> tuple[float | None, dict]:
    """Weighted skill coverage across tiers. Returns (score 0-1 or None, detail).

    Returns None when the profile defines no skill tiers (raw-JD mode), in
    which case the caller falls back to the clamped LLM score.
    """
    tier_match = ai_result.get("skill_tier_match") or {}
    detail: dict[str, float] = {}
    weighted_sum = 0.0
    weight_total = 0.0

    tiers = {
        "must_have":             tier_match.get("must_have_matched") or [],
        "strongly_expected":     tier_match.get("strongly_expected_matched") or [],
        "nice_to_have":          tier_match.get("nice_to_have_matched") or [],
        "competitive_advantage": tier_match.get("competitive_advantage_matched") or [],
    }

    for tier, matched in tiers.items():
        profile_skills = role_profile.get(tier) or []
        if not profile_skills:
            continue
        cov = _tier_coverage(profile_skills, matched)
        detail[tier] = round(cov, 3)
        weighted_sum += cov * SKILL_TIER_WEIGHTS[tier]
        weight_total += SKILL_TIER_WEIGHTS[tier]

    if weight_total == 0:
        return None, detail

    return weighted_sum / weight_total, detail


def _clamped_llm_score(llm_score: float, anchor: float | None, ai_result: dict) -> float:
    """Bound the LLM's holistic 0-1 score so a hallucinated number can't drive the result."""
    if anchor is not None:
        lo, hi = max(0.0, anchor - LLM_SCORE_CLAMP), min(1.0, anchor + LLM_SCORE_CLAMP)
        return min(max(llm_score, lo), hi)
    # No deterministic anchor (raw-JD mode): apply sanity caps from extracted evidence
    matched = ai_result.get("matched_skills") or []
    missing = ai_result.get("missing_skills") or []
    if missing and len(missing) > len(matched):
        return min(llm_score, 0.55)
    if matched and not missing:
        return max(llm_score, 0.60)
    return llm_score


def _technical_skill_score(ai_result: dict, role_profile: RoleProfile) -> tuple[float, dict]:
    """Blend: deterministic tier coverage (dominant) + clamped LLM holistic score."""
    coverage, tier_detail = _skill_coverage_score(ai_result, role_profile)
    llm_raw = (ai_result.get("match_score") or 0) / 100
    llm = _clamped_llm_score(llm_raw, coverage, ai_result)

    if coverage is None:
        score = llm
        method = "llm_clamped (no role skill tiers defined)"
    else:
        score = (1 - LLM_SCORE_BLEND) * coverage + LLM_SCORE_BLEND * llm
        method = f"{int((1 - LLM_SCORE_BLEND) * 100)}% tier coverage + {int(LLM_SCORE_BLEND * 100)}% AI holistic (clamped)"

    return score, {
        "method": method,
        "tier_coverage": tier_detail,
        "coverage_score": round(coverage, 3) if coverage is not None else None,
        "llm_raw": round(llm_raw, 3),
        "llm_clamped": round(llm, 3),
    }


# ── Graded evidence components (no more binary cliffs) ───────────────────────

def _achievements_score(ai_result: dict) -> float:
    count = ai_result.get("quantified_achievement_count")
    if isinstance(count, int) and count >= 0:
        return min(count / ACHIEVEMENTS_FULL_CREDIT, 1.0)
    return 1.0 if ai_result.get("has_metrics") else 0.0  # legacy fallback


def _projects_score(ai_result: dict) -> float:
    count = ai_result.get("project_count")
    if isinstance(count, int) and count >= 0:
        return min(count / PROJECTS_FULL_CREDIT, 1.0)
    return 1.0 if ai_result.get("has_projects") else 0.0  # legacy fallback


def _score_years_experience(years: int, min_required: int, seniority: str) -> float:
    if years <= 0:
        # Entry-level: 0 years is expected — partial credit rather than hard zero
        return 0.4 if seniority == "Entry-level" else 0.0
    if years >= min_required * 2:
        return 1.0
    return min(years / max(min_required, 1), 1.0)


# ── Confidence ────────────────────────────────────────────────────────────────

def _confidence(ai_result: dict, role_profile: RoleProfile) -> tuple[str, list[str]]:
    """How much should the user trust this score? Based on evidence quality."""
    reasons: list[str] = []
    penalty = 0

    tier_match = ai_result.get("skill_tier_match") or {}
    has_tier_data = any(tier_match.get(k) for k in tier_match) or any(
        role_profile.get(t) for t in SKILL_TIER_WEIGHTS
    )
    if not has_tier_data:
        penalty += 2
        reasons.append("Score relies on AI judgement only — no structured skill tiers for this role.")

    if ai_result.get("quantified_achievement_count") is None and not ai_result.get("has_metrics"):
        penalty += 1
        reasons.append("Few or no quantified achievements found — impact evidence is thin.")

    if not (ai_result.get("matched_skills") or []) and not (ai_result.get("missing_skills") or []):
        penalty += 2
        reasons.append("Very little skill evidence extracted from the CV text.")

    if ai_result.get("years_experience", 0) == 0 and ai_result.get("seniority_level") not in ("Entry-level", "Junior"):
        penalty += 1
        reasons.append("Experience duration could not be determined from the CV.")

    if penalty == 0:
        reasons.append("Score computed from clear, structured evidence in the CV.")
        return "high", reasons
    if penalty <= 2:
        return "medium", reasons
    return "low", reasons


# ── Main entry ────────────────────────────────────────────────────────────────

def calculate_score(ai_result: dict, role_profile: RoleProfile) -> dict:
    keyword_alignment: float = (ai_result.get("keyword_alignment") or 0) / 100
    years_exp: int = ai_result.get("years_experience", 0)
    certifications: list = ai_result.get("certifications") or []
    soft_skills: bool = ai_result.get("soft_skills_evidence", False)
    seniority: str = ai_result.get("seniority_level", "Mid-level")

    weights = SCORE_WEIGHTS_BY_SENIORITY.get(seniority, SCORE_WEIGHTS)

    min_exp = role_profile["min_experience_years"]
    exp_score = _score_years_experience(years_exp, min_exp, seniority)

    cert_multiplier = CERT_MULTIPLIER_BY_SENIORITY.get(seniority, 0.5)
    cert_score = min(len(certifications) / 2, 1.0) * cert_multiplier

    tech_score, tech_detail = _technical_skill_score(ai_result, role_profile)
    ach_score = _achievements_score(ai_result)
    proj_score = _projects_score(ai_result)

    component_scores: dict[str, float] = {
        "technical_skill_match":     tech_score,
        "quantifiable_achievements": ach_score,
        "years_experience":          exp_score,
        "projects_portfolio":        proj_score,
        "keyword_alignment":         keyword_alignment,
        "certifications":            cert_score,
        "soft_skills":               1.0 if soft_skills else 0.0,
    }

    final_score: int = round(
        sum(component_scores[k] * weights[k] for k in weights) * 100
    )

    exp_flag: bool = 0 < years_exp < min_exp

    confidence, confidence_reasons = _confidence(ai_result, role_profile)

    ach_count = ai_result.get("quantified_achievement_count")
    proj_count = ai_result.get("project_count")

    score_breakdown: dict[str, str] = {
        "technical_skill_match": (
            f"Computed from actual skill coverage per tier ({tech_detail['method']}). "
            + ", ".join(f"{t.replace('_', ' ')}: {int(c * 100)}%" for t, c in tech_detail["tier_coverage"].items())
            if tech_detail["tier_coverage"]
            else "Based on AI holistic assessment, sanity-clamped against extracted skill evidence."
        ),
        "quantifiable_achievements": (
            f"{ach_count} quantified achievement(s) found; {ACHIEVEMENTS_FULL_CREDIT}+ earns full credit."
            if isinstance(ach_count, int)
            else ("Quantified results detected in the CV." if ach_score else "No quantified results (numbers, %, scale) found.")
        ),
        "years_experience": f"{years_exp} yr(s) vs {min_exp} required for {seniority} weighting.",
        "projects_portfolio": (
            f"{proj_count} project(s) identified; {PROJECTS_FULL_CREDIT}+ earns full credit."
            if isinstance(proj_count, int)
            else ("Projects/portfolio evidence found." if proj_score else "No projects or portfolio evidence found.")
        ),
        "keyword_alignment": "AI-estimated overlap between CV wording and role keywords (ATS proxy).",
        "certifications": f"{len(certifications)} certification(s) × {seniority} relevance multiplier ({cert_multiplier}).",
        "soft_skills": "Evidence of leadership/communication found." if soft_skills else "No explicit soft-skill evidence.",
    }

    return {
        "verdict": _get_verdict(final_score, seniority),
        "knockout": False,
        "final_score": final_score,
        "component_scores": component_scores,
        "score_breakdown": score_breakdown,
        "confidence": confidence,
        "confidence_reasons": confidence_reasons,
        "scoring_detail": {"technical_skill_match": tech_detail},
        "experience_flag": exp_flag,
        "experience_flag_message": (
            f"Candidate has {years_exp} year(s) experience; role requires {min_exp}."
            if exp_flag else ""
        ),
    }


def _get_verdict(score: int, seniority: str = "Mid-level") -> str:
    thresholds = VERDICT_THRESHOLDS_BY_SENIORITY.get(
        seniority, {"hire": VERDICT_HIRE, "maybe": VERDICT_MAYBE}
    )
    if score >= thresholds["hire"]:
        return "HIRE"
    if score >= thresholds["maybe"]:
        return "MAYBE"
    return "REJECT"


def run_scoring(ai_result: dict, role_profile: RoleProfile) -> dict:
    return calculate_score(ai_result, role_profile)
