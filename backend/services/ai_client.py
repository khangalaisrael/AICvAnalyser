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
    "quantified_achievement_count": 0,
    "project_count": 0,
    "certifications": [],
    "match_score": 0,
    "keyword_alignment": 0,
    "soft_skills_evidence": False,
    "seniority_level": "Mid-level",
    "inferred_skills": [],
    "unique_strengths": [],
    "skill_tier_match": {
        "must_have_matched": [],
        "strongly_expected_matched": [],
        "nice_to_have_matched": [],
        "competitive_advantage_matched": [],
    },
    "trending_for_role": [],
    "trending_narrative": "",
    "reasoning": "",
    "career_advice": "",
    "ai_summary": "Analysis could not be completed. Please try again.",
    "coaching": None,
    "error": True,
}

_SEMANTIC_RULES = """IMPORTANT — Use SEMANTIC and INFERENTIAL reasoning, not keyword matching:

SKILL INFERENCE:
- Java → OOP, software design principles, exception handling, collections, debugging
- Spring Boot → REST APIs, backend development, dependency injection, microservices
- React/Angular/Vue → JavaScript/TypeScript competency
- Node.js → JavaScript; Next.js → React is inferred
- Scrum/sprint planning/retrospectives → Agile methodology
- Any data analysis work → basic Excel/data tools
- AWS/GCP/Azure → cloud computing and DevOps awareness
- TensorFlow/PyTorch → Python and ML fundamentals
- Kubernetes → Docker, containerization, container orchestration, microservices architecture
- Docker → containerization concepts
- PostgreSQL/MySQL/SQL Server → SQL (and vice versa)
- Terraform/Helm/Ansible/Pulumi → Infrastructure as Code (IaC)
- Jest/Mocha/Pytest/JUnit → testing fundamentals
- Git/GitHub/GitLab → version control and branching strategies
- Any cloud service (Lambda, S3, BigQuery, EC2) → general cloud platform competency
- dbt → data transformation, SQL, analytics engineering
- Airflow → pipeline orchestration, DAG-based workflows
- Kafka → event streaming, distributed systems

SENIORITY DETECTION (pick exactly one):
- "graduate", "intern", "placement year", "studying", "no experience", "fresh graduate", "first role", "0 years" → Entry-level
- "junior", "associate", "1-2 years", "early career", "recently graduated" → Junior
- "independently delivered", "owned", "3-5 years", "designed and implemented" → Mid-level
- "led a team", "architected", "mentored", "principal", "staff", "director", "5+ years" → Senior
- Default to Mid-level if ambiguous

ENTRY-LEVEL SCORING:
- Academic projects, capstone work, dissertations, hackathons, internship contributions, open source, and self-built portfolio pieces are VALID proxies for years_experience
- Set has_projects = true if ANY of the above exist
- has_metrics = true if ANY quantifiable result exists: GPA, class rank, competition placement, project scale (users, lines of code, dataset size), or internship outcome
- match_score should reflect skill potential demonstrated through education + projects, not just formal work history
- Do NOT penalise an Entry-level candidate for 0 years_experience — that is the expected state; years_experience should be returned as 0

EXPERIENCE vs CERTIFICATIONS:
- Real-world delivered projects ALWAYS outweigh certifications
- Senior candidates: certifications are nearly irrelevant unless highly specialised
- Mid-level: certifications provide marginal signal
- Entry-level: certifications can indicate initiative and baseline knowledge

RECOMMENDATIONS:
- NEVER recommend a skill already matched or inferable
- NEVER recommend generic technologies unless they genuinely boost competitiveness for THIS specific role
- Roadmaps must be concrete and actionable — name actual free resources (freeCodeCamp, Kaggle, official docs, YouTube channels)
- trending_for_role must reflect 2025-2026 market reality for this specific role

TRENDING NARRATIVE:
- trending_narrative must be written as bullet points — each starting with "- " on its own line
- 3-5 bullets MAX — no padding, no filler
- Each bullet is one specific, punchy insight about this role's market right now — name the tool, the shift, or the expectation
- If a bullet could apply to any role, cut it
- Cover the most important signals: what's moved from optional to required, what interviewers probe now, what the top 10% have that others don't

SCORING CALIBRATION (match_score) — anchor to these bands, do not freestyle:
- 90-100: covers ALL must-haves + most strongly-expected, with proven delivery evidence
- 75-89: covers all must-haves, some strongly-expected; solid evidence
- 60-74: covers most must-haves; gaps are learnable, core foundation is present
- 40-59: covers roughly half the must-haves; meaningful retraining needed
- 20-39: only peripheral overlap with the role
- 0-19: no meaningful match
Base the score ONLY on evidence present in the CV text. Never award points for
skills you cannot point to. When uncertain between two bands, pick the lower.

EVIDENCE COUNTS (extract, do not estimate):
- quantified_achievement_count: count DISTINCT bullets containing a concrete number
  (%, revenue, users, time saved, dataset size, rank, GPA). Count them literally.
- project_count: count DISTINCT real projects (personal, academic capstone, open
  source, internship deliverables). A skills list is not a project.

COACHING TONE:
- job_seeker mode: focus on CV improvements, ATS keywords, interview readiness, quick wins to land interviews
- professional mode: focus on staying current, career progression, promotion readiness, industry positioning"""


def _parse_experience_years(exp_str: str) -> int:
    nums = re.findall(r"\d+", str(exp_str))
    return int(nums[0]) if nums else 1


def _roadmap_instruction(job_role: str) -> str:
    return f"""For the top 3 priority_gaps only, include a "roadmap" object:
{{
  "timeline": "<realistic timeline e.g. 4-6 weeks>",
  "steps": [
    "<Step 1: The hands-on starting point. Name a specific free resource, GitHub repo to clone and study, or beginner project to build. Be exact — e.g. 'Follow the official FastAPI tutorial and build a TODO API (free, ~3h at fastapi.tiangolo.com)' or 'Work through Mode Analytics free SQL tutorial — 12 lessons, ~4h total'>",
    "<Step 2: Deepen with deliberate practice. Name the exact platform, open-source repo to contribute to, or real exercise — e.g. 'Solve 20 medium SQL problems on StrataScratch using real company datasets' or 'Read Designing Data-Intensive Applications ch. 1-3 (Kleppmann) and implement the examples'. NOT just practice more.>",
    "<Step 3: Prove it publicly. Build something tangible — name exactly what to build, where to host it, and what makes a {job_role} recruiter notice it — e.g. 'Deploy a dashboard on Streamlit Cloud using a public Kaggle dataset, add it to CV and GitHub with a README showing methodology'>"
  ],
  "milestone": "<concrete, specific deliverable — e.g. 'A GitHub repo with 3 SQL case studies from real company interview questions, linked in the CV projects section'>"
}}
CRITICAL for roadmap steps:
- Do NOT default to certifications for Mid/Senior candidates — they add nearly zero signal
- Priority order: hands-on project > open source contribution > practice platform with real data > expert community > practitioner book/course
- Name specific free resources: official docs, freeCodeCamp, fast.ai, Kaggle notebooks, The Odin Project, CS50, MIT OpenCourseWare, practitioner YouTube channels, Discord/Slack communities, subreddits with active mentors, GitHub repos with good-first-issues
- Think: what would a senior {job_role} at a top company tell a mentee to do? That is the step.
- Every step must be completable with a clear end state — not a category, a task
For remaining priority_gaps set "roadmap": null."""


def _build_prompt(cv_text: str, job_role: str, role_profile: RoleProfile, user_mode: str) -> str:
    must_have = ", ".join(role_profile["must_have"])
    strongly_expected = ", ".join(role_profile.get("strongly_expected", []))
    nice_to_have = ", ".join(role_profile["nice_to_have"])
    competitive_adv = ", ".join(role_profile.get("competitive_advantage", []))
    certifications = ", ".join(role_profile.get("relevant_certifications", []))
    min_exp = role_profile["min_experience_years"]

    mode_instruction = (
        "The user is ACTIVELY JOB HUNTING. Tailor career_advice to CV improvements, ATS optimization, and interview readiness."
        if user_mode == "job_seeker"
        else "The user is CURRENTLY EMPLOYED and wants to stay competitive and progress. Tailor career_advice to skill currency, promotion readiness, and industry positioning."
    )

    return f"""You are a senior hiring manager, technical recruiter, and career coach with deep knowledge of the {job_role} market in 2025-2026.

{mode_instruction}

ROLE: {job_role}
- Must-have skills: {must_have}
- Strongly expected: {strongly_expected}
- Nice-to-have: {nice_to_have}
- Competitive advantage: {competitive_adv}
- Relevant certifications: {certifications}
- Minimum experience: {min_exp} year(s)

{_SEMANTIC_RULES}

CV TEXT:
{cv_text}

Think like a senior hiring manager reviewing hundreds of CVs. Before scoring, reason about what stands out and what the dealbreaker is.

For learning_path in each priority gap: research and write the optimal way to build this specific skill in 2025-2026. Name exact platforms, repos, project types, or communities — what a senior {job_role} practitioner would recommend to a mentee.

Return ONLY a raw JSON object. No markdown, no backticks, no explanation — just the JSON.

{{
  "seniority_level": "<Entry-level|Mid-level|Senior>",
  "reasoning": "<2-3 sentences: hiring manager perspective — what stands out, what's missing, why this score>",
  "matched_skills": ["skills explicitly present OR reasonably inferable"],
  "inferred_skills": ["skills demonstrably implied by experience even if not explicitly stated"],
  "missing_skills": ["skills genuinely absent with no inference path — be precise, not exhaustive"],
  "recommended_skills": ["3-5 genuinely novel skills not present or inferable that would most strengthen this {job_role} application"],
  "unique_strengths": ["2-4 standout qualities that differentiate this candidate from typical {job_role} applicants"],
  "skill_tier_match": {{
    "must_have_matched": ["which must-have skills are present or inferred"],
    "strongly_expected_matched": ["which strongly-expected skills are present or inferred"],
    "nice_to_have_matched": ["which nice-to-have skills are present or inferred"],
    "competitive_advantage_matched": ["which competitive-advantage skills are present or inferred"]
  }},
  "trending_for_role": ["3-5 skills/tools that are genuinely trending for {job_role} in 2025-2026 that this candidate could explore"],
  "trending_narrative": "<3-5 bullet points max, each on its own line starting with '- '. No filler. Each bullet is one specific, punchy insight about what's driving this role's market right now — name the tool, the shift, or the expectation. If it could apply to any role, cut it.>",
  "years_experience": <integer>,
  "has_projects": <true|false>,
  "has_metrics": <true|false>,
  "quantified_achievement_count": <integer — literal count of distinct quantified bullets>,
  "project_count": <integer — literal count of distinct real projects>,
  "certifications": ["certifications found in CV"],
  "match_score": <integer 0-100>,
  "keyword_alignment": <integer 0-100>,
  "soft_skills_evidence": <true|false>,
  "career_advice": "<1-2 sentences tailored to user mode — specific, not generic>",
  "ai_summary": "<2-3 sentence plain-English fit summary naming strongest asset and biggest gap>",
  "coaching": {{
    "priority_gaps": [
      {{
        "type": "<skill|soft_skill|certification|project>",
        "item": "<specific skill or gap>",
        "impact": "<high|medium|low>",
        "employability_tier": "<required_for_employability|helpful_for_competitiveness|exceptional_differentiator>",
        "reason": "<one sentence: why this gap matters for a {job_role} recruiter>",
        "action": "<What a senior mentor in this field would tell this candidate to do — specific and practical. Not 'take a course'. Instead: build X project, contribute to Y open source repo, solve Z problems on [named platform], join [specific community], read [specific book by a practitioner], or complete [specific free resource]. Name it exactly.>",
        "rewrite_hint": "<suggest how to rewrite a specific CV bullet — quote before and suggest after. null if not applicable>",
        "learning_path": "<The optimal way to build this specific skill — researched, specific, 2-4 sentences. Name exact platforms (Kaggle, StrataScratch, Exercism, fast.ai, LeetCode, etc.), GitHub repos, practitioner books, communities (Discord servers, subreddits), or project types that build real signal for a {job_role} recruiter. What would top practitioners in this field actually recommend? No certifications for Mid/Senior unless truly specialised.>"
      }}
    ],
    "quick_wins": ["<specific wording, keyword, or metric changes the candidate can make to their CV today>"],
    "longer_term": ["<portfolio projects or skill deepening — certifications only if Entry-level>"],
    "overall_coaching_summary": "<1-2 sentences: most impactful coaching message for this specific candidate>"
  }}
}}"""


def _build_custom_jd_prompt(cv_text: str, researched_profile: dict, user_mode: str) -> str:
    profile_json = json.dumps(researched_profile, indent=2)
    role_title = researched_profile.get("role_title", "this role")

    mode_instruction = (
        "The user is ACTIVELY JOB HUNTING. Tailor career_advice to CV improvements, ATS optimization, and interview readiness."
        if user_mode == "job_seeker"
        else "The user is CURRENTLY EMPLOYED and wants to stay competitive and progress. Tailor career_advice to skill currency, promotion readiness, and industry positioning."
    )

    return f"""You are a senior hiring manager, technical recruiter, and career coach with deep 2025-2026 market knowledge.

{mode_instruction}

Role Profile (researched from current market data):
{profile_json}

{_SEMANTIC_RULES}

Candidate CV:
{cv_text}

Think like a senior hiring manager reviewing hundreds of CVs. Before scoring, reason about what stands out and what the dealbreaker is.

For learning_path in each priority gap: research and write the optimal way to build this specific skill in 2025-2026. Name exact platforms, repos, project types, or communities — what a senior {role_title} practitioner would recommend to a mentee.

Return ONLY a raw JSON object. No markdown, no backticks, no explanation — just the JSON.

{{
  "seniority_level": "<Entry-level|Mid-level|Senior>",
  "reasoning": "<2-3 sentences: hiring manager perspective — what stands out, what's missing, why this score>",
  "matched_skills": ["skills explicitly present OR reasonably inferable"],
  "inferred_skills": ["skills demonstrably implied by experience even if not explicitly stated"],
  "missing_skills": ["skills genuinely absent with no inference path"],
  "recommended_skills": ["3-5 genuinely novel skills that would most strengthen this {role_title} application"],
  "unique_strengths": ["2-4 standout qualities that differentiate this candidate"],
  "skill_tier_match": {{
    "must_have_matched": [],
    "strongly_expected_matched": [],
    "nice_to_have_matched": [],
    "competitive_advantage_matched": []
  }},
  "trending_for_role": ["3-5 genuinely trending skills/tools for {role_title} in 2025-2026"],
  "trending_narrative": "<3-5 bullet points max, each on its own line starting with '- '. No filler. Each bullet is one specific, punchy insight about what's driving this role's market right now — name the tool, the shift, or the expectation. If it could apply to any role, cut it.>",
  "years_experience": <integer>,
  "has_projects": <true|false>,
  "has_metrics": <true|false>,
  "quantified_achievement_count": <integer — literal count of distinct quantified bullets>,
  "project_count": <integer — literal count of distinct real projects>,
  "certifications": ["certifications found in CV"],
  "match_score": <integer 0-100>,
  "keyword_alignment": <integer 0-100>,
  "soft_skills_evidence": <true|false>,
  "career_advice": "<1-2 sentences tailored to user mode>",
  "ai_summary": "<2-3 sentence fit summary naming strongest asset and biggest gap>",
  "coaching": {{
    "priority_gaps": [
      {{
        "type": "<skill|soft_skill|certification|project>",
        "item": "<specific gap>",
        "impact": "<high|medium|low>",
        "employability_tier": "<required_for_employability|helpful_for_competitiveness|exceptional_differentiator>",
        "reason": "<one sentence why this matters for {role_title}>",
        "action": "<What a senior mentor in this field would tell this candidate to do — specific and practical. Not 'take a course'. Instead: build X project, contribute to Y open source repo, solve Z problems on [named platform], join [specific community], read [specific book by a practitioner], or complete [specific free resource]. Name it exactly.>",
        "rewrite_hint": "<CV rewrite suggestion or null>",
        "learning_path": "<The optimal way to build this specific skill — researched, specific, 2-4 sentences. Name exact platforms (Kaggle, StrataScratch, Exercism, fast.ai, LeetCode, etc.), GitHub repos, practitioner books, communities (Discord servers, subreddits), or project types that build real signal for a {role_title} recruiter. What would top practitioners in this field actually recommend? No certifications for Mid/Senior unless truly specialised.>"
      }}
    ],
    "quick_wins": ["<specific CV wording changes today>"],
    "longer_term": ["<skill deepening or projects — certifications only if Entry-level>"],
    "overall_coaching_summary": "<1-2 sentences most impactful coaching message>"
  }}
}}"""


def _build_raw_jd_prompt(cv_text: str, raw_jd: str, user_mode: str) -> str:
    mode_instruction = (
        "The user is ACTIVELY JOB HUNTING for this specific role. Tailor career_advice to CV improvements, ATS optimization, and what would make this specific application stronger."
        if user_mode == "job_seeker"
        else "The user is CURRENTLY EMPLOYED and exploring this role. Tailor career_advice to skill gaps and what to build before applying."
    )

    return f"""You are a senior hiring manager, technical recruiter, and career coach with deep 2025-2026 market knowledge.

{mode_instruction}

JOB DESCRIPTION (ignore legal/EEO boilerplate — focus on skills, requirements, responsibilities):
\"\"\"
{raw_jd[:3000]}
\"\"\"

CANDIDATE CV:
\"\"\"
{cv_text[:3000]}
\"\"\"

{_SEMANTIC_RULES}

Extract a clean job title from the JD. Include it as "_role_title".
Think like a senior hiring manager reviewing hundreds of CVs. Before scoring, reason about what stands out and what the dealbreaker is.

For learning_path in each priority gap: research and write the optimal way to build this specific skill in 2025-2026. Name exact platforms, repos, project types, or communities — what a top practitioner in this field would recommend to a mentee.

Return ONLY a raw JSON object. No markdown, no backticks, no explanation — just the JSON.

{{
  "_role_title": "<clean job title from JD>",
  "seniority_level": "<Entry-level|Mid-level|Senior>",
  "reasoning": "<2-3 sentences: hiring manager perspective — what stands out, what's missing, why this score>",
  "matched_skills": ["skills explicitly present OR reasonably inferable"],
  "inferred_skills": ["skills implied by demonstrated experience"],
  "missing_skills": ["skills the JD requires that are genuinely absent"],
  "recommended_skills": ["3-5 genuinely novel skills to strengthen this application"],
  "unique_strengths": ["2-4 standout qualities that differentiate this candidate"],
  "skill_tier_match": {{
    "must_have_matched": [],
    "strongly_expected_matched": [],
    "nice_to_have_matched": [],
    "competitive_advantage_matched": []
  }},
  "trending_for_role": ["3-5 genuinely trending skills/tools for this role type in 2025-2026"],
  "trending_narrative": "<3-5 bullet points max, each on its own line starting with '- '. No filler. Each bullet is one specific, punchy insight about what's driving this role's market right now — name the tool, the shift, or the expectation. If it could apply to any role, cut it.>",
  "years_experience": <integer>,
  "has_projects": <true|false>,
  "has_metrics": <true|false>,
  "quantified_achievement_count": <integer — literal count of distinct quantified bullets>,
  "project_count": <integer — literal count of distinct real projects>,
  "certifications": ["certifications found in CV"],
  "match_score": <integer 0-100>,
  "keyword_alignment": <integer 0-100>,
  "soft_skills_evidence": <true|false>,
  "career_advice": "<1-2 sentences tailored to user mode and this specific JD>",
  "ai_summary": "<2-3 sentence fit summary naming strongest asset and biggest gap>",
  "coaching": {{
    "priority_gaps": [
      {{
        "type": "<skill|soft_skill|certification|project>",
        "item": "<specific gap>",
        "impact": "<high|medium|low>",
        "employability_tier": "<required_for_employability|helpful_for_competitiveness|exceptional_differentiator>",
        "reason": "<one sentence why this gap matters for this specific JD>",
        "action": "<What a senior mentor in this field would tell this candidate to do — specific and practical. Not 'take a course'. Instead: build X project, contribute to Y open source repo, solve Z problems on [named platform], join [specific community], read [specific book by a practitioner], or complete [specific free resource]. Name it exactly.>",
        "rewrite_hint": "<CV rewrite suggestion or null>",
        "learning_path": "<The optimal way to build this specific skill — researched, specific, 2-4 sentences. Name exact platforms (Kaggle, StrataScratch, Exercism, fast.ai, LeetCode, etc.), GitHub repos, practitioner books, communities (Discord servers, subreddits), or project types that build real signal for this role's recruiter. What would top practitioners in this field actually recommend? No certifications for Mid/Senior unless truly specialised.>"
      }}
    ],
    "quick_wins": ["<specific wording or keyword changes today to better match this JD>"],
    "longer_term": ["<skill deepening or projects — certifications only if Entry-level>"],
    "overall_coaching_summary": "<1-2 sentences most impactful coaching message for this specific application>"
  }}
}}"""


def analyse_cv(cv_text: str, job_role: str, role_profile: RoleProfile, user_mode: str = "job_seeker") -> dict:
    try:
        response = _get_client().chat.completions.create(
            model=OPENAI_MODEL,
            messages=[{"role": "user", "content": _build_prompt(cv_text, job_role, role_profile, user_mode)}],
            temperature=0,
            seed=1234,
            response_format={"type": "json_object"},
            max_tokens=3200,
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
  "competitive_advantage_skills": ["<skills that make a candidate stand out above others>"],
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
            temperature=0,
            seed=1234,
            response_format={"type": "json_object"},
            max_tokens=1000,
        )
        raw = response.choices[0].message.content or ""
    except Exception as exc:
        raise ValueError(f"Role research failed: {exc}") from exc

    try:
        return json.loads(raw)
    except json.JSONDecodeError as exc:
        raise ValueError("Role research returned an unexpected format. Please try again.") from exc


def analyse_cv_with_research(cv_text: str, researched_profile: dict, user_mode: str = "job_seeker") -> dict:
    """Prompt 2: analyse CV against an OpenAI-researched role profile."""
    try:
        response = _get_client().chat.completions.create(
            model=OPENAI_MODEL,
            messages=[{"role": "user", "content": _build_custom_jd_prompt(cv_text, researched_profile, user_mode)}],
            temperature=0,
            seed=1234,
            response_format={"type": "json_object"},
            max_tokens=3200,
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


def analyse_cv_with_raw_jd(cv_text: str, raw_jd: str, user_mode: str = "job_seeker") -> dict:
    """Analyse CV directly against a raw job description — no research step needed."""
    try:
        response = _get_client().chat.completions.create(
            model=OPENAI_MODEL,
            messages=[{"role": "user", "content": _build_raw_jd_prompt(cv_text, raw_jd, user_mode)}],
            temperature=0,
            seed=1234,
            response_format={"type": "json_object"},
            max_tokens=3200,
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
