"use client";

import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "@/store/appStore";
import { deleteCandidate } from "@/lib/api";
import type { CandidateSummary } from "@/lib/types";

const VERDICT_DOT: Record<string, string> = {
  HIRE: "#5f8b2e",
  MAYBE: "#c5811c",
  REJECT: "#e84a45",
};

const PIPELINE_COLOR: Record<string, string> = {
  HIRE: "#5f8b2e",
  HOLD: "#c5811c",
  REJECT: "#e84a45",
};

const PIPELINE_LABEL: Record<string, string> = {
  HIRE: "Hired",
  HOLD: "On hold",
  REJECT: "Rejected",
};

export function CandidateCard({ candidate }: { candidate: CandidateSummary }) {
  const { activeCandidateId, setActiveCandidateId } = useAppStore();
  const isActive = activeCandidateId === candidate.id;
  const queryClient = useQueryClient();

  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const longPress = useRef<ReturnType<typeof setTimeout> | null>(null);

  const deleteMutation = useMutation({
    mutationFn: () => deleteCandidate(candidate.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      if (isActive) setActiveCandidateId(null);
    },
  });

  function openMenu(x: number, y: number) { setMenu({ x, y }); }
  function handleContextMenu(e: React.MouseEvent) { e.preventDefault(); openMenu(e.clientX, e.clientY); }
  function handleTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    longPress.current = setTimeout(() => openMenu(t.clientX, t.clientY), 500);
  }
  function handleTouchEnd() { if (longPress.current) clearTimeout(longPress.current); }

  const dotColor = VERDICT_DOT[candidate.verdict] ?? "#a7a99f";

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setActiveCandidateId(isActive ? null : candidate.id)}
        onContextMenu={handleContextMenu}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onKeyDown={(e) => e.key === "Enter" && setActiveCandidateId(isActive ? null : candidate.id)}
        style={{
          padding: "10px 12px",
          borderRadius: 10,
          cursor: "pointer",
          background: isActive ? "rgba(242,92,84,0.07)" : "transparent",
          outline: isActive ? "1px solid rgba(242,92,84,0.18)" : "none",
          transition: "background 0.12s",
          userSelect: "none",
        }}
        onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(0,0,0,0.03)"; }}
        onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{
              fontFamily: "var(--font-serif), 'Source Serif 4', serif",
              fontSize: 13.5, fontWeight: 600, color: "#22272f",
              margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {candidate.name}
            </p>
            <p style={{ fontSize: 12, color: "#7c818b", margin: "2px 0 0" }}>{candidate.role}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: dotColor }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#22272f", fontVariantNumeric: "tabular-nums" }}>{candidate.score}</span>
            </div>
            {candidate.pipeline_status && (
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.05em",
                color: PIPELINE_COLOR[candidate.pipeline_status],
                background: `${PIPELINE_COLOR[candidate.pipeline_status]}16`,
                borderRadius: 999, padding: "1px 7px",
              }}>
                {PIPELINE_LABEL[candidate.pipeline_status]}
              </span>
            )}
          </div>
        </div>
      </div>

      {menu && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={() => setMenu(null)} />
          <div style={{
            position: "fixed", left: menu.x, top: menu.y, zIndex: 50,
            background: "#fff", border: "1px solid #ecebe3", borderRadius: 10,
            boxShadow: "0 8px 28px rgba(0,0,0,0.11)", minWidth: 164, padding: "4px 0",
          }}>
            <button
              onClick={() => { deleteMutation.mutate(); setMenu(null); }}
              disabled={deleteMutation.isPending}
              style={{
                width: "100%", padding: "9px 14px", background: "none", border: "none",
                textAlign: "left", fontSize: 13.5, color: "#e84a45",
                cursor: deleteMutation.isPending ? "not-allowed" : "pointer",
                fontWeight: 500, fontFamily: "inherit",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(232,74,69,0.06)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete candidate"}
            </button>
          </div>
        </>
      )}
    </>
  );
}
