import json
import re
from openai import OpenAI
from config import OPENAI_API_KEY, OPENAI_MODEL
from pdf_processor import check_cv_quality

_client: OpenAI | None = None


def _get_client() -> OpenAI:
    global _client
    if _client is None:
        _client = OpenAI(api_key=OPENAI_API_KEY)
    return _client


def rewrite_cv_ledger(
    ledger: dict,
    target_role: str,
    user_answers: dict[str, str] | None = None,
    researched_role: dict | None = None,
) -> dict:
    """
    Rewrite a CV facts ledger toward the target role's vocabulary.
    Every output claim must trace to the original ledger or user_answers.
    Returns the rewritten ledger with provenance and metric prompts.
    """
    answers = user_answers or {}
    role_context = ""
    if researched_role:
        required = ", ".join(researched_role.get("required_skills", [])[:8])
        role_context = f"\nKey skills employers want for this role: {required}"

    prompt = f"""You are an expert career consultant and CV writer helping someone target the role of "{target_role}".

CORE RULE — REFRAME, NEVER FABRICATE:
You may rephrase, strengthen, and reframe. You may NEVER invent a skill, employer, date, qualification, metric, or achievement not already present in the source ledger.

The legitimate move is HONEST REFRAMING:
✓ "managed social media" → "managed multi-channel social media presence" (same fact, target vocabulary)
✓ "helped with website" → "drove website optimisation initiatives" (stronger verb, same fact)
✗ "increased social media by 40%" ← BANNED unless 40% is in the original
✗ Any skill, tool, or technology not mentioned in the original ledger

REWRITING PRINCIPLES:
1. Mirror the target role's vocabulary and terminology where the candidate's real experience maps to it
2. Lead every bullet with a strong action verb (Led, Built, Designed, Delivered, Implemented, Optimised, etc.)
3. Specific > vague. "Managed 3-person team" > "managed a team" — but ONLY if the original mentions "3-person"
4. If a bullet would be significantly stronger with a number/outcome NOT in the source, set needs_metric=true and write a concise metric_prompt question instead of inventing a number
5. Preserve employer names, job titles, dates, qualifications, and existing metrics EXACTLY
6. Improve the professional summary to lead with the candidate's strongest hook for this specific role{role_context}
7. CRITICAL: Return the "contact" object UNCHANGED — name, email, phone, location, links must be identical to the source
8. CRITICAL: Return the "skills" array UNCHANGED — do not add, remove, or rename any skill

SOURCE FACTS LEDGER (the complete, exhaustive set of true claims you may draw from):
{json.dumps(ledger, indent=2)}

USER-SUPPLIED METRIC ANSWERS (incorporate these into the relevant bullets):
{json.dumps(answers, indent=2) if answers else "{}"}

Return the rewritten CV in the same JSON structure as the ledger, with these additions to each bullet:
- "source_ids": [list of original bullet ids this derives from] — keep the same structure
- "needs_metric": true if a specific number/outcome would materially strengthen this bullet but isn't present
- "metric_prompt": "<one specific question to ask the user, e.g. 'How many customers did you support?'>" if needs_metric, else null

Preserve ALL top-level keys: contact, summary, experience, education, skills, projects.
Keep all IDs (exp1, b1, ed1, p1, etc.) identical to the source.

Return ONLY valid JSON. No markdown, no explanation."""

    try:
        response = _get_client().chat.completions.create(
            model=OPENAI_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.25,
            max_tokens=6000,
        )
        raw = response.choices[0].message.content or ""
    except Exception as exc:
        raise ValueError(f"CV rewrite failed: {exc}") from exc

    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.split("```", 2)[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.rsplit("```", 1)[0].strip()

    try:
        rewritten = json.loads(raw)
    except json.JSONDecodeError as exc:
        raise ValueError(f"Rewrite returned invalid JSON: {exc}") from exc

    # Always preserve contact and skills exactly from the source ledger —
    # the AI must never add, remove, or rephrase these.
    rewritten["contact"] = ledger.get("contact", {})
    rewritten["skills"] = ledger.get("skills", [])

    return rewritten


def verify_rewrite(original_ledger: dict, rewritten: dict, user_answers: dict[str, str]) -> dict:
    """
    Rule-based verification: check the rewritten CV doesn't introduce new entities
    not present in the original ledger or user answers.
    Returns {verified: bool, flagged_items: list[str]}
    """
    # Build the set of allowed entities from the original ledger
    allowed: set[str] = set()

    # Skills
    for s in original_ledger.get("skills", []):
        allowed.update(w.lower() for w in s.split())

    # Collect all original bullet text
    original_text_parts: list[str] = []
    for exp in original_ledger.get("experience", []):
        original_text_parts.append(exp.get("title", "").lower())
        original_text_parts.append(exp.get("org", "").lower())
        for b in exp.get("bullets", []):
            original_text_parts.append(b.get("text", "").lower())
    for proj in original_ledger.get("projects", []):
        for b in proj.get("bullets", []):
            original_text_parts.append(b.get("text", "").lower())
    original_text_parts.append(original_ledger.get("summary", "").lower())
    for ans in user_answers.values():
        original_text_parts.append(ans.lower())

    original_text = " ".join(original_text_parts)

    # Extract all numbers from the original (metrics that may appear)
    original_numbers: set[str] = set(re.findall(r"\d+(?:[.,]\d+)?(?:%|k|m|x)?", original_text))

    # Extract all numbers from the rewritten bullets
    rewritten_text_parts: list[str] = []
    for exp in rewritten.get("experience", []):
        for b in exp.get("bullets", []):
            rewritten_text_parts.append(b.get("text", "").lower())
    for proj in rewritten.get("projects", []):
        for b in proj.get("bullets", []):
            rewritten_text_parts.append(b.get("text", "").lower())
    rewritten_text = " ".join(rewritten_text_parts)
    rewritten_numbers: set[str] = set(re.findall(r"\d+(?:[.,]\d+)?(?:%|k|m|x)?", rewritten_text))

    # Flag numbers that appear in the rewrite but not in the original (potential fabrications)
    flagged_numbers = rewritten_numbers - original_numbers

    # Check for new employer/org names (exact match check)
    original_orgs = {exp.get("org", "").lower() for exp in original_ledger.get("experience", [])}
    rewritten_orgs = {exp.get("org", "").lower() for exp in rewritten.get("experience", [])}
    new_orgs = rewritten_orgs - original_orgs - {""}

    flagged_items: list[str] = []
    if flagged_numbers:
        flagged_items.extend(
            f"New metric not in source CV: '{n}'" for n in sorted(flagged_numbers)
            if n not in {"0", "1", "2", "3", "4", "5"}  # ignore trivial list numbers
        )
    if new_orgs:
        flagged_items.extend(f"New employer not in source CV: '{o}'" for o in new_orgs)

    return {
        "verified": len(flagged_items) == 0,
        "flagged_items": flagged_items,
    }


def ledger_to_plain_text(ledger: dict) -> str:
    """Serialise a CV ledger to plain text for ATS checking."""
    lines: list[str] = []
    contact = ledger.get("contact", {})
    if contact.get("name"):
        lines.append(contact["name"])
    for field in ("email", "phone", "location"):
        if contact.get(field):
            lines.append(contact[field])
    if contact.get("links"):
        lines.extend(contact["links"])
    if ledger.get("summary"):
        lines.append(ledger["summary"])
    for exp in ledger.get("experience", []):
        lines.append(f"{exp.get('title', '')} at {exp.get('org', '')}")
        lines.append(f"{exp.get('start', '')} – {exp.get('end', '')}")
        for bullet in exp.get("bullets", []):
            lines.append(f"• {bullet.get('text', '')}")
    skills = ledger.get("skills", [])
    if skills:
        lines.append("Skills: " + ", ".join(skills))
    for edu in ledger.get("education", []):
        parts = [edu.get("qualification", ""), edu.get("institution", ""), edu.get("year", "")]
        lines.append(" ".join(p for p in parts if p))
    for proj in ledger.get("projects", []):
        lines.append(proj.get("name", ""))
        for bullet in proj.get("bullets", []):
            lines.append(f"• {bullet.get('text', '')}")
    return "\n".join(line for line in lines if line.strip())


def compute_ats_scores(original_text: str, rewritten_ledger: dict) -> tuple[dict, dict]:
    """Return (ats_before, ats_after) using the existing deterministic checker."""
    rewritten_text = ledger_to_plain_text(rewritten_ledger)
    before = check_cv_quality(original_text)
    after = check_cv_quality(rewritten_text)
    return before, after


def collect_metric_prompts(rewritten: dict) -> list[dict]:
    """Extract all bullets flagged as needing a metric from the rewritten ledger."""
    prompts: list[dict] = []
    for exp in rewritten.get("experience", []):
        for b in exp.get("bullets", []):
            if b.get("needs_metric") and b.get("metric_prompt"):
                prompts.append({
                    "bullet_id": b["id"],
                    "question": b["metric_prompt"],
                    "context": b.get("text", ""),
                    "section": f"{exp.get('title', '')} at {exp.get('org', '')}",
                })
    for proj in rewritten.get("projects", []):
        for b in proj.get("bullets", []):
            if b.get("needs_metric") and b.get("metric_prompt"):
                prompts.append({
                    "bullet_id": b["id"],
                    "question": b["metric_prompt"],
                    "context": b.get("text", ""),
                    "section": proj.get("name", "Project"),
                })
    return prompts
