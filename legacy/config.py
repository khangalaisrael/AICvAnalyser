import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL: str = "gpt-4o-mini"

KNOCKOUT_THRESHOLD: int = 3

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
