from config import SCORE_WEIGHTS, VERDICT_HIRE, VERDICT_MAYBE
from role_profiles import RoleProfile


def apply_knockout_filter(ai_result: dict, role_profile: RoleProfile) -> dict | None:
    return None  # Every candidate is scored fairly -- the score is the verdict


def _score_years_experience(years: int, min_required: int) -> float:
    if years <= 0:
        return 0.0
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

    min_exp = role_profile["min_experience_years"]
    exp_score = _score_years_experience(years_exp, min_exp)

    component_scores: dict[str, float] = {
        "technical_skill_match": match_score,
        "quantifiable_achievements": 1.0 if has_metrics else 0.0,
        "years_experience": exp_score,
        "recency_of_skills": match_score,
        "certifications": min(len(certifications) / 2, 1.0),
        "projects_portfolio": 1.0 if has_projects else 0.0,
        "keyword_alignment": keyword_alignment,
        "soft_skills": 1.0 if soft_skills else 0.0,
    }

    final_score: int = round(
        sum(component_scores[k] * SCORE_WEIGHTS[k] for k in SCORE_WEIGHTS) * 100
    )

    exp_flag: bool = years_exp < min_exp and years_exp > 0

    return {
        "verdict": _get_verdict(final_score),
        "knockout": False,
        "final_score": final_score,
        "component_scores": component_scores,
        "experience_flag": exp_flag,
        "experience_flag_message": (
            f"Candidate has {years_exp} year(s) experience; role requires {min_exp}."
            if exp_flag else ""
        ),
    }


def _get_verdict(score: int) -> str:
    if score >= VERDICT_HIRE:
        return "HIRE"
    if score >= VERDICT_MAYBE:
        return "MAYBE"
    return "REJECT"


def run_scoring(ai_result: dict, role_profile: RoleProfile) -> dict:
    knockout = apply_knockout_filter(ai_result, role_profile)
    if knockout:
        return knockout
    return calculate_score(ai_result, role_profile)
