import { createClient } from "@/lib/supabase/client";
import type {
  StructureResponse,
  GenerateRewriteResponse,
  CVLedger,
  RewrittenCVLedger,
} from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function getAuthHeader(): Promise<Record<string, string>> {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Not authenticated");
  return { Authorization: `Bearer ${token}` };
}

export async function structureCv(file: File): Promise<StructureResponse> {
  const headers = await getAuthHeader();
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_URL}/rewrite/structure`, {
    method: "POST",
    headers,
    body: form,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function generateRewrite(
  ledger: CVLedger,
  cvText: string,
  targetRole: string,
  userAnswers: Record<string, string> = {},
): Promise<GenerateRewriteResponse> {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_URL}/rewrite/generate`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      ledger,
      cv_text: cvText,
      target_role: targetRole,
      user_answers: userAnswers,
    }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function downloadPdf(
  rewritten: RewrittenCVLedger,
  accentColor: string = "#f25c54",
  templateId: string = "ats",
): Promise<Blob> {
  const res = await fetch("/api/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rewritten, accentColor, templateId }),
  });
  if (!res.ok) throw new Error("PDF generation failed");
  return res.blob();
}

export async function downloadDocx(rewritten: RewrittenCVLedger): Promise<Blob> {
  const res = await fetch("/api/docx", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rewritten }),
  });
  if (!res.ok) throw new Error("DOCX generation failed");
  return res.blob();
}
