import json
import re

from openai import OpenAI
from config import OPENAI_API_KEY, OPENAI_MODEL
from role_profiles import RoleProfile

_client: OpenAI | None = None


def _get_client() -> OpenAI:
    global _client
    if _client is None:
        _client = OpenAI(api_key=OPENAI_API_KEY)
    return _client


_SAFE_FALLBACK: dict = {
    "matched_skills": [],
    "missing_skills": [],
    "recommended_skills": [],
    "years_experience": 0,
    "has_projects": False,
    "has_metrics": False,
    "certifications": [],
    "match_score": 0,
    "keyword_alignment": 0,
    "soft_skills_evidence": False,
    "ai_summary": "Analysis could not be completed. Please try again.",
    "coaching": None,
    "error": True,
}

_SEMANTIC_RULES = """IMPORTANT — Use SEMANTIC and INFERENTIAL reasoning when assessing skills, not keyword matching:
- Java on a CV means OOP, object-oriented design, and likely design patterns are inferred
- React/Angular/Vue means JavaScript/TypeScript competency is inferred
- Scrum, sprint planning, or retrospectives means Agile methodology is inferred
- Any data analysis work means basic Excel/data tools are reasonably inferred
- AWS/GCP/Azure means cloud computing and DevOps awareness is inferred
- Node.js means JavaScript is inferred; Next.js means React is inferred
- TensorFlow/PyTorch means Python and ML fundamentals are inferred
- Kubernetes → Docker, containerization, container orchestration, and microservices architecture are inferred
- Docker → containerization concepts are inferred
- PostgreSQL / MySQL / SQL Server → SQL is inferred (and vice versa — "SQL" implies relational DB familiarity)
- Terraform / Helm / Ansible / Pulumi → Infrastructure as Code (IaC) is inferred
- Jest / Mocha / Pytest / JUnit → testing fundamentals and unit testing are inferred
- Git / GitHub / GitLab → version control and branching strategies are inferred
- Any specific cloud service (Lambda, S3, BigQuery, Pub/Sub, EC2) → general cloud platform competency is inferred
- Match based on DEMONSTRATED COMPETENCY and reasonable context inference
- Only mark a skill as truly missing if there is genuinely no reasonable path to infer it
- Err on the side of generosity — candidates often use different terminology for the same competency

CRITICAL for recommended_skills: NEVER recommend a skill that is already matched or reasonably inferable from the CV.
If the CV shows Kubernetes, do NOT recommend Docker or containerization — they are already inferred.
If the CV shows PostgreSQL, do NOT recommend SQL — it is already inferred.
recommended_skills must only be genuinely novel skills with ZERO presence or inference path on this CV.

CERTIFICATION RULE: Only include certification recommendations (type "certification") in priority_gaps,
and only include certifications in longer_term, if the candidate has FEWER than 2 years of experience.
For candidates with 2+ years experience, suggest practical project ideas, open-source contributions,
or specific skill deepening instead — not generic course or certification recommendations."""


def _parse_experience_years(exp_str: str) -> int:
    nums = re.findall(r"\d+", str(exp_str))
    return int(nums[0]) if nums else 1


def _build_prompt(cv_text: str, job_role: str, role_profile: RoleProfile) -> str:
    must_have = ", ".join(role_profile["must_have"])
    nice_to_have = ", ".join(role_profile["nice_to_have"])
    min_exp = role_profile["min_experience_years"]

    return f"""You are an expert technical recruiter and CV coach. Analyse the CV below for the role of {job_role}.

Role requirements:
- Must-have skills: {must_have}
- Nice-to-have skills: {nice_to_have}
- Minimum experience: {min_exp} year(s)

{_SEMANTIC_RULES}

CV TEXT:
{cv_text}

Return ONLY a raw JSON object. No markdown, no backticks, no explanation - just the JSON.

The JSON must follow this exact schema:
{{
  "matched_skills": ["skills explicitly present OR reasonably inferable from demonstrated experience -- use semantic reasoning"],
  "missing_skills": ["skills genuinely absent with no reasonable inference path -- be generous, not strict"],
  "recommended_skills": ["3-5 genuinely novel skills not present or inferable on the CV that would most strengthen this application"],
  "years_experience": <integer - total relevant years of experience>,
  "has_projects": <true or false - candidate has portfolio projects or side projects>,
  "has_metrics": <true or false - candidate uses quantifiable achievements>,
  "certifications": ["list of certifications found, or empty array"],
  "match_score": <integer 0-100 - overall fit for the role>,
  "keyword_alignment": <integer 0-100 - how well CV keywords match the job role>,
  "soft_skills_evidence": <true or false - evidence of soft skills like leadership or communication>,
  "ai_summary": "<2-3 sentence plain-English summary of the candidate's fit for this role>",
  "coaching": {{
    "priority_gaps": [
      {{
        "type": "<skill|soft_skill|certification|project>",
        "item": "<specific skill, certification name, or project type>",
        "impact": "<high|medium|low>",
        "reason": "<one sentence: why this gap matters for a recruiter hiring for {job_role}>",
        "action": "<concrete, specific action the candidate can take to address this gap>",
        "rewrite_hint": "<suggest how to rewrite a specific existing CV bullet to evidence this - quote before and suggest after. null if not applicable>"
      }}
    ],
    "quick_wins": ["<changes the candidate can make to their CV wording or keywords today>"],
    "longer_term": ["<projects or skill deepening that take weeks or months -- certifications only if under 2 years experience>"],
    "overall_coaching_summary": "<1-2 sentences: the single most impactful coaching message for this candidate to improve their {job_role} application>"
  }}
}}"""


def _build_custom_jd_prompt(cv_text: str, researched_profile: dict) -> str:
    profile_json = json.dumps(researched_profile, indent=2)
    role_title = researched_profile.get("role_title", "this role")

    return f"""You are an expert CV coach and hiring specialist.
You are given a structured role profile (researched from current market data) and a candidate's CV.
Assess how well the CV matches the role and provide specific, actionable coaching.

{_SEMANTIC_RULES}

Role Profile (current market research):
{profile_json}

Candidate CV:
{cv_text}

Return ONLY a raw JSON object. No markdown, no backticks, no explanation - just the JSON.

{{
  "matched_skills": ["skills explicitly present OR reasonably inferable from demonstrated experience -- use semantic reasoning"],
  "missing_skills": ["skills genuinely absent with no reasonable inference path -- be generous, not strict"],
  "recommended_skills": ["3-5 genuinely novel skills not present or inferable on the CV that would most strengthen this {role_title} application"],
  "years_experience": <integer - total relevant years of experience>,
  "has_projects": <true or false>,
  "has_metrics": <true or false - candidate uses quantified achievements>,
  "certifications": ["certifications found in the CV"],
  "match_score": <integer 0-100 - overall fit for the role>,
  "keyword_alignment": <integer 0-100 - how well CV language matches the role profile>,
  "soft_skills_evidence": <true or false>,
  "ai_summary": "<2-3 sentence plain-English summary of the candidate's fit for {role_title}, naming the strongest point and the biggest gap>",
  "coaching": {{
    "priority_gaps": [
      {{
        "type": "<skill|soft_skill|certification|project>",
        "item": "<specific skill, certification name, or project type>",
        "impact": "<high|medium|low>",
        "reason": "<one sentence: why this gap would cause a recruiter screening for {role_title} to pass on this CV>",
        "action": "<concrete, specific action the candidate should take to address this gap>",
        "rewrite_hint": "<suggest how to rewrite a specific existing CV bullet to better evidence this skill - quote the before and suggest the after. null if no clear existing bullet applies>"
      }}
    ],
    "quick_wins": ["<specific wording, keyword, or metric changes the candidate can make to their existing CV today>"],
    "longer_term": ["<portfolio projects or skill deepening that would significantly improve their standing for {role_title} -- certifications only if under 2 years experience>"],
    "overall_coaching_summary": "<1-2 sentences: the most impactful coaching message for this specific candidate to improve their {role_title} application>"
  }}
}}"""


def _build_raw_jd_prompt(cv_text: str, raw_jd: str) -> str:
    return f"""You are an expert CV screener and career coach.
A candidate has uploaded their CV and provided the exact job description they are actively applying for.

JOB DESCRIPTION (may contain boilerplate — ignore legal/EEO text, focus on skills, requirements, and responsibilities):
\"\"\"
{raw_jd[:3000]}
\"\"\"

CANDIDATE CV:
\"\"\"
{cv_text[:3000]}
\"\"\"

{_SEMANTIC_RULES}

Extract a clean job title from the JD. Include it as "_role_title" in your response.

Return ONLY a raw JSON object. No markdown, no backticks, no explanation - just the JSON.

{{
  "_role_title": "<clean job title extracted from the JD, e.g. 'Senior Backend Engineer'>",
  "matched_skills": ["skills explicitly present OR reasonably inferable from demonstrated experience -- use semantic reasoning"],
  "missing_skills": ["skills the JD requires that are genuinely absent with no inference path on this CV"],
  "recommended_skills": ["3-5 genuinely novel skills not present or inferable on the CV that would most strengthen this application"],
  "years_experience": <integer - total relevant years of experience>,
  "has_projects": <true or false - candidate has portfolio projects or side projects>,
  "has_metrics": <true or false - candidate uses quantifiable achievements>,
  "certifications": ["list of certifications found in the CV, or empty array"],
  "match_score": <integer 0-100 - overall fit for this specific job posting>,
  "keyword_alignment": <integer 0-100 - how well CV language matches the job description>,
  "soft_skills_evidence": <true or false - evidence of soft skills like leadership or communication>,
  "ai_summary": "<2-3 sentence plain-English summary of the candidate's fit for this specific role, naming their strongest asset and the most important gap>",
  "coaching": {{
    "priority_gaps": [
      {{
        "type": "<skill|soft_skill|certification|project>",
        "item": "<specific skill, certification name, or project type>",
        "impact": "<high|medium|low>",
        "reason": "<one sentence: why this gap specifically matters for this job posting>",
        "action": "<concrete, specific action the candidate should take to address this gap>",
        "rewrite_hint": "<suggest how to rewrite a specific existing CV bullet to better evidence this skill. null if not applicable>"
      }}
    ],
    "quick_wins": ["<specific wording, keyword, or metric changes the candidate can make to their existing CV today to better match this JD>"],
    "longer_term": ["<portfolio projects or skill deepening that would significantly improve their standing -- certifications only if under 2 years experience>"],
    "overall_coaching_summary": "<1-2 sentences: the most impactful coaching message for this candidate applying to this specific role>"
  }}
}}"""


def analyse_cv(cv_text: str, job_role: str, role_profile: RoleProfile) -> dict:
    try:
        response = _get_client().chat.completions.create(
            model=OPENAI_MODEL,
            messages=[{"role": "user", "content": _build_prompt(cv_text, job_role, role_profile)}],
            temperature=0.2,
            max_tokens=1800,
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


def research_role(description: str) -> dict:
    """Prompt 1: expand vague role description into structured market profile."""
    system_msg = (
        "You are a career research expert with up-to-date knowledge of the global job market. "
        "Given a role description (which may be vague or highly detailed), research and expand it "
        "into a comprehensive role profile reflecting current market demands. "
        "Always include the latest in-demand skills for this role as of 2025-2026. "
        "Return ONLY valid JSON, no markdown, no explanation."
    )
    user_msg = f"""Role description: "{description}"

Return this exact JSON structure:
{{
  "role_title": "<clean inferred job title, e.g. 'Senior Java Developer'>",
  "seniority_level": "<Junior|Mid-level|Senior|Lead|Principal>",
  "required_skills": ["<must-have technical and domain skills as of today>"],
  "nice_to_have_skills": ["<valued but not strictly required skills>"],
  "experience_years": "<expected years of experience, e.g. '3-5 years'>",
  "key_responsibilities": ["<typical day-to-day responsibilities for this role>"],
  "current_market_trends": ["<current hot topics, emerging tools, or in-demand areas for this role in 2025-2026>"],
  "certifications_or_qualifications": ["<relevant certifications or qualifications that improve candidacy>"]
}}"""

    try:
        response = _get_client().chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user", "content": user_msg},
            ],
            temperature=0.3,
            max_tokens=1000,
        )
        raw = response.choices[0].message.content or ""
    except Exception as exc:
        raise ValueError(f"Role research failed: {exc}") from exc

    try:
        return json.loads(raw)
    except json.JSONDecodeError as exc:
        raise ValueError("Role research returned an unexpected format. Please try again.") from exc


def analyse_cv_with_research(cv_text: str, researched_profile: dict) -> dict:
    """Prompt 2: analyse CV against an OpenAI-researched role profile."""
    try:
        response = _get_client().chat.completions.create(
            model=OPENAI_MODEL,
            messages=[{"role": "user", "content": _build_custom_jd_prompt(cv_text, researched_profile)}],
            temperature=0.2,
            max_tokens=1800,
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


def analyse_cv_with_raw_jd(cv_text: str, raw_jd: str) -> dict:
    """Analyse CV directly against a raw job description — no research step needed."""
    try:
        response = _get_client().chat.completions.create(
            model=OPENAI_MODEL,
            messages=[{"role": "user", "content": _build_raw_jd_prompt(cv_text, raw_jd)}],
            temperature=0.2,
            max_tokens=1800,
        )
        raw = response.choices[0].message.content or ""
    except Exception as exc:
        fallback = dict(_SAFE_FALLBACK)
        fallback["ai_summary"] = f"API error: {exc}"
        fallback["_role_title"] = "Custom Role"
        return fallback

    try:
        result = json.loads(raw)
    except json.JSONDecodeError:
        fallback = dict(_SAFE_FALLBACK)
        fallback["ai_summary"] = "The AI returned an unexpected format. Please try again."
        fallback["_role_title"] = "Custom Role"
        return fallback

    for key in _SAFE_FALLBACK:
        if key not in result:
            result[key] = _SAFE_FALLBACK[key]

    result.pop("error", None)
    return result
