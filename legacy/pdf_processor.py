import pdfplumber


def extract_text(pdf_file: object) -> str:
    """Extract and concatenate text from all pages of a PDF file object."""
    try:
        with pdfplumber.open(pdf_file) as pdf:
            pages = [page.extract_text() or "" for page in pdf.pages]
        text = "\n".join(pages).strip()
        if not text:
            return ""
        return text
    except Exception:
        return ""


def is_valid_cv_text(text: str, min_chars: int = 100) -> bool:
    """Return False if extracted text is too short to be a real CV."""
    return len(text) >= min_chars
