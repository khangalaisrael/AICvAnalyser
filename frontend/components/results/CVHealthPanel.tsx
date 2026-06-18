"use client";

import type { CVChecklist } from "@/lib/types";

interface Props {
  checklist: CVChecklist;
}

const CHECKS: {
  key: keyof CVChecklist;
  label: string;
  why: string;
  weight: number;
}[] = [
  { key: "has_quantified_achievements", label: "Quantified achievements",  why: "Numbers prove impact — recruiters scan for them first.",         weight: 25 },
  { key: "has_action_verbs",            label: "Action verbs",             why: "Verbs like Led, Built, Deployed signal ownership.",              weight: 15 },
  { key: "has_contact_info",            label: "Contact info",             why: "No email = no interview. ATS flags missing contact.",            weight: 15 },
  { key: "has_skills_section",          label: "Skills section",           why: "ATS parsers extract skills from a dedicated section first.",     weight: 15 },
  { key: "has_linkedin",                label: "LinkedIn URL",             why: "73% of recruiters check LinkedIn before calling.",               weight: 10 },
  { key: "has_github",                  label: "GitHub / portfolio",       why: "Evidence of work beats claims every time.",                      weight: 10 },
  { key: "word_count_ok",               label: "Word count (300–1200)",    why: "Too short = sparse; too long = skimmed. Aim for the sweet spot.", weight: 5  },
  { key: "has_profile_summary",         label: "Profile summary",          why: "A strong opener frames the whole CV for the reader.",            weight: 5  },
];

function AtsRing({ score }: { score: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score >= 75 ? "#5f8b2e" : score >= 50 ? "#c5811c" : "#e84a45";
  const label = score >= 75 ? "Strong" : score >= 50 ? "Average" : "Needs work";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0 }}>
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={r} fill="none" stroke="#f0efe8" strokeWidth="7" />
        <circle
          cx="44" cy="44" r={r} fill="none"
          stroke={color} strokeWidth="7"
          strokeDasharray={`${fill} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 44 44)"
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
        <text x="44" y="40" textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: 18, fontWeight: 700, fill: "#22272f", fontFamily: "var(--font-serif), serif" }}>
          {score}
        </text>
        <text x="44" y="56" textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: 9, fontWeight: 600, fill: "#a7a99f", letterSpacing: "0.04em" }}>
          /100
        </text>
      </svg>
      <span style={{ fontSize: 11.5, fontWeight: 700, color, letterSpacing: "0.03em" }}>{label}</span>
    </div>
  );
}

function CheckRow({ label, why, passed }: { label: string; why: string; passed: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: "1px solid #f0efe8" }}>
      <div style={{
        width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
        background: passed ? "rgba(95,139,46,0.12)" : "rgba(232,74,69,0.10)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {passed ? (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#5f8b2e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#e84a45" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#22272f", margin: "0 0 1px" }}>{label}</p>
        <p style={{ fontSize: 12, color: "#7c818b", margin: 0, lineHeight: 1.4 }}>{why}</p>
      </div>
    </div>
  );
}

export function CVHealthPanel({ checklist }: Props) {
  const passed = CHECKS.filter((c) => checklist[c.key] === true).length;

  return (
    <div style={{ background: "#fff", border: "1px solid #ecebe3", borderRadius: 16, padding: "20px 22px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: "rgba(242,92,84,0.09)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f25c54" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "var(--font-serif), 'Source Serif 4', serif", fontSize: 16, fontWeight: 600, color: "#22272f", margin: 0 }}>
            CV Health Check
          </p>
          <p style={{ fontSize: 12, color: "#7c818b", margin: 0 }}>{passed} of {CHECKS.length} checks passed</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        {/* ATS ring */}
        <AtsRing score={checklist.ats_score} />

        {/* Checklist */}
        <div style={{ flex: 1 }}>
          {CHECKS.map((c) => (
            <CheckRow
              key={c.key}
              label={c.label}
              why={c.why}
              passed={!!checklist[c.key]}
            />
          ))}
          {/* Word count detail */}
          <p style={{ fontSize: 11.5, color: "#a7a99f", margin: "8px 0 0", textAlign: "right" }}>
            Word count: <strong style={{ color: "#52575f" }}>{checklist.word_count}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
