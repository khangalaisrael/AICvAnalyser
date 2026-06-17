import re
import pdfplumber


def extract_text(pdf_file: object) -> str:
    try:
        with pdfplumber.open(pdf_file) as pdf:
            pages = [page.extract_text() or "" for page in pdf.pages]
        text = "\n".join(pages).strip()
        return text if text else ""
    except Exception:
        return ""


def is_valid_cv_text(text: str, min_chars: int = 100) -> bool:
    return len(text) >= min_chars


def check_cv_quality(cv_text: str) -> dict:
    """Deterministic CV health checklist — no AI, instant."""
    text_lower = cv_text.lower()
    words = cv_text.split()
    word_count = len(words)

    has_quantified = bool(re.search(
        r'\d+\s*%|\d+x|\$[\d,]+|\£[\d,]+|\d+\s*(users?|customers?|clients?|team members?|people|engineers?|reports?)',
        cv_text, re.I
    ))
    has_action_verbs = bool(re.search(
        r'\b(led|built|designed|implemented|improved|reduced|increased|managed|developed|delivered|architected|launched|optimised|automated|created|owned|drove|scaled|mentored|negotiated|deployed)\b',
        cv_text, re.I
    ))
    has_contact_info = bool(re.search(r'[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}', cv_text))
    has_linkedin = bool(re.search(r'linkedin', text_lower))
    has_github = bool(re.search(r'github', text_lower))
    word_count_ok = 300 <= word_count <= 1200
    has_skills_section = bool(re.search(r'\bskills?\b', text_lower))
    has_profile_summary = bool(re.search(
        r'\b(summary|profile|about me|objective|personal statement|career overview)\b', text_lower
    ))

    # Weighted ATS score
    ats_score = (
        (25 if has_quantified else 0)
        + (15 if has_action_verbs else 0)
        + (15 if has_contact_info else 0)
        + (15 if has_skills_section else 0)
        + (10 if has_linkedin else 0)
        + (10 if has_github else 0)
        + (5 if word_count_ok else 0)
        + (5 if has_profile_summary else 0)
    )

    return {
        "has_quantified_achievements": has_quantified,
        "has_action_verbs": has_action_verbs,
        "has_contact_info": has_contact_info,
        "has_linkedin": has_linkedin,
        "has_github": has_github,
        "word_count_ok": word_count_ok,
        "word_count": word_count,
        "has_skills_section": has_skills_section,
        "has_profile_summary": has_profile_summary,
        "ats_score": ats_score,
    }
