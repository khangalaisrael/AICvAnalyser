import io
import re

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

from middleware.auth import get_current_user
from services.ai_client import (
    analyse_cv,
    analyse_cv_with_raw_jd,
    analyse_cv_with_research,
    research_role,
    _parse_experience_years,
)
from services.database import save_analysis_to_supabase
from services.pdf_processor import extract_text, is_valid_cv_text
from services.role_profiles import RoleProfile, get_profile
from services.scoring_engine import run_scoring

router = APIRouter()


def _profile_from_ai(ai_result: dict) -> RoleProfile:
    """Build a minimal RoleProfile from an AI result (used for raw-JD mode)."""
    return {
        "must_have": [],
        "nice_to_have": [],
        "min_experience_years": max(1, ai_result.get("years_experience", 1)),
    }


@router.post("/analyse")
async def analyse(
    file: UploadFile = File(...),
    role: str = Form(None),
    custom_jd: str = Form(None),
    mode: str = Form("role"),
    user_id: str = Depends(get_current_user),
):
    if mode in ("aspiring", "apply") and not custom_jd:
        raise HTTPException(status_code=400, detail="Provide a job description for this mode")
    if mode == "role" and not role:
        raise HTTPException(status_code=400, detail="Provide either a role or a job description")

    pdf_bytes = await file.read()
    cv_text = extract_text(io.BytesIO(pdf_bytes))

    if not is_valid_cv_text(cv_text):
        raise HTTPException(
            status_code=400,
            detail="Could not extract meaningful text from the PDF. Is it a scanned image?",
        )

    researched_role_data = None

    if mode == "apply" and custom_jd:
        # Direct JD match — no research step, AI extracts role inline
        ai_result = analyse_cv_with_raw_jd(cv_text, custom_jd.strip())
        effective_role = ai_result.pop("_role_title", "Custom Role")
        profile = _profile_from_ai(ai_result)

    elif custom_jd:
        # Aspiring mode (or legacy): research role first, then analyse
        try:
            researched_role_data = research_role(custom_jd.strip())
        except ValueError as exc:
            raise HTTPException(status_code=422, detail=str(exc))

        profile: RoleProfile = {
            "must_have": researched_role_data.get("required_skills", [])[:10],
            "nice_to_have": researched_role_data.get("nice_to_have_skills", [])[:10],
            "min_experience_years": _parse_experience_years(researched_role_data.get("experience_years", "1")),
        }
        ai_result = analyse_cv_with_research(cv_text, researched_role_data)
        effective_role = researched_role_data.get("role_title") or "Custom Role"

    else:
        # Predefined role (quick match)
        profile = get_profile(role)
        if not profile:
            raise HTTPException(status_code=400, detail=f"Unknown role: {role}")
        ai_result = analyse_cv(cv_text, role, profile)
        effective_role = role

    scoring = run_scoring(ai_result, profile)

    # Compute score delta for top skill gap — deterministic, no extra API call
    coaching = ai_result.get("coaching") or {}
    priority_gaps = coaching.get("priority_gaps") or []
    top_skill_gap = next((g for g in priority_gaps if g.get("type") == "skill"), None)
    if top_skill_gap and isinstance(top_skill_gap.get("item"), str):
        hypothetical = dict(ai_result)
        hypothetical["matched_skills"] = list(ai_result.get("matched_skills") or []) + [top_skill_gap["item"]]
        hypothetical_score = run_scoring(hypothetical, profile).get("final_score", 0)
        delta = max(0, hypothetical_score - scoring["final_score"])
        if delta > 0:
            coaching["score_delta"] = delta
            coaching["score_delta_item"] = top_skill_gap["item"]
            ai_result["coaching"] = coaching

    candidate_name = (file.filename or "").removesuffix(".pdf").replace("_", " ").replace("-", " ").strip()
    row_id = save_analysis_to_supabase(
        user_id, effective_role, scoring, ai_result, candidate_name, researched_role_data
    )

    resp = {
        "id": row_id,
        "ai": ai_result,
        "scoring": scoring,
        "role": effective_role,
        "candidate_name": candidate_name,
    }
    if researched_role_data:
        resp["researched_role"] = researched_role_data
    return resp
