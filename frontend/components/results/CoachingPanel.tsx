"use client";

import { useState } from "react";
import type { CoachingResult, CoachingGap, EmployabilityTier } from "@/lib/types";

interface Props {
  coaching: CoachingResult | null | undefined;
}

const TYPE_STYLE: Record<CoachingGap["type"], { color: string; label: string }> = {
  skill:         { color: "#f25c54", label: "Skill" },
  soft_skill:    { color: "#7c818b", label: "Soft skill" },
  certification: { color: "#c5811c", label: "Cert" },
  project:       { color: "#5f8b2e", label: "Project" },
};

const IMPACT_COLOR: Record<CoachingGap["impact"], string> = {
  high:   "#e84a45",
  medium: "#c5811c",
  low:    "#a7a99f",
};

const IMPACT_LABEL: Record<CoachingGap["impact"], string> = {
  high:   "High impact",
  medium: "Medium",
  low:    "Low",
};

const TIER_LABEL: Record<EmployabilityTier, string> = {
  required_for_employability:  "Must have",
  helpful_for_competitiveness: "Competitive edge",
  exceptional_differentiator:  "Standout",
};


function GapCard({ gap, index }: { gap: CoachingGap; index: number }) {
  const [open, setOpen] = useState(false);
  const ts = TYPE_STYLE[gap.type] ?? TYPE_STYLE.skill;
  const tier = gap.employability_tier;

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #ecebe3",
      borderRadius: 14,
      overflow: "hidden",
    }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 14,
          padding: "17px 20px", background: "none", border: "none",
          cursor: "pointer", textAlign: "left", fontFamily: "inherit",
        }}
      >
        {/* Priority number */}
        <span style={{
          width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
          background: "#f3f2ec", color: "#7c818b",
          fontSize: 11, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {index + 1}
        </span>

        {/* Gap name */}
        <span style={{
          fontFamily: "var(--font-serif), 'Source Serif 4', serif",
          fontSize: 15, fontWeight: 600, color: "#22272f", flex: 1, lineHeight: 1.3,
        }}>
          {gap.item}
        </span>

        {/* Impact text only */}
        <span style={{ fontSize: 12, fontWeight: 600, color: IMPACT_COLOR[gap.impact], flexShrink: 0 }}>
          {IMPACT_LABEL[gap.impact]}
        </span>

        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="#a7a99f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div style={{ padding: "0 20px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Type + tier — quiet caption */}
          <p style={{ fontSize: 11.5, color: "#a7a99f", margin: 0 }}>
            {ts.label}{tier ? ` · ${TIER_LABEL[tier]}` : ""}
          </p>

          {/* Reason */}
          <p style={{ fontSize: 14, color: "#52575f", margin: 0, lineHeight: 1.65 }}>
            {gap.reason}
          </p>

          {/* Action with accent bar */}
          <div style={{ display: "flex", gap: 12 }}>
            <span style={{ width: 3, borderRadius: 99, background: ts.color, flexShrink: 0, alignSelf: "stretch" }} />
            <p style={{ fontSize: 14, color: "#22272f", margin: 0, lineHeight: 1.65 }}>
              {gap.action}
            </p>
          </div>

          {gap.rewrite_hint && (
            <div style={{
              background: "rgba(242,92,84,0.04)",
              border: "1px solid rgba(242,92,84,0.20)",
              borderRadius: 10, padding: "13px 16px",
            }}>
              <p style={{ fontSize: 11.5, fontWeight: 700, color: "#f25c54", margin: "0 0 6px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                Rewrite hint
              </p>
              <p style={{ fontSize: 13.5, color: "#22272f", margin: 0, lineHeight: 1.65, fontStyle: "italic" }}>
                {gap.rewrite_hint}
              </p>
            </div>
          )}

          {gap.learning_path && (
            <div style={{
              background: "#f7f6f1",
              border: "1px solid #ecebe3",
              borderRadius: 10, padding: "14px 16px",
            }}>
              <p style={{ fontSize: 11.5, fontWeight: 700, color: "#7c818b", letterSpacing: "0.05em", textTransform: "uppercase", margin: "0 0 8px" }}>
                How to build this
              </p>
              <p style={{ fontSize: 13.5, color: "#22272f", margin: 0, lineHeight: 1.65 }}>
                {gap.learning_path}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function CoachingPanel({ coaching }: Props) {
  if (!coaching || !(coaching.priority_gaps?.length || coaching.overall_coaching_summary)) {
    return null;
  }

  const gaps = [...(coaching.priority_gaps ?? [])].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return (order[a.impact] ?? 1) - (order[b.impact] ?? 1);
  });

  const quickWins  = coaching.quick_wins  ?? [];
  const longerTerm = coaching.longer_term ?? [];

  return (
    <div style={{ background: "#fbfaf6", border: "1px solid #ecebe3", borderRadius: 18, padding: "28px 28px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: "rgba(242,92,84,0.09)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f25c54" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </div>
        <p style={{
          fontFamily: "var(--font-serif), 'Source Serif 4', serif",
          fontSize: 18, fontWeight: 600, color: "#22272f", margin: 0,
          letterSpacing: "-0.01em",
        }}>
          CV Coach
        </p>
      </div>

      {coaching.overall_coaching_summary && (
        <p style={{ fontSize: 14.5, color: "#52575f", lineHeight: 1.75, margin: "0 0 26px", fontStyle: "italic" }}>
          {coaching.overall_coaching_summary}
        </p>
      )}

      {gaps.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11.5, fontWeight: 700, color: "#7c818b", letterSpacing: "0.05em", textTransform: "uppercase", margin: "0 0 12px" }}>
            Priority gaps
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {gaps.map((gap, i) => (
              <GapCard key={`${gap.type}-${gap.item}-${i}`} gap={gap} index={i} />
            ))}
          </div>
        </div>
      )}

      {(quickWins.length > 0 || longerTerm.length > 0) && (
        <div style={{
          paddingTop: 24, borderTop: "1px solid #f0efe8",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24,
        }}>
          {quickWins.length > 0 && (
            <div>
              <p style={{ fontSize: 11.5, fontWeight: 700, color: "#5f8b2e", letterSpacing: "0.05em", textTransform: "uppercase", margin: "0 0 12px" }}>
                Quick wins
              </p>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 9 }}>
                {quickWins.map((w, i) => (
                  <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#5f8b2e", marginTop: 6, flexShrink: 0 }} />
                    <span style={{ fontSize: 13.5, color: "#22272f", lineHeight: 1.55 }}>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {longerTerm.length > 0 && (
            <div>
              <p style={{ fontSize: 11.5, fontWeight: 700, color: "#c5811c", letterSpacing: "0.05em", textTransform: "uppercase", margin: "0 0 12px" }}>
                Longer term
              </p>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 9 }}>
                {longerTerm.map((l, i) => (
                  <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#c5811c", marginTop: 6, flexShrink: 0 }} />
                    <span style={{ fontSize: 13.5, color: "#22272f", lineHeight: 1.55 }}>{l}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
