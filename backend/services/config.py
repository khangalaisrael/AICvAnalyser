import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL: str = "gpt-4o-mini"

SCORE_WEIGHTS: dict[str, float] = {
    "technical_skill_match":     0.30,
    "quantifiable_achievements": 0.20,
    "years_experience":          0.20,
    "projects_portfolio":        0.12,
    "keyword_alignment":         0.08,
    "certifications":            0.05,
    "soft_skills":               0.05,
}

# Per-tier weight overrides — Mid-level falls back to SCORE_WEIGHTS (the historical default)
SCORE_WEIGHTS_BY_SENIORITY: dict[str, dict[str, float]] = {
    "Entry-level": {
        # Potential hire: skills + projects dominate; certs signal initiative; years near-irrelevant
        "technical_skill_match":     0.42,
        "quantifiable_achievements": 0.07,
        "years_experience":          0.03,
        "projects_portfolio":        0.27,
        "keyword_alignment":         0.06,
        "certifications":            0.10,
        "soft_skills":               0.05,
    },
    "Junior": {
        # First real role: skills + 1-3 yrs experience + portfolio all matter
        "technical_skill_match":     0.35,
        "quantifiable_achievements": 0.15,
        "years_experience":          0.18,
        "projects_portfolio":        0.17,
        "keyword_alignment":         0.07,
        "certifications":            0.03,
        "soft_skills":               0.05,
    },
    "Senior": {
        # Track record: impact + tenure dominate; certs barely register
        "technical_skill_match":     0.28,
        "quantifiable_achievements": 0.25,
        "years_experience":          0.22,
        "projects_portfolio":        0.10,
        "keyword_alignment":         0.07,
        "certifications":            0.03,
        "soft_skills":               0.05,
    },
}

# Verdict thresholds per tier
VERDICT_THRESHOLDS_BY_SENIORITY: dict[str, dict[str, int]] = {
    "Entry-level": {"hire": 65, "maybe": 40},
    "Junior":      {"hire": 72, "maybe": 47},
    "Mid-level":   {"hire": 75, "maybe": 50},
    "Senior":      {"hire": 78, "maybe": 55},
}

# Certification signal: carries most weight for Entry-level (no work history); negligible for Senior
CERT_MULTIPLIER_BY_SENIORITY: dict[str, float] = {
    "Entry-level": 1.0,
    "Junior":      0.7,
    "Mid-level":   0.5,
    "Senior":      0.2,
}

VERDICT_HIRE: int = 75
VERDICT_MAYBE: int = 50

SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")

# Derived from SUPABASE_URL — override with SUPABASE_JWKS_URL env var if needed
_url = SUPABASE_URL.rstrip("/")
SUPABASE_JWKS_URL: str = os.getenv("SUPABASE_JWKS_URL", f"{_url}/auth/v1/.well-known/jwks.json")
