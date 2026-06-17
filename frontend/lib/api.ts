import { createClient } from "@/lib/supabase/client";
import type { CandidateSummary, CandidateDetail, PipelineStatus } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function getAuthHeader(): Promise<Record<string, string>> {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Not authenticated");
  return { Authorization: `Bearer ${token}` };
}

export async function analyseCv(
  file: File,
  customJd?: string,
  mode: "aspiring" | "apply" = "aspiring",
  userMode: "job_seeker" | "professional" = "job_seeker",
): Promise<CandidateDetail> {
  const headers = await getAuthHeader();
  const form = new FormData();
  form.append("file", file);
  form.append("role", "");
  form.append("mode", mode);
  form.append("user_mode", userMode);
  if (customJd?.trim()) form.append("custom_jd", customJd.trim());

  const res = await fetch(`${API_URL}/analyse`, { method: "POST", headers, body: form });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return {
    id: data.id,
    candidate_name: data.candidate_name ?? "",
    role: data.role,
    ai: data.ai,
    scoring: data.scoring,
    pipeline_status: null,
    researched_role: data.researched_role ?? undefined,
    cv_checklist: data.cv_checklist ?? undefined,
    user_mode: data.user_mode ?? undefined,
  };
}

export async function fetchCandidates(): Promise<CandidateSummary[]> {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_URL}/candidates`, { headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchCandidate(id: string): Promise<CandidateDetail> {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_URL}/candidates/${id}`, { headers });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  // Normalise nested shape from GET /candidates/{id}
  return {
    id,
    candidate_name: data.candidate_name ?? "",
    role: data.role,
    ai: data.ai,
    scoring: data.scoring,
    pipeline_status: data.pipeline_status ?? null,
    researched_role: data.researched_role ?? undefined,
  };
}

export async function deleteCandidate(id: string): Promise<void> {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_URL}/candidates/${id}`, { method: "DELETE", headers });
  if (!res.ok) throw new Error(await res.text());
}

export async function updatePipelineStatus(
  id: string,
  status: PipelineStatus
): Promise<void> {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_URL}/candidates/${id}`, {
    method: "PATCH",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ pipeline_status: status }),
  });
  if (!res.ok) throw new Error(await res.text());
}

