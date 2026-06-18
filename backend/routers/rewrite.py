import io

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from pydantic import BaseModel

from middleware.auth import get_current_user
from services.cv_structurer import extract_facts_ledger
from services.cv_rewriter import (
    rewrite_cv_ledger,
    verify_rewrite,
    compute_ats_scores,
    collect_metric_prompts,
)
from services.pdf_processor import extract_text, is_valid_cv_text

router = APIRouter(prefix="/rewrite", tags=["Rewrite"])


# ── Step 1: Extract facts ledger from PDF ──────────────────────────────────

@router.post("/structure")
async def structure_cv(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user),
):
    """Upload a PDF → return the structured facts ledger and baseline ATS score."""
    pdf_bytes = await file.read()
    cv_text = extract_text(io.BytesIO(pdf_bytes))

    if not is_valid_cv_text(cv_text):
        raise HTTPException(
            status_code=400,
            detail="Could not extract meaningful text from the PDF. Is it a scanned image?",
        )

    try:
        ledger = extract_facts_ledger(cv_text)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))

    from services.pdf_processor import check_cv_quality
    ats_before = check_cv_quality(cv_text)

    return {
        "ledger": ledger,
        "cv_text": cv_text,
        "ats_score_before": ats_before["ats_score"],
        "cv_checklist_before": ats_before,
    }


# ── Step 2: Rewrite + verify + ATS self-QA ────────────────────────────────

class GenerateRequest(BaseModel):
    ledger: dict
    cv_text: str
    target_role: str
    user_answers: dict[str, str] = {}
    researched_role: dict | None = None


@router.post("/generate")
async def generate_rewrite(
    body: GenerateRequest,
    user_id: str = Depends(get_current_user),
):
    """
    Rewrite the CV ledger toward the target role.
    Returns the rewritten ledger, metric prompts, verification result, and ATS score delta.
    """
    try:
        rewritten = rewrite_cv_ledger(
            ledger=body.ledger,
            target_role=body.target_role,
            user_answers=body.user_answers,
            researched_role=body.researched_role,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))

    verification = verify_rewrite(body.ledger, rewritten, body.user_answers)
    ats_before, ats_after = compute_ats_scores(body.cv_text, rewritten)
    metric_prompts = collect_metric_prompts(rewritten)

    return {
        "rewritten": rewritten,
        "metric_prompts": metric_prompts,
        "verified": verification["verified"],
        "flagged_items": verification["flagged_items"],
        "ats_score_before": ats_before["ats_score"],
        "ats_score_after": ats_after["ats_score"],
        "cv_checklist_before": ats_before,
        "cv_checklist_after": ats_after,
    }
