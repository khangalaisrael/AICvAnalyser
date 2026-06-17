from config import (
    SCORE_WEIGHTS, SCORE_WEIGHTS_BY_SENIORITY,
    VERDICT_HIRE, VERDICT_MAYBE, VERDICT_THRESHOLDS_BY_SENIORITY,
    CERT_MULTIPLIER_BY_SENIORITY,
)
from role_profiles import RoleProfile


def _score_years_experience(years: int, min_required: int, seniority: str) -> float:
    if years <= 0:
        # Entry-level: 0 years is expected — give partial credit rather than hard zero
        return 0.4 if seniority == "Entry-level" else 0.0
    if years >= min_required * 2:
        return 1.0
    return min(years / max(min_required, 1), 1.0)


def calculate_score(ai_result: dict, role_profile: RoleProfile) -> dict:
    match_score: float = ai_result.get("match_score", 0) / 100
    keyword_alignment: float = ai_result.get("keyword_alignment", 0) / 100
    years_exp: int = ai_result.get("years_experience", 0)
    has_metrics: bool = ai_result.get("has_metrics", False)
    has_projects: bool = ai_result.get("has_projects", False)
    certifications: list = ai_result.get("certifications") or []
    soft_skills: bool = ai_result.get("soft_skills_evidence", False)
    seniority: str = ai_result.get("seniority_level", "Mid-level")

    weights = SCORE_WEIGHTS_BY_SENIORITY.get(seniority, SCORE_WEIGHTS)

    min_exp = role_profile["min_experience_years"]
    exp_score = _score_years_experience(years_exp, min_exp, seniority)

    cert_multiplier = CERT_MULTIPLIER_BY_SENIORITY.get(seniority, 0.5)
    cert_score = min(len(certifications) / 2, 1.0) * cert_multiplier

    component_scores: dict[str, float] = {
        "technical_skill_match":     match_score,
        "quantifiable_achievements": 1.0 if has_metrics else 0.0,
        "years_experience":          exp_score,
        "projects_portfolio":        1.0 if has_projects else 0.0,
        "keyword_alignment":         keyword_alignment,
        "certifications":            cert_score,
        "soft_skills":               1.0 if soft_skills else 0.0,
    }

    final_score: int = round(
        sum(component_scores[k] * weights[k] for k in weights) * 100
    )

    exp_flag: bool = years_exp < min_exp and years_exp > 0

    return {
        "verdict": _get_verdict(final_score, seniority),
        "knockout": False,
        "final_score": final_score,
        "component_scores": component_scores,
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
