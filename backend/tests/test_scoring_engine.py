import pytest

from role_profiles import ROLE_PROFILES, get_profile
from scoring_engine import (
    _get_verdict,
    _norm,
    _score_years_experience,
    _tier_coverage,
    calculate_score,
)

PROFILE = get_profile("Data Analyst")


def strong_cv() -> dict:
    return {
        "match_score": 90,
        "keyword_alignment": 85,
        "years_experience": 3,
        "seniority_level": "Mid-level",
        "certifications": ["Google Data Analytics", "PL-300"],
        "soft_skills_evidence": True,
        "quantified_achievement_count": 6,
        "project_count": 4,
        "matched_skills": ["SQL", "Excel", "Python"],
        "missing_skills": [],
        "skill_tier_match": {
            "must_have_matched": PROFILE["must_have"],
            "strongly_expected_matched": PROFILE["strongly_expected"],
            "nice_to_have_matched": PROFILE["nice_to_have"],
            "competitive_advantage_matched": PROFILE["competitive_advantage"],
        },
    }


def weak_cv() -> dict:
    return {
        "match_score": 95,  # an over-optimistic LLM must not rescue a weak CV
        "keyword_alignment": 10,
        "years_experience": 0,
        "seniority_level": "Mid-level",
        "certifications": [],
        "soft_skills_evidence": False,
        "quantified_achievement_count": 0,
        "project_count": 0,
        "matched_skills": [],
        "missing_skills": ["SQL", "Excel"],
        "skill_tier_match": {},
    }


def test_norm_strips_case_and_punctuation():
    assert _norm("Power BI / Tableau") == "powerbitableau"


def test_tier_coverage_exact_and_fuzzy():
    assert _tier_coverage(["SQL", "Excel"], ["sql"]) == 0.5
    assert _tier_coverage(["Power BI or Tableau"], ["Power BI"]) == 1.0
    assert _tier_coverage([], ["SQL"]) == 0.0


def test_scoring_is_deterministic():
    assert calculate_score(strong_cv(), PROFILE) == calculate_score(strong_cv(), PROFILE)


def test_strong_cv_outscores_weak_cv():
    strong = calculate_score(strong_cv(), PROFILE)["final_score"]
    weak = calculate_score(weak_cv(), PROFILE)["final_score"]
    assert strong > weak
    assert strong >= 70
    assert weak < 40


def test_score_always_within_bounds_for_every_role():
    for name, profile in ROLE_PROFILES.items():
        for cv in (strong_cv(), weak_cv()):
            score = calculate_score(cv, profile)["final_score"]
            assert 0 <= score <= 100, name


def test_llm_score_cannot_drive_result_when_skills_missing():
    base = weak_cv()
    high = calculate_score({**base, "match_score": 100}, PROFILE)["final_score"]
    low = calculate_score({**base, "match_score": 0}, PROFILE)["final_score"]
    assert high - low <= 15


def test_entry_level_gets_partial_credit_for_zero_years():
    assert _score_years_experience(0, 2, "Entry-level") == 0.4
    assert _score_years_experience(0, 2, "Mid-level") == 0.0
    assert _score_years_experience(4, 2, "Mid-level") == 1.0


def test_experience_flag_when_below_minimum():
    cv = {**strong_cv(), "years_experience": 1}
    result = calculate_score(cv, {**PROFILE, "min_experience_years": 3})
    assert result["experience_flag"] is True
    assert "3" in result["experience_flag_message"]


def test_confidence_low_with_no_evidence():
    result = calculate_score({"seniority_level": "Mid-level"}, {**PROFILE, "must_have": [], "strongly_expected": [], "nice_to_have": [], "competitive_advantage": []})
    assert result["confidence"] == "low"
    assert result["confidence_reasons"]


@pytest.mark.parametrize("seniority", ["Entry-level", "Junior", "Mid-level", "Senior"])
def test_verdict_is_monotonic(seniority):
    order = {"REJECT": 0, "MAYBE": 1, "HIRE": 2}
    ranks = [order[_get_verdict(s, seniority)] for s in range(0, 101)]
    assert ranks == sorted(ranks)
