import json
from openai import OpenAI
from config import OPENAI_API_KEY, OPENAI_MODEL

_client: OpenAI | None = None


def _get_client() -> OpenAI:
    global _client
    if _client is None:
        _client = OpenAI(api_key=OPENAI_API_KEY)
    return _client


_STRUCTURE_PROMPT = """You are a precise CV parser. Extract the EXACT content from this CV into structured JSON.

Rules:
- Copy text EXACTLY as written — do not paraphrase, improve, or infer anything not present
- Use "" for missing text fields, [] for missing arrays
- Assign globally unique sequential IDs: b1, b2, b3... for ALL bullets across all sections
- Include EVERY experience entry, EVERY bullet, EVERY education entry, ALL skills, ALL projects
- Do NOT add, summarise, or omit any bullet — copy each one verbatim

SKILLS RULES (critical):
- Extract skills ONLY from the skills section of the CV — do NOT pull in content from volunteering, education, experience, or any other section
- If the CV organises skills into named categories (e.g. "Programming & Software Development: Python, Java"), use skill_groups — one entry per category with its items
- If the CV has a flat ungrouped list of skills, leave skill_groups as [] and put items in skills
- Category/group headers (e.g. "Programming & Software Development") go in "group", NOT in "items" or "skills"
- Never include section headings like "VOLUNTEERING", "OTHER SKILLS", "EDUCATION" as skills

Return ONLY valid JSON. No markdown fences, no explanation.

{
  "contact": {
    "name": "<full name>",
    "email": "<email or ''>",
    "phone": "<phone or ''>",
    "location": "<city/country or ''>",
    "links": ["<url>"]
  },
  "summary": "<professional summary or objective verbatim, or ''>",
  "experience": [
    {
      "id": "exp1",
      "title": "<exact job title>",
      "org": "<exact company name>",
      "start": "<start date>",
      "end": "<end date or 'Present'>",
      "bullets": [
        { "id": "b1", "text": "<exact bullet text>" }
      ]
    }
  ],
  "education": [
    {
      "id": "ed1",
      "qualification": "<exact degree or qualification>",
      "institution": "<exact school or university>",
      "year": "<graduation year or ''>"
    }
  ],
  "skills": ["<individual skill — only if CV has flat ungrouped skills list, otherwise leave []>"],
  "skill_groups": [
    {
      "group": "<category name exactly as written, e.g. 'Programming & Software Development'>",
      "items": ["<individual skill exactly as written>"]
    }
  ],
  "projects": [
    {
      "id": "p1",
      "name": "<project name>",
      "bullets": [
        { "id": "b_p1", "text": "<bullet text>" }
      ]
    }
  ]
}"""


def extract_facts_ledger(cv_text: str) -> dict:
    """Extract CV text into a structured facts ledger. Every fact maps exactly to source text."""
    prompt = f"{_STRUCTURE_PROMPT}\n\nCV TEXT:\n{cv_text}"
    try:
        response = _get_client().chat.completions.create(
            model=OPENAI_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
            max_tokens=3500,
        )
        raw = response.choices[0].message.content or ""
    except Exception as exc:
        raise ValueError(f"Ledger extraction failed: {exc}") from exc

    # Strip accidental markdown fences
    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.split("```", 2)[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.rsplit("```", 1)[0].strip()

    try:
        ledger = json.loads(raw)
    except json.JSONDecodeError as exc:
        raise ValueError(f"Ledger extraction returned invalid JSON: {exc}") from exc

    # Normalise: ensure required top-level keys are present
    ledger.setdefault("contact", {"name": "", "email": "", "phone": "", "location": "", "links": []})
    ledger.setdefault("summary", "")
    ledger.setdefault("experience", [])
    ledger.setdefault("education", [])
    ledger.setdefault("skills", [])
    ledger.setdefault("skill_groups", [])
    ledger.setdefault("projects", [])
    return ledger
