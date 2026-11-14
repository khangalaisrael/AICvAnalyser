from supabase_client import supabase

def save_analysis_to_supabase(user_id, role, scoring, ai_result, candidate_name=""):
    data = {
        "user_id": user_id,
        "role": role,
        "score": scoring["final_score"],
        "verdict": scoring["verdict"],
        "component_scores": scoring["component_scores"],
        "matched_skills": ai_result.get("matched_skills", []),
        "missing_skills": ai_result.get("missing_skills", []),
        "years_experience": ai_result.get("years_experience", 0),
        "match_score": ai_result.get("match_score"),
        "keyword_alignment": ai_result.get("keyword_alignment"),
        "ai_summary": ai_result.get("ai_summary"),
        "candidate_name": candidate_name,
    }
    return supabase.table("analyses").insert(data).execute()


def fetch_recent_analyses(user_id, limit=20):
    result = (
        supabase.table("analyses")
        .select("id, candidate_name, role, score, verdict, created_at")
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
            "initials": "".join(w[0] for w in (r["candidate_name"] or "CV").split()[:2]).upper() or "CV",
        }
        for r in result.data
    ]


def delete_analysis(row_id: str):
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
        "matched_skills":        r.get("matched_skills") or [],
        "missing_skills":        r.get("missing_skills") or [],
        "years_experience":      r.get("years_experience"),
        "certifications":        [],
        "ai_summary":            r.get("ai_summary", ""),
    }
    sc = {
        "final_score":      r["score"],
        "verdict":          r["verdict"],
        "component_scores": r.get("component_scores") or {},
        "knockout":         False,
    }
    return {"ai": ai, "scoring": sc, "role": r["role"]}
