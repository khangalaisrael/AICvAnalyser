"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "@/store/appStore";
import { useCandidate } from "@/hooks/useCandidates";
import { updatePipelineStatus } from "@/lib/api";
import { ScoreRing } from "./ScoreRing";
import { ScoreBarCard } from "./ScoreBar";
import { SkillPill } from "./SkillPill";
import { CoachingPanel } from "./CoachingPanel";
import type { PipelineStatus } from "@/lib/types";

const LABELS: Record<string, string> = {
  technical_skill_match:     "Technical skill match",
  quantifiable_achievements: "Quantifiable achievements",
  years_experience:          "Years experience",
  recency_of_skills:         "Recency of skills",
  certifications:            "Certifications",
  projects_portfolio:        "Projects / portfolio",
  keyword_alignment:         "Keyword alignment",
  soft_skills:               "Soft skills",
};

const VERDICT_STYLE = {
  HIRE:   { bg: "rgba(95,139,46,0.12)",  text: "#5f8b2e", dot: "#5f8b2e" },
  MAYBE:  { bg: "rgba(197,129,28,0.12)", text: "#c5811c", dot: "#c5811c" },
  REJECT: { bg: "rgba(232,74,69,0.10)",  text: "#e84a45", dot: "#e84a45" },
};

export function ResultsPanel() {
  const { activeCandidateId } = useAppStore();
  const { data: candidate, isLoading, isError } = useCandidate(activeCandidateId);
  const queryClient = useQueryClient();

  const pipelineMutation = useMutation({
    mutationFn: ({ status }: { status: PipelineStatus }) =>
      updatePipelineStatus(activeCandidateId!, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      queryClient.invalidateQueries({ queryKey: ["candidates", activeCandidateId] });
    },
  });

  if (!activeCandidateId) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, background: "rgba(242,92,84,0.07)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f25c54" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#22272f", margin: 0 }}>No candidate selected</p>
        <p style={{ fontSize: 13, color: "#7c818b", margin: 0 }}>Upload a CV or pick one from the sidebar.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
        <p style={{ fontSize: 14, color: "#7c818b" }}>Loading…</p>
      </div>
    );
  }

  if (isError || !candidate) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
        <p style={{ fontSize: 14, color: "#e84a45" }}>Could not load candidate.</p>
      </div>
    );
  }

  const { ai, scoring, role, candidate_name, pipeline_status, researched_role } = candidate;
  const score = scoring.final_score;
  const verdict = scoring.verdict;
  const vs = VERDICT_STYLE[verdict] ?? VERDICT_STYLE.REJECT;
  const componentScores = scoring.component_scores ?? {};
  const matched = ai.matched_skills ?? [];
  const missing = ai.missing_skills ?? [];
  const recommended = ai.recommended_skills ?? [];

  return (
    <div style={{ padding: "28px 32px", maxWidth: 760, margin: "0 auto" }}>
      {/* Header */}
      <p style={{
        fontFamily: "var(--font-serif), 'Source Serif 4', serif",
        fontSize: 22, fontWeight: 600, color: "#22272f", margin: "0 0 20px",
      }}>
        {candidate_name || "Analysis results"}
      </p>

      {/* Role identity chip — only shown for custom JD analyses */}
      {researched_role && (
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(242,92,84,0.06)", borderRadius: 999,
          padding: "6px 14px", marginBottom: 16,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f25c54" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: "#f25c54" }}>
            AI identified: {researched_role.role_title}
            {researched_role.seniority_level ? ` · ${researched_role.seniority_level}` : ""}
          </span>
        </div>
      )}

      {/* Hero card: ring + verdict + stats */}
      <div style={{
        display: "flex", alignItems: "center", gap: 28,
        background: "#fff", border: "1px solid #ecebe3",
        borderRadius: 20, padding: "26px 28px", flexWrap: "wrap", marginBottom: 22,
      }}>
        <ScoreRing score={score} />

        <div style={{ flex: 1, minWidth: 180, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, alignSelf: "flex-start",
            background: vs.bg, color: vs.text,
            padding: "7px 14px", borderRadius: 999, fontWeight: 700, fontSize: 12.5, letterSpacing: "0.05em",
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: vs.dot }} />
            VERDICT · {verdict}
          </div>
          <p style={{
            fontFamily: "var(--font-serif), 'Source Serif 4', serif",
            fontSize: 18, fontWeight: 600, color: "#22272f", margin: 0, lineHeight: 1.3,
          }}>
            Evaluated against the <strong>{role}</strong> profile
          </p>
        </div>

        <div style={{ display: "flex", gap: 28, paddingLeft: 24, borderLeft: "1px solid #ecebe3" }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#a7a99f", letterSpacing: "0.03em", margin: "0 0 2px" }}>Years exp.</p>
            <p style={{ fontFamily: "var(--font-serif), 'Source Serif 4', serif", fontSize: 36, fontWeight: 600, color: "#22272f", lineHeight: 1.2, margin: 0 }}>
              {ai.years_experience ?? "—"}
            </p>
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#a7a99f", letterSpacing: "0.03em", margin: "0 0 2px" }}>Certs</p>
            <p style={{ fontFamily: "var(--font-serif), 'Source Serif 4', serif", fontSize: 36, fontWeight: 600, color: "#22272f", lineHeight: 1.2, margin: 0 }}>
              {(ai.certifications ?? []).length}
            </p>
          </div>
        </div>
      </div>

      {/* Score delta callout */}
      {(ai.coaching?.score_delta ?? 0) > 0 && (
        <div style={{
          background: "rgba(197,129,28,0.06)", border: "1px solid rgba(197,129,28,0.20)",
          borderRadius: 10, padding: "11px 16px", marginBottom: 16,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c5811c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
          </svg>
          <p style={{ fontSize: 13, color: "#c5811c", fontWeight: 500, margin: 0 }}>
            Adding <strong>{ai.coaching?.score_delta_item}</strong> to your CV could improve your score by{" "}
            <strong>+{ai.coaching?.score_delta} points</strong>
          </p>
        </div>
      )}

      {/* Knockout / experience flag */}
      {scoring.knockout && (
        <div style={{ background: "rgba(232,74,69,0.07)", border: "1px solid rgba(232,74,69,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 18, fontSize: 13.5, color: "#e84a45" }}>
          Knockout: {scoring.knockout_reason}
        </div>
      )}
      {scoring.experience_flag && scoring.experience_flag_message && (
        <div style={{ background: "rgba(197,129,28,0.07)", border: "1px solid rgba(197,129,28,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 18, fontSize: 13.5, color: "#c5811c" }}>
          {scoring.experience_flag_message}
        </div>
      )}

      {/* Score breakdown */}
      {!scoring.knockout && Object.keys(componentScores).length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <p style={{
            fontFamily: "var(--font-serif), 'Source Serif 4', serif",
            fontSize: 18, fontWeight: 600, color: "#22272f", margin: "0 0 14px",
          }}>
            Score breakdown
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
            {Object.entries(LABELS).map(([key, label]) =>
              componentScores[key] !== undefined ? (
                <ScoreBarCard key={key} label={label} value={componentScores[key]} />
              ) : null
            )}
          </div>
        </div>
      )}

      {/* Skills — 3 columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 22 }}>
        {/* Matched */}
        <div style={{ background: "#fff", border: "1px solid #ecebe3", borderRadius: 16, padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#5f8b2e" }} />
            <p style={{ fontFamily: "var(--font-serif), 'Source Serif 4', serif", fontSize: 14, fontWeight: 600, color: "#22272f", margin: 0, flex: 1 }}>Matched</p>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#5f8b2e", background: "rgba(95,139,46,0.12)", borderRadius: 999, padding: "2px 8px" }}>{matched.length}</span>
          </div>
          <div>
            {matched.length > 0
              ? matched.map((s) => <SkillPill key={s} text={s} matched />)
              : <span style={{ fontSize: 13, color: "#a7a99f" }}>None found</span>}
          </div>
        </div>

        {/* True gaps */}
        <div style={{ background: "#fff", border: "1px solid #ecebe3", borderRadius: 16, padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#e84a45" }} />
            <p style={{ fontFamily: "var(--font-serif), 'Source Serif 4', serif", fontSize: 14, fontWeight: 600, color: "#22272f", margin: 0, flex: 1 }}>True gaps</p>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#e84a45", background: "rgba(232,74,69,0.10)", borderRadius: 999, padding: "2px 8px" }}>{missing.length}</span>
          </div>
          <div>
            {missing.length > 0
              ? missing.map((s) => <SkillPill key={s} text={s} matched={false} />)
              : <span style={{ fontSize: 13, color: "#a7a99f" }}>None identified</span>}
          </div>
        </div>

        {/* Recommended additions */}
        <div style={{ background: "#fff", border: "1px solid #ecebe3", borderRadius: 16, padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#c5811c" }} />
            <p style={{ fontFamily: "var(--font-serif), 'Source Serif 4', serif", fontSize: 14, fontWeight: 600, color: "#22272f", margin: 0, flex: 1 }}>Recommended</p>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#c5811c", background: "rgba(197,129,28,0.10)", borderRadius: 999, padding: "2px 8px" }}>{recommended.length}</span>
          </div>
          <div>
            {recommended.length > 0
              ? recommended.map((s) => (
                  <span key={s} style={{
                    display: "inline-block", fontSize: 12.5, fontWeight: 500,
                    padding: "4px 10px", borderRadius: 999, margin: "3px 3px 0 0",
                    background: "rgba(197,129,28,0.09)", color: "#c5811c",
                  }}>{s}</span>
                ))
              : <span style={{ fontSize: 13, color: "#a7a99f" }}>Nothing to add</span>}
          </div>
        </div>
      </div>

      {/* AI summary */}
      <div style={{ background: "#fbfaf6", border: "1px solid #ecebe3", borderRadius: 16, padding: "22px 24px", marginBottom: 22 }}>
        <p style={{ fontFamily: "var(--font-serif), 'Source Serif 4', serif", fontSize: 16, fontWeight: 600, color: "#22272f", margin: "0 0 10px" }}>AI summary</p>
        <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "#22272f", margin: 0 }}>{ai.ai_summary}</p>
      </div>

      {/* CV Coach */}
      {ai.coaching && (
        <div style={{ marginBottom: 22 }}>
          <CoachingPanel coaching={ai.coaching} />
        </div>
      )}

      {/* Market trends — only for custom JD analyses */}
      {researched_role && (researched_role.current_market_trends?.length ?? 0) > 0 && (
        <div style={{ background: "#fff", border: "1px solid #ecebe3", borderRadius: 16, padding: "20px 22px", marginBottom: 22 }}>
          <p style={{
            fontFamily: "var(--font-serif), 'Source Serif 4', serif",
            fontSize: 15, fontWeight: 600, color: "#22272f", margin: "0 0 12px",
          }}>
            What the market expects right now
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {researched_role.current_market_trends.map((trend) => (
              <span key={trend} style={{
                fontSize: 12.5, fontWeight: 500,
                padding: "5px 12px", borderRadius: 999,
                background: "rgba(197,129,28,0.09)", color: "#c5811c",
              }}>
                {trend}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Pipeline actions */}
      <div>
        <p style={{ fontFamily: "var(--font-serif), 'Source Serif 4', serif", fontSize: 16, fontWeight: 600, color: "#22272f", margin: "0 0 12px" }}>Take action</p>
        <div style={{ display: "flex", gap: 10 }}>
          <PipelineButton
            label="Move to hire"
            status="HIRE"
            active={pipeline_status === "HIRE"}
            loading={pipelineMutation.isPending}
            onClick={() => pipelineMutation.mutate({ status: "HIRE" })}
            activeColor="#5f8b2e"
          />
          <PipelineButton
            label="Hold for review"
            status="HOLD"
            active={pipeline_status === "HOLD"}
            loading={pipelineMutation.isPending}
            onClick={() => pipelineMutation.mutate({ status: "HOLD" })}
            activeColor="#c5811c"
          />
          <PipelineButton
            label="Reject"
            status="REJECT"
            active={pipeline_status === "REJECT"}
            loading={pipelineMutation.isPending}
            onClick={() => pipelineMutation.mutate({ status: "REJECT" })}
            activeColor="#e84a45"
          />
        </div>
      </div>
    </div>
  );
}

function PipelineButton({ label, active, loading, onClick, activeColor }: {
  label: string; status: string; active: boolean; loading: boolean; onClick: () => void; activeColor: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        flex: 1, height: 40, borderRadius: 10, fontSize: 13.5, fontWeight: 600,
        border: active ? `1.5px solid ${activeColor}` : "1px solid #d9d8d0",
        background: active ? `${activeColor}14` : "#fff",
        color: active ? activeColor : "#52575f",
        cursor: loading ? "not-allowed" : "pointer",
        fontFamily: "inherit",
        transition: "border-color 0.15s, background 0.15s, color 0.15s",
      }}
      onMouseEnter={(e) => { if (!loading && !active) { e.currentTarget.style.borderColor = activeColor; e.currentTarget.style.color = activeColor; } }}
      onMouseLeave={(e) => { if (!loading && !active) { e.currentTarget.style.borderColor = "#d9d8d0"; e.currentTarget.style.color = "#52575f"; } }}
    >
      {label}
    </button>
  );
}
