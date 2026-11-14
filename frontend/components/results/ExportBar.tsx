"use client";

import { useState } from "react";
import type { CandidateDetail } from "@/lib/types";

function summaryText(c: CandidateDetail): string {
  const { ai, scoring } = c;
  const lines = [
    `${c.candidate_name || "CV analysis"} · ${c.role}`,
    `Match score: ${scoring.final_score}/100 (${scoring.verdict})`,
  ];
  if ((ai.matched_skills ?? []).length) lines.push(`Matched: ${ai.matched_skills.slice(0, 8).join(", ")}`);
  if ((ai.missing_skills ?? []).length) lines.push(`Gaps: ${ai.missing_skills.slice(0, 8).join(", ")}`);
  const wins = ai.coaching?.quick_wins ?? [];
  if (wins.length) lines.push(`Quick wins:\n${wins.slice(0, 4).map((w) => `- ${w}`).join("\n")}`);
  lines.push("Analysed with TalentScan");
  return lines.join("\n");
}

const btn: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 7, height: 36, padding: "0 14px",
  borderRadius: 10, border: "1px solid #ecebe3", background: "#fff", color: "#22272f",
  font: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer",
};

/** Download the report as a PDF (via the browser's print dialog) or share a short text summary. */
export function ExportBar({ candidate }: { candidate: CandidateDetail }) {
  const [note, setNote] = useState<string | null>(null);

  function flash(msg: string) {
    setNote(msg);
    setTimeout(() => setNote(null), 2200);
  }

  function downloadPdf() {
    const previous = document.title;
    document.title = `TalentScan - ${candidate.candidate_name || "CV analysis"}`;
    const restore = () => {
      document.title = previous;
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);
    window.print();
  }

  async function share() {
    const text = summaryText(candidate);
    try {
      if (navigator.share) {
        await navigator.share({ title: "My CV analysis", text });
        return;
      }
      await navigator.clipboard.writeText(text);
      flash("Summary copied");
    } catch (e) {
      if ((e as Error)?.name !== "AbortError") flash("Couldn't share");
    }
  }

  return (
    <div className="no-print" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, margin: "-6px 0 18px" }}>
      <button type="button" style={btn} onClick={downloadPdf}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
        Download PDF
      </button>
      <button type="button" style={btn} onClick={share}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.6" y1="13.5" x2="15.4" y2="17.5" /><line x1="15.4" y1="6.5" x2="8.6" y2="10.5" /></svg>
        Share summary
      </button>
      {note && <span style={{ fontSize: 13, color: "#437a1a", fontWeight: 600 }}>{note}</span>}
    </div>
  );
}
