"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "@/store/appStore";
import { useCandidate } from "@/hooks/useCandidates";
import { updatePipelineStatus } from "@/lib/api";
import { ScoreRing } from "./ScoreRing";
import { ScoreBarCard } from "./ScoreBar";
import { SkillPill } from "./SkillPill";
import { CoachingPanel } from "./CoachingPanel";
import { CVHealthPanel } from "./CVHealthPanel";
import type { PipelineStatus, SeniorityLevel } from "@/lib/types";

const LABELS: Record<string, string> = {
  technical_skill_match:     "Technical skill match",
  quantifiable_achievements: "Quantifiable achievements",
  years_experience:          "Years experience",
  projects_portfolio:        "Projects / portfolio",
  keyword_alignment:         "Keyword alignment",
  certifications:            "Certifications",
  soft_skills:               "Soft skills",
};

const VERDICT_STYLE = {
  HIRE:   { bg: "rgba(95,139,46,0.12)",  text: "#5f8b2e", dot: "#5f8b2e" },
  MAYBE:  { bg: "rgba(197,129,28,0.12)", text: "#c5811c", dot: "#c5811c" },
  REJECT: { bg: "rgba(232,74,69,0.10)",  text: "#e84a45", dot: "#e84a45" },
};

const SENIORITY_STYLE: Record<SeniorityLevel, { bg: string; color: string }> = {
  "Entry-level": { bg: "rgba(124,129,139,0.10)", color: "#7c818b" },
  "Mid-level":   { bg: "rgba(197,129,28,0.10)",  color: "#c5811c" },
  "Senior":      { bg: "rgba(95,139,46,0.12)",   color: "#5f8b2e" },
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

  const { ai, scoring, role, candidate_name, pipeline_status, researched_role, cv_checklist } = candidate;
  const score = scoring.final_score;
  const verdict = scoring.verdict;
  const vs = VERDICT_STYLE[verdict] ?? VERDICT_STYLE.REJECT;
  const componentScores = scoring.component_scores ?? {};
  const matched         = ai.matched_skills    ?? [];
  const missing         = ai.missing_skills    ?? [];
  const recommended     = ai.recommended_skills ?? [];
  const inferred        = ai.inferred_skills   ?? [];
  const strengths       = ai.unique_strengths  ?? [];
  const trending        = ai.trending_for_role ?? [];
  const trendingNarrative = ai.trending_narrative ?? "";
  const seniority       = ai.seniority_level as SeniorityLevel | undefined;
  const senStyle        = seniority ? SENIORITY_STYLE[seniority] : null;

  return (
    <div style={{ padding: "40px 44px", maxWidth: 800, margin: "0 auto" }}>

      {/* Candidate name */}
      <p style={{
        fontFamily: "var(--font-serif), 'Source Serif 4', serif",
        fontSize: 24, fontWeight: 600, color: "#22272f", margin: "0 0 24px",
        letterSpacing: "-0.01em",
      }}>
        {candidate_name || "Analysis results"}
      </p>

      {/* Role identity chip */}
      {researched_role && (
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(242,92,84,0.06)", borderRadius: 999,
          padding: "6px 14px", marginBottom: 20,
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

      {/* Hero card */}
      <div style={{
        display: "flex", alignItems: "center", gap: 36,
        background: "#fff", border: "1px solid #ecebe3",
        borderRadius: 24, padding: "32px 36px", flexWrap: "wrap", marginBottom: 20,
      }}>
        <ScoreRing score={score} />

        <div style={{ flex: 1, minWidth: 180, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: vs.bg, color: vs.text,
              padding: "7px 14px", borderRadius: 999, fontWeight: 700, fontSize: 12.5, letterSpacing: "0.05em",
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: vs.dot }} />
              VERDICT · {verdict}
            </div>
            {seniority && senStyle && (
              <div style={{
                display: "inline-flex", alignItems: "center",
                background: senStyle.bg, color: senStyle.color,
                padding: "7px 12px", borderRadius: 999, fontWeight: 600, fontSize: 12, letterSpacing: "0.03em",
              }}>
                {seniority}
              </div>
            )}
          </div>
          <p style={{
            fontFamily: "var(--font-serif), 'Source Serif 4', serif",
            fontSize: 18, fontWeight: 600, color: "#22272f", margin: 0, lineHeight: 1.3,
          }}>
            Evaluated against the <strong>{role}</strong> profile
          </p>
        </div>

        <div style={{ display: "flex", gap: 36 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#a7a99f", letterSpacing: "0.03em", margin: "0 0 4px" }}>Years exp.</p>
            <p style={{ fontFamily: "var(--font-serif), 'Source Serif 4', serif", fontSize: 44, fontWeight: 600, color: "#22272f", lineHeight: 1, margin: 0 }}>
              {ai.years_experience ?? "—"}
            </p>
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#a7a99f", letterSpacing: "0.03em", margin: "0 0 4px" }}>Certs</p>
            <p style={{ fontFamily: "var(--font-serif), 'Source Serif 4', serif", fontSize: 44, fontWeight: 600, color: "#22272f", lineHeight: 1, margin: 0 }}>
              {(ai.certifications ?? []).length}
            </p>
          </div>
        </div>
      </div>

      {/* Knockout / experience flags */}
      {scoring.knockout && (
        <div style={{ background: "rgba(232,74,69,0.07)", border: "1px solid rgba(232,74,69,0.2)", borderRadius: 12, padding: "14px 18px", marginBottom: 20, fontSize: 13.5, color: "#e84a45" }}>
          Knockout: {scoring.knockout_reason}
        </div>
      )}
      {scoring.experience_flag && scoring.experience_flag_message && (
        <div style={{ background: "rgba(197,129,28,0.07)", border: "1px solid rgba(197,129,28,0.2)", borderRadius: 12, padding: "14px 18px", marginBottom: 20, fontSize: 13.5, color: "#c5811c" }}>
          {scoring.experience_flag_message}
        </div>
      )}

      {/* Hiring manager pull quote */}
      {ai.reasoning && (
        <div style={{
          display: "flex", gap: 22, alignItems: "flex-start",
          padding: "32px 0", marginBottom: 20,
          borderTop: "1px solid #ecebe3", borderBottom: "1px solid #ecebe3",
        }}>
          <div style={{ width: 4, minHeight: 40, borderRadius: 4, background: "#d9d8d0", flexShrink: 0, alignSelf: "stretch" }} />
          <p style={{
            fontFamily: "var(--font-serif), 'Source Serif 4', serif",
            fontSize: 17, lineHeight: 1.8, fontStyle: "italic",
            color: "#52575f", margin: 0,
          }}>
            {ai.reasoning}
          </p>
        </div>
      )}

      {/* Career advice */}
      {ai.career_advice && (
        <div style={{
          background: "rgba(242,92,84,0.04)", border: "1px solid rgba(242,92,84,0.16)",
          borderRadius: 14, padding: "18px 22px", marginBottom: 36,
          display: "flex", gap: 14, alignItems: "flex-start",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f25c54" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 3 }}>
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <p style={{ fontSize: 14.5, color: "#22272f", lineHeight: 1.7, margin: 0 }}>
            <em style={{
              color: "#f25c54",
              fontFamily: "var(--font-serif), 'Source Serif 4', serif",
              fontStyle: "italic",
            }}>For you — </em>
            {ai.career_advice}
          </p>
        </div>
      )}

      {/* Score delta */}
      {(ai.coaching?.score_delta ?? 0) > 0 && (
        <div style={{
          background: "rgba(197,129,28,0.06)", border: "1px solid rgba(197,129,28,0.20)",
          borderRadius: 10, padding: "12px 18px", marginBottom: 36,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c5811c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
          </svg>
          <p style={{ fontSize: 13, color: "#c5811c", fontWeight: 500, margin: 0 }}>
            Adding <strong>{ai.coaching?.score_delta_item}</strong> could improve your score by{" "}
            <strong>+{ai.coaching?.score_delta} points</strong>
          </p>
        </div>
      )}

      {/* Score breakdown — single column */}
      {!scoring.knockout && Object.keys(componentScores).length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <p style={{
            fontFamily: "var(--font-serif), 'Source Serif 4', serif",
            fontSize: 20, fontWeight: 600, color: "#22272f", margin: "0 0 18px",
            letterSpacing: "-0.01em",
          }}>
            Score breakdown
          </p>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {Object.entries(LABELS).map(([key, label]) =>
              componentScores[key] !== undefined ? (
                <ScoreBarCard key={key} label={label} value={componentScores[key]} />
              ) : null
            )}
          </div>
        </div>
      )}

      {/* Skills — 2-column editorial layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 36 }}>
        {/* Left: Matched + Inferred */}
        <div style={{ background: "#fff", border: "1px solid #ecebe3", borderRadius: 18, padding: "24px 26px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#5f8b2e" }} />
            <p style={{ fontFamily: "var(--font-serif), 'Source Serif 4', serif", fontSize: 15, fontWeight: 600, color: "#22272f", margin: 0, flex: 1 }}>Matched</p>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#5f8b2e", background: "rgba(95,139,46,0.12)", borderRadius: 999, padding: "2px 8px" }}>{matched.length}</span>
          </div>
          <div>
            {matched.length > 0
              ? matched.map((s) => <SkillPill key={s} text={s} matched />)
              : <span style={{ fontSize: 13, color: "#a7a99f" }}>None found</span>}
          </div>
          {inferred.length > 0 && (
            <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid #f0efe8" }}>
              <p style={{ fontSize: 11.5, fontWeight: 700, color: "#a7a99f", letterSpacing: "0.05em", textTransform: "uppercase", margin: "0 0 10px" }}>Inferred</p>
              <div>
                {inferred.map((s) => (
                  <span key={s} style={{
                    display: "inline-block", fontSize: 13, fontWeight: 500,
                    padding: "5px 11px", borderRadius: 999, margin: "3px 3px 0 0",
                    background: "rgba(95,139,46,0.07)", color: "#5f8b2e",
                    border: "1px dashed rgba(95,139,46,0.30)",
                  }}>{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: True gaps + Recommended stacked */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "#fff", border: "1px solid #ecebe3", borderRadius: 18, padding: "24px 26px", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#e84a45" }} />
              <p style={{ fontFamily: "var(--font-serif), 'Source Serif 4', serif", fontSize: 15, fontWeight: 600, color: "#22272f", margin: 0, flex: 1 }}>True gaps</p>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#e84a45", background: "rgba(232,74,69,0.10)", borderRadius: 999, padding: "2px 8px" }}>{missing.length}</span>
            </div>
            <div>
              {missing.length > 0
                ? missing.map((s) => <SkillPill key={s} text={s} matched={false} />)
                : <span style={{ fontSize: 13, color: "#a7a99f" }}>None identified</span>}
            </div>
          </div>

          <div style={{ background: "#fff", border: "1px solid #ecebe3", borderRadius: 18, padding: "24px 26px", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#c5811c" }} />
              <p style={{ fontFamily: "var(--font-serif), 'Source Serif 4', serif", fontSize: 15, fontWeight: 600, color: "#22272f", margin: 0, flex: 1 }}>Recommended</p>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#c5811c", background: "rgba(197,129,28,0.10)", borderRadius: 999, padding: "2px 8px" }}>{recommended.length}</span>
            </div>
            <div>
              {recommended.length > 0
                ? recommended.map((s) => (
                    <span key={s} style={{
                      display: "inline-block", fontSize: 13, fontWeight: 500,
                      padding: "5px 12px", borderRadius: 999, margin: "3px 3px 0 0",
                      background: "rgba(197,129,28,0.09)", color: "#c5811c",
                    }}>{s}</span>
                  ))
                : <span style={{ fontSize: 13, color: "#a7a99f" }}>Nothing to add</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Unique strengths */}
      {strengths.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <p style={{
            fontFamily: "var(--font-serif), 'Source Serif 4', serif",
            fontSize: 20, fontWeight: 600, color: "#22272f", margin: "0 0 16px",
            letterSpacing: "-0.01em",
          }}>
            Unique strengths
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {strengths.map((s, i) => (
              <div key={i} style={{
                background: "#fff", border: "1px solid #ecebe3",
                borderRadius: 16, padding: "20px 22px",
                display: "flex", gap: 12, alignItems: "flex-start",
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f25c54" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 2, flexShrink: 0 }}>
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <p style={{ fontSize: 14, color: "#22272f", margin: 0, lineHeight: 1.6 }}>{s}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Market intelligence — narrative storytelling */}
      {(trendingNarrative || trending.length > 0) && (
        <div style={{
          background: "#fbfaf6", border: "1px solid #ecebe3",
          borderRadius: 18, padding: "28px 30px", marginBottom: 36,
        }}>
          <p style={{
            fontFamily: "var(--font-serif), 'Source Serif 4', serif",
            fontSize: 20, fontWeight: 600, color: "#22272f", margin: "0 0 18px",
            letterSpacing: "-0.01em",
          }}>
            What the market wants right now
          </p>

          {trendingNarrative && (
            <div style={{ marginBottom: trending.length > 0 ? 22 : 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {trendingNarrative.split(/\n/).filter((line) => line.trim()).map((line, i) => (
                <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <span style={{
                    width: 5, height: 5, borderRadius: "50%",
                    background: "#c5811c", marginTop: 9, flexShrink: 0,
                  }} />
                  <p style={{ fontSize: 14, lineHeight: 1.65, color: "#52575f", margin: 0 }}>
                    {line.replace(/^-\s*/, "").trim()}
                  </p>
                </div>
              ))}
            </div>
          )}

          {trending.length > 0 && (
            <div>
              <p style={{ fontSize: 11.5, fontWeight: 700, color: "#a7a99f", letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 10px" }}>
                Skills to watch
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {trending.map((t) => (
                  <span key={t} style={{
                    fontSize: 12, fontWeight: 500,
                    padding: "4px 11px", borderRadius: 6,
                    background: "rgba(197,129,28,0.08)", color: "#8c6113",
                  }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI summary — bare prose, no card */}
      <div style={{ padding: "32px 0", marginBottom: 36, borderTop: "1px solid #ecebe3" }}>
        <p style={{
          fontFamily: "var(--font-serif), 'Source Serif 4', serif",
          fontSize: 20, fontWeight: 600, color: "#22272f", margin: "0 0 16px",
          letterSpacing: "-0.01em",
        }}>
          AI summary
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: "#52575f", margin: 0, maxWidth: 680 }}>
          {ai.ai_summary}
        </p>
      </div>

      {/* CV Coach */}
      {ai.coaching && (
        <div style={{ marginBottom: 36 }}>
          <CoachingPanel coaching={ai.coaching} />
        </div>
      )}

      {/* CV Health Check */}
      {cv_checklist && (
        <div style={{ marginBottom: 36 }}>
          <CVHealthPanel checklist={cv_checklist} />
        </div>
      )}

      {/* Pipeline actions */}
      <div style={{ paddingTop: 4 }}>
        <p style={{
          fontFamily: "var(--font-serif), 'Source Serif 4', serif",
          fontSize: 20, fontWeight: 600, color: "#22272f", margin: "0 0 14px",
          letterSpacing: "-0.01em",
        }}>
          Take action
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <PipelineButton label="Move to hire"    status="HIRE"   active={pipeline_status === "HIRE"}   loading={pipelineMutation.isPending} onClick={() => pipelineMutation.mutate({ status: "HIRE" })}   activeColor="#5f8b2e" />
          <PipelineButton label="Hold for review" status="HOLD"   active={pipeline_status === "HOLD"}   loading={pipelineMutation.isPending} onClick={() => pipelineMutation.mutate({ status: "HOLD" })}   activeColor="#c5811c" />
          <PipelineButton label="Reject"          status="REJECT" active={pipeline_status === "REJECT"} loading={pipelineMutation.isPending} onClick={() => pipelineMutation.mutate({ status: "REJECT" })} activeColor="#e84a45" />
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
        flex: 1, height: 42, borderRadius: 11, fontSize: 13.5, fontWeight: 600,
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
