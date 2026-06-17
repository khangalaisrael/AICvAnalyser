from supabase_client import supabase

VALID_PIPELINE_STATUSES = {"HIRE", "HOLD", "REJECT"}


def save_analysis_to_supabase(
    user_id: str,
    role: str,
    scoring: dict,
    ai_result: dict,
    candidate_name: str = "",
    researched_role: dict | None = None,
) -> str:
    data = {
        "user_id": user_id,
        "role": role,
        "score": scoring["final_score"],
        "verdict": scoring["verdict"],
        "component_scores": scoring.get("component_scores"),
        "matched_skills": ai_result.get("matched_skills", []),
        "missing_skills": ai_result.get("missing_skills", []),
        "recommended_skills": ai_result.get("recommended_skills", []),
        "years_experience": ai_result.get("years_experience", 0),
        "match_score": ai_result.get("match_score"),
        "keyword_alignment": ai_result.get("keyword_alignment"),
        "ai_summary": ai_result.get("ai_summary"),
        "candidate_name": candidate_name,
        "researched_role": researched_role,
        "coaching": ai_result.get("coaching"),
    }
    result = supabase.table("analyses").insert(data).execute()
    return result.data[0]["id"]


def fetch_recent_analyses(user_id: str, limit: int = 20) -> list[dict]:
    result = (
        supabase.table("analyses")
        .select("id, candidate_name, role, score, verdict, pipeline_status, created_at")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )
    return [
        {
            "id": r["id"],
            "name": r["candidate_name"] or "Unknown",
            "role": r["role"],
            "score": r["score"],
            "verdict": r["verdict"],
            "pipeline_status": r.get("pipeline_status"),
            "initials": "".join(w[0] for w in (r["candidate_name"] or "CV").split()[:2]).upper() or "CV",
        }
        for r in result.data
    ]


def delete_analysis(row_id: str) -> None:
    supabase.table("analyses").delete().eq("id", row_id).execute()


def fetch_full_analysis(row_id: str) -> dict:
    result = (
        supabase.table("analyses")
        .select("*")
        .eq("id", row_id)
        .single()
        .execute()
    )
    r = result.data
    ai = {
        "matched_skills": r.get("matched_skills") or [],
        "missing_skills": r.get("missing_skills") or [],
        "recommended_skills": r.get("recommended_skills") or [],
        "years_experience": r.get("years_experience"),
        "certifications": [],
        "ai_summary": r.get("ai_summary", ""),
        "coaching": r.get("coaching"),
    }
    sc = {
        "final_score": r["score"],
        "verdict": r["verdict"],
        "component_scores": r.get("component_scores") or {},
        "knockout": False,
    }
    return {
        "ai": ai,
        "scoring": sc,
        "role": r["role"],
        "pipeline_status": r.get("pipeline_status"),
        "researched_role": r.get("researched_role"),
    }


def update_pipeline_status(row_id: str, status: str) -> None:
    if status not in VALID_PIPELINE_STATUSES:
        raise ValueError(f"Invalid pipeline status: {status}")
    supabase.table("analyses").update({"pipeline_status": status}).eq("id", row_id).execute()
