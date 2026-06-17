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
