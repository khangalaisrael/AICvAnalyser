"use client";

import { useCandidates } from "@/hooks/useCandidates";
import { CandidateCard } from "./CandidateCard";

export function CandidateList() {
  const { data: candidates, isLoading, isError, error } = useCandidates();

  if (isLoading) {
    return (
      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ height: 62, borderRadius: 10, background: "rgba(0,0,0,0.04)", animation: "pulse 1.5s ease-in-out infinite" }} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p style={{ fontSize: 11, color: "#e84a45", padding: "12px 14px", wordBreak: "break-all" }}>
        {(error as Error)?.message ?? "Could not load candidates."}
      </p>
    );
  }

  if (!candidates || candidates.length === 0) {
    return (
      <div style={{ padding: "32px 14px", textAlign: "center" }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: "rgba(242,92,84,0.08)",
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f25c54" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <p style={{ fontSize: 13.5, fontWeight: 600, color: "#22272f", margin: "0 0 4px" }}>No candidates yet</p>
        <p style={{ fontSize: 12.5, color: "#7c818b", margin: 0, lineHeight: 1.5 }}>
          Upload a CV to get your first analysis.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, padding: "4px 8px" }}>
      {candidates.map((c) => (
        <CandidateCard key={c.id} candidate={c} />
      ))}
    </div>
  );
}
