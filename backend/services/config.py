import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL: str = "gpt-4o-mini"

SCORE_WEIGHTS: dict[str, float] = {
    "technical_skill_match": 0.25,
    "quantifiable_achievements": 0.20,
    "years_experience": 0.15,
    "recency_of_skills": 0.10,
    "certifications": 0.10,
    "projects_portfolio": 0.10,
    "keyword_alignment": 0.05,
    "soft_skills": 0.05,
}

VERDICT_HIRE: int = 75
VERDICT_MAYBE: int = 50

SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")

# Derived from SUPABASE_URL — override with SUPABASE_JWKS_URL env var if needed
_url = SUPABASE_URL.rstrip("/")
SUPABASE_JWKS_URL: str = os.getenv("SUPABASE_JWKS_URL", f"{_url}/auth/v1/.well-known/jwks.json")
