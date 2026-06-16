import json
from openai import OpenAI
from config import OPENAI_API_KEY, OPENAI_MODEL
from role_profiles import RoleProfile


import streamlit as st
from openai import OpenAI

OPENAI_API_KEY = st.secrets["OPENAI_API_KEY"]
_client = OpenAI(api_key=OPENAI_API_KEY)

_SAFE_FALLBACK: dict = {
    "matched_skills": [],
    "missing_skills": [],
    "years_experience": 0,
    "has_projects": False,
    "has_metrics": False,
    "certifications": [],
    "match_score": 0,
    "keyword_alignment": 0,
    "soft_skills_evidence": False,
    "ai_summary": "Analysis could not be completed. Please try again.",
    "error": True,
}


def _build_prompt(cv_text: str, job_role: str, role_profile: RoleProfile) -> str:
    must_have = ", ".join(role_profile["must_have"])
    nice_to_have = ", ".join(role_profile["nice_to_have"])
    min_exp = role_profile["min_experience_years"]

    return f"""You are an expert technical recruiter. Analyse the CV below for the role of {job_role}.

Role requirements:
- Must-have skills: {must_have}
- Nice-to-have skills: {nice_to_have}
- Minimum experience: {min_exp} year(s)

CV TEXT:
{cv_text}

Return ONLY a raw JSON object. No markdown, no backticks, no explanation — just the JSON.

The JSON must follow this exact schema:
{{
  "matched_skills": ["list of skills from must-have and nice-to-have that the candidate has"],
  "missing_skills": ["list of must-have skills the candidate is missing"],
  "years_experience": <integer — total relevant years of experience>,
  "has_projects": <true or false — candidate has portfolio projects or side projects>,
  "has_metrics": <true or false — candidate uses quantifiable achievements e.g. "increased revenue by 20%">,
  "certifications": ["list of certifications found, or empty array"],
  "match_score": <integer 0–100 — overall fit for the role>,
  "keyword_alignment": <integer 0–100 — how well CV keywords match the job role>,
  "soft_skills_evidence": <true or false — evidence of soft skills like leadership or communication>,
  "ai_summary": "<2–3 sentence plain-English summary of the candidate's fit for this role>"
}}"""


def analyse_cv(cv_text: str, job_role: str, role_profile: RoleProfile) -> dict:
    """Send CV text to OpenAI and return structured analysis as a dict."""
    try:
        response = _client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "user", "content": _build_prompt(cv_text, job_role, role_profile)}
            ],
            temperature=0.2,
            max_tokens=800,
        )
        raw = response.choices[0].message.content or ""
    except Exception as exc:
        fallback = dict(_SAFE_FALLBACK)
        fallback["ai_summary"] = f"API error: {exc}"
        return fallback

    try:
        result = json.loads(raw)
    except json.JSONDecodeError:
        fallback = dict(_SAFE_FALLBACK)
        fallback["ai_summary"] = "The AI returned an unexpected format. Please try again."
        return fallback

    for key in _SAFE_FALLBACK:
        if key not in result:
            result[key] = _SAFE_FALLBACK[key]

    result.pop("error", None)
    return result
