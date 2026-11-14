"use client";

import { useState } from "react";
import { useCandidates, useCandidate } from "@/hooks/useCandidates";
import type { CandidateDetail } from "@/lib/types";

const SERIF = "var(--font-serif), 'Source Serif 4', serif";

function Delta({ n }: { n: number }) {
  if (n === 0) return <span style={{ color: "#a7a99f" }}>±0</span>;
  return <span style={{ color: n > 0 ? "#437a1a" : "#c7302b", fontWeight: 700 }}>{n > 0 ? `+${n}` : n}</span>;
}

function label(key: string) {
  return key.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
}

/** Compare this analysis with another one: score, each component, and skills gained or lost. */
export function CompareCard({ current }: { current: CandidateDetail }) {
  const { data: all } = useCandidates();
  const [otherId, setOtherId] = useState<string>("");
  const { data: other } = useCandidate(otherId || null);

  const options = (all ?? []).filter((c) => c.id !== current.id);
  if (options.length === 0) return null;

  const a = current.scoring.component_scores ?? {};
  const b = other?.scoring.component_scores ?? {};
  const keys = Object.keys(a);
  const nowMatched = new Set([...(current.ai.matched_skills ?? []), ...(current.ai.inferred_skills ?? [])]);
  const thenMatched = new Set([...(other?.ai.matched_skills ?? []), ...(other?.ai.inferred_skills ?? [])]);
  const gained = [...nowMatched].filter((s) => !thenMatched.has(s));
  const lost = [...thenMatched].filter((s) => !nowMatched.has(s));

  return (
    <div style={{ background: "#fff", border: "1px solid #ecebe3", borderRadius: 18, padding: "20px 22px", marginBottom: 36 }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: other ? 16 : 0 }}>
        <p style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 600, margin: 0 }}>Compare with another analysis</p>
        <select
          value={otherId}
          onChange={(e) => setOtherId(e.target.value)}
          style={{ height: 36, borderRadius: 9, border: "1px solid #ecebe3", background: "#fff", padding: "0 10px", fontSize: 13, fontFamily: "inherit", maxWidth: "100%" }}
        >
          <option value="">Choose…</option>
          {options.map((c) => (
            <option key={c.id} value={c.id}>{c.name} · {c.role} · {c.score}</option>
          ))}
        </select>
      </div>

      {other && (
        <>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap", marginBottom: 14 }}>
            <span style={{ fontSize: 13, color: "#7c818b" }}>{other.scoring.final_score}</span>
            <span style={{ color: "#a7a99f" }}>→</span>
            <span style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 600 }}>{current.scoring.final_score}</span>
            <span style={{ fontSize: 15 }}><Delta n={current.scoring.final_score - other.scoring.final_score} /></span>
          </div>

          {keys.length > 0 && (
            <div style={{ display: "grid", gap: 6, marginBottom: 14 }}>
              {keys.map((k) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 13, color: "#52575f" }}>
                  <span>{label(k)}</span>
                  <span style={{ fontVariantNumeric: "tabular-nums" }}>
                    {b[k] ?? "–"} → {a[k]} <Delta n={a[k] - (b[k] ?? a[k])} />
                  </span>
                </div>
              ))}
            </div>
          )}

          {(gained.length > 0 || lost.length > 0) && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {gained.map((s) => (
                <span key={`g-${s}`} style={{ fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 99, background: "rgba(95,139,46,0.12)", color: "#437a1a" }}>+ {s}</span>
              ))}
              {lost.map((s) => (
                <span key={`l-${s}`} style={{ fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 99, background: "rgba(232,74,69,0.10)", color: "#c7302b" }}>− {s}</span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
