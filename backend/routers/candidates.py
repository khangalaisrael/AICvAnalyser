from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from middleware.auth import get_current_user
from services.database import (
    delete_analysis,
    fetch_full_analysis,
    fetch_recent_analyses,
    update_pipeline_status,
)

router = APIRouter()

VALID_STATUSES = {"HIRE", "HOLD", "REJECT"}


class PipelineUpdate(BaseModel):
    pipeline_status: str


@router.get("/candidates")
async def get_candidates(user_id: str = Depends(get_current_user)):
    return fetch_recent_analyses(user_id, limit=15)


@router.get("/candidates/{candidate_id}")
async def get_candidate(candidate_id: str, user_id: str = Depends(get_current_user)):
    try:
        return fetch_full_analysis(candidate_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Candidate not found")


@router.delete("/candidates/{candidate_id}")
async def remove_candidate(candidate_id: str, user_id: str = Depends(get_current_user)):
    delete_analysis(candidate_id)
    return {"status": "deleted"}


@router.patch("/candidates/{candidate_id}")
async def set_pipeline_status(
    candidate_id: str,
    body: PipelineUpdate,
    user_id: str = Depends(get_current_user),
):
    if body.pipeline_status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail=f"Status must be one of: {', '.join(VALID_STATUSES)}")
    update_pipeline_status(candidate_id, body.pipeline_status)
    return {"status": "updated", "pipeline_status": body.pipeline_status}
