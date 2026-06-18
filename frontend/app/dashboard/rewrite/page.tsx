"use client";

import { useState } from "react";
import { useStructureCv, useGenerateRewrite, useDownloadPdf } from "@/hooks/useRewrite";
import { PdfDropzone } from "@/components/upload/PdfDropzone";
import type {
  CVLedger,
  RewrittenCVLedger,
  MetricPrompt,
  GenerateRewriteResponse,
} from "@/lib/types";

/* ── helpers ──────────────────────────────────────────────────────────── */

const CORAL = "#f25c54";
const FG = "#22272f";
const MUTED = "#7c818b";
const BORDER = "#ecebe3";
const BG_CARD = "#ffffff";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: MUTED, margin: "0 0 10px" }}>
      {children}
    </p>
  );
}

function ScoreBadge({ score, label }: { score: number; label: string }) {
  const color = score >= 70 ? "#437a1a" : score >= 45 ? "#a06a12" : "#c7302b";
  const bg = score >= 70 ? "rgba(95,139,46,0.10)" : score >= 45 ? "rgba(197,129,28,0.10)" : "rgba(232,74,69,0.10)";
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.04em", color }}>{score}</div>
      <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{label}</div>
      <div style={{ height: 4, background: BORDER, borderRadius: 99, marginTop: 6, width: 64, overflow: "hidden" }}>
        <div style={{
          height: 4, width: "100%", background: color, borderRadius: 99,
          transform: `scaleX(${score / 100})`, transformOrigin: "left center",
          transition: "transform 0.6s ease",
        }} />
      </div>
    </div>
  );
}

function StepDots({ step }: { step: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
      {["Upload", "Review", "Rewrite"].map((label, i) => {
        const active = i === step;
        const done = i < step;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%",
                background: done ? CORAL : active ? FG : BORDER,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.2s",
              }}>
                {done ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                ) : (
                  <span style={{ fontSize: 11, fontWeight: 700, color: active ? "white" : MUTED }}>{i + 1}</span>
                )}
              </div>
              <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? FG : MUTED }}>{label}</span>
            </div>
            {i < 2 && <div style={{ width: 32, height: 1, background: BORDER }} />}
          </div>
        );
      })}
    </div>
  );
}

/* ── Step 1: Upload + role ────────────────────────────────────────────── */

function StepUpload({
  file, onFile, role, onRole, onNext, loading, error,
}: {
  file: File | null;
  onFile: (f: File | null) => void;
  role: string;
  onRole: (r: string) => void;
  onNext: () => void;
  loading: boolean;
  error: string | null;
}) {
  return (
    <div style={{ maxWidth: 480 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", color: FG, margin: "0 0 6px" }}>
        Rewrite your CV
      </h1>
      <p style={{ fontSize: 15, color: MUTED, margin: "0 0 28px", lineHeight: 1.6 }}>
        Upload your CV and name the role you're targeting. We extract your real facts, rewrite every bullet in the role's language, and check it passes ATS.
      </p>

      <div style={{ marginBottom: 20 }}>
        <SectionLabel>Target role</SectionLabel>
        <input
          value={role}
          onChange={(e) => onRole(e.target.value)}
          placeholder="e.g. Senior Product Manager"
          style={{
            width: "100%", padding: "11px 14px",
            border: `1px solid ${BORDER}`, borderRadius: 10,
            fontSize: 14, color: FG, background: "#fff",
            fontFamily: "inherit", outline: "none",
            transition: "border-color 0.15s",
            boxSizing: "border-box",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = FG)}
          onBlur={(e) => (e.currentTarget.style.borderColor = BORDER)}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <SectionLabel>Your CV (PDF)</SectionLabel>
        <PdfDropzone file={file} onFile={onFile} />
      </div>

      {error && (
        <p style={{ fontSize: 13, color: "#c7302b", margin: "0 0 16px" }}>{error}</p>
      )}

      <button
        onClick={onNext}
        disabled={!file || !role.trim() || loading}
        style={{
          width: "100%", padding: "13px 0",
          background: !file || !role.trim() ? BORDER : CORAL,
          color: !file || !role.trim() ? MUTED : "white",
          border: "none", borderRadius: 11, fontSize: 14, fontWeight: 700,
          cursor: !file || !role.trim() || loading ? "not-allowed" : "pointer",
          fontFamily: "inherit", transition: "background 0.15s",
        }}
      >
        {loading ? "Extracting your CV…" : "Extract my CV →"}
      </button>

      <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
        {["Reframes real experience only", "Never invents skills or metrics", "ATS self-check included"].map((t) => (
          <div key={t} style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 6l3 3 5-5" stroke={CORAL} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 11.5, color: MUTED }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Step 2: Review extracted ledger ─────────────────────────────────── */

function StepReview({
  ledger, atsBefore, onNext, loading, role,
}: {
  ledger: CVLedger;
  atsBefore: number;
  onNext: () => void;
  loading: boolean;
  role: string;
}) {
  return (
    <div style={{ maxWidth: 620 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", color: FG, margin: "0 0 4px" }}>
            Your CV, extracted
          </h2>
          <p style={{ fontSize: 14, color: MUTED, margin: 0 }}>
            These are the facts we'll rewrite toward <strong style={{ color: FG }}>{role}</strong>. Check they look right.
          </p>
        </div>
        <div style={{ textAlign: "center", flexShrink: 0, marginLeft: 24 }}>
          <ScoreBadge score={atsBefore} label="ATS score now" />
        </div>
      </div>

      <div style={{
        border: `1px solid ${BORDER}`, borderRadius: 14, background: BG_CARD,
        overflow: "hidden", marginBottom: 20,
      }}>
        {/* Contact */}
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BORDER}` }}>
          <SectionLabel>Contact</SectionLabel>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: FG }}>{ledger.contact.name || "—"}</p>
          <p style={{ margin: "2px 0 0", fontSize: 13, color: MUTED }}>
            {[ledger.contact.email, ledger.contact.phone, ledger.contact.location].filter(Boolean).join(" · ")}
          </p>
        </div>

        {/* Summary */}
        {ledger.summary && (
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${BORDER}` }}>
            <SectionLabel>Summary</SectionLabel>
            <p style={{ margin: 0, fontSize: 13, color: FG, lineHeight: 1.6 }}>{ledger.summary}</p>
          </div>
        )}

        {/* Experience */}
        {ledger.experience.length > 0 && (
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${BORDER}` }}>
            <SectionLabel>Experience ({ledger.experience.length} roles)</SectionLabel>
            {ledger.experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: FG }}>{exp.title}</span>
                  <span style={{ fontSize: 12, color: MUTED }}>{exp.start} – {exp.end}</span>
                </div>
                <span style={{ fontSize: 12, color: MUTED }}>{exp.org}</span>
                <ul style={{ margin: "6px 0 0 16px", padding: 0 }}>
                  {exp.bullets.map((b) => (
                    <li key={b.id} style={{ fontSize: 12.5, color: "#444", lineHeight: 1.55, marginBottom: 2 }}>{b.text}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {ledger.education.length > 0 && (
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${BORDER}` }}>
            <SectionLabel>Education</SectionLabel>
            {ledger.education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: FG }}>{edu.qualification}</span>
                <span style={{ fontSize: 12, color: MUTED }}> · {edu.institution} {edu.year}</span>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {ledger.skills.length > 0 && (
          <div style={{ padding: "14px 20px" }}>
            <SectionLabel>Skills ({ledger.skills.length})</SectionLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {ledger.skills.map((s, i) => (
                <span key={i} style={{
                  fontSize: 12, color: MUTED, background: "#f5f4ef",
                  border: `1px solid ${BORDER}`, borderRadius: 99, padding: "3px 10px",
                }}>{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onNext}
        disabled={loading}
        style={{
          width: "100%", padding: "13px 0",
          background: CORAL, color: "white",
          border: "none", borderRadius: 11, fontSize: 14, fontWeight: 700,
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "inherit", transition: "opacity 0.15s",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Rewriting your CV…" : "Rewrite toward " + role + " →"}
      </button>
    </div>
  );
}

/* ── Step 3: Before / after + metric prompts + download ─────────────── */

function BulletComparison({ originalText, rewritten }: {
  originalText: string;
  rewritten: { text: string; needs_metric: boolean; metric_prompt: string | null };
}) {
  const changed = originalText.trim() !== rewritten.text.trim();
  return (
    <div style={{ marginBottom: 10 }}>
      {changed && (
        <div style={{
          fontSize: 12, color: "#555", background: "#f5f4ef",
          borderRadius: 6, padding: "5px 10px", marginBottom: 4,
          textDecoration: "line-through", lineHeight: 1.5,
        }}>
          {originalText}
        </div>
      )}
      <div style={{
        fontSize: 12.5, color: FG, background: changed ? "rgba(95,139,46,0.06)" : "transparent",
        borderLeft: changed ? `2px solid #5f8b2e` : "none",
        borderRadius: changed ? "0 6px 6px 0" : 0,
        padding: changed ? "5px 10px" : "2px 0",
        lineHeight: 1.55,
      }}>
        {rewritten.text}
        {rewritten.needs_metric && (
          <span style={{ fontSize: 10.5, color: "#a06a12", background: "rgba(197,129,28,0.10)", borderRadius: 4, padding: "1px 5px", marginLeft: 6 }}>
            needs metric
          </span>
        )}
      </div>
    </div>
  );
}

function StepResult({
  result, ledger, role, onRefine, onDownload, downloading,
}: {
  result: GenerateRewriteResponse;
  ledger: CVLedger;
  role: string;
  onRefine: (answers: Record<string, string>) => void;
  onDownload: () => void;
  downloading: boolean;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showMetrics, setShowMetrics] = useState(false);
  const { rewritten, ats_score_before, ats_score_after, metric_prompts, verified, flagged_items } = result;
  const delta = ats_score_after - ats_score_before;

  // Build a lookup of original bullet text by id
  const originalByBulletId: Record<string, string> = {};
  for (const exp of ledger.experience) {
    for (const b of exp.bullets) originalByBulletId[b.id] = b.text;
  }
  for (const proj of ledger.projects) {
    for (const b of proj.bullets) originalByBulletId[b.id] = b.text;
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", color: FG, margin: "0 0 4px" }}>
            CV rewritten for {role}
          </h2>
          <p style={{ fontSize: 14, color: MUTED, margin: 0 }}>
            Every change traces to your original. Nothing invented.
          </p>
        </div>

        {/* ATS score delta */}
        <div style={{
          display: "flex", gap: 20, alignItems: "center",
          border: `1px solid ${BORDER}`, borderRadius: 12, padding: "14px 20px",
          background: BG_CARD, flexShrink: 0, marginLeft: 24,
        }}>
          <ScoreBadge score={ats_score_before} label="Before" />
          <div style={{ fontSize: 18, color: BORDER }}>→</div>
          <ScoreBadge score={ats_score_after} label="After" />
          {delta !== 0 && (
            <div style={{
              fontSize: 13, fontWeight: 700,
              color: delta > 0 ? "#437a1a" : "#c7302b",
              background: delta > 0 ? "rgba(95,139,46,0.10)" : "rgba(232,74,69,0.10)",
              borderRadius: 99, padding: "3px 10px",
            }}>
              {delta > 0 ? "+" : ""}{delta} pts
            </div>
          )}
        </div>
      </div>

      {/* Verification warning */}
      {!verified && flagged_items.length > 0 && (
        <div style={{
          border: "1px solid rgba(197,129,28,0.3)", borderRadius: 10,
          background: "rgba(197,129,28,0.06)", padding: "12px 16px", marginBottom: 16,
        }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#a06a12", margin: "0 0 6px" }}>
            Verification flagged {flagged_items.length} item{flagged_items.length > 1 ? "s" : ""} — please review before downloading
          </p>
          {flagged_items.map((item, i) => (
            <p key={i} style={{ fontSize: 12.5, color: "#7a5010", margin: "0 0 2px" }}>· {item}</p>
          ))}
        </div>
      )}

      {/* Before / after by section */}
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 14, background: BG_CARD, overflow: "hidden", marginBottom: 20 }}>
        {rewritten.experience.map((exp) => {
          const orig = ledger.experience.find((e) => e.id === exp.id);
          return (
            <div key={exp.id} style={{ padding: "16px 20px", borderBottom: `1px solid ${BORDER}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: FG }}>{exp.title}</span>
                  <span style={{ fontSize: 12, color: MUTED }}> · {exp.org}</span>
                </div>
                <span style={{ fontSize: 12, color: MUTED }}>{exp.start} – {exp.end}</span>
              </div>
              {exp.bullets.map((b, i) => (
                <BulletComparison
                  key={b.id}
                  originalText={orig?.bullets[i]?.text ?? originalByBulletId[b.id] ?? b.text}
                  rewritten={b}
                />
              ))}
            </div>
          );
        })}

        {rewritten.projects.length > 0 && rewritten.projects.map((proj) => {
          const orig = ledger.projects.find((p) => p.id === proj.id);
          return (
            <div key={proj.id} style={{ padding: "16px 20px", borderBottom: `1px solid ${BORDER}` }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: FG, display: "block", marginBottom: 8 }}>{proj.name}</span>
              {proj.bullets.map((b, i) => (
                <BulletComparison
                  key={b.id}
                  originalText={orig?.bullets[i]?.text ?? originalByBulletId[b.id] ?? b.text}
                  rewritten={b}
                />
              ))}
            </div>
          );
        })}
      </div>

      {/* Metric prompts — optional refinement */}
      {metric_prompts.length > 0 && (
        <div style={{
          border: `1px solid ${BORDER}`, borderRadius: 14, background: BG_CARD,
          marginBottom: 20, overflow: "hidden",
        }}>
          <button
            onClick={() => setShowMetrics((v) => !v)}
            style={{
              width: "100%", padding: "14px 20px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
            }}
          >
            <div style={{ textAlign: "left" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: FG }}>
                Add metrics to {metric_prompts.length} bullet{metric_prompts.length > 1 ? "s" : ""}
              </span>
              <span style={{ fontSize: 12.5, color: MUTED, marginLeft: 8 }}>optional — makes bullets stronger</span>
            </div>
            <span style={{ fontSize: 12, color: MUTED }}>{showMetrics ? "▲" : "▼"}</span>
          </button>
          {showMetrics && (
            <div style={{ padding: "0 20px 16px", borderTop: `1px solid ${BORDER}` }}>
              <p style={{ fontSize: 12.5, color: MUTED, margin: "12px 0 14px", lineHeight: 1.6 }}>
                Answer any of these to add specific numbers to your bullets. Leave blank to skip.
                When done, click "Regenerate with answers."
              </p>
              {metric_prompts.map((p: MetricPrompt) => (
                <div key={p.bullet_id} style={{ marginBottom: 14 }}>
                  <p style={{ fontSize: 12, color: MUTED, margin: "0 0 2px" }}>{p.section}</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: FG, margin: "0 0 6px" }}>{p.question}</p>
                  <p style={{ fontSize: 11.5, color: "#888", margin: "0 0 6px", fontStyle: "italic" }}>Context: "{p.context}"</p>
                  <input
                    value={answers[p.bullet_id] ?? ""}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, [p.bullet_id]: e.target.value }))}
                    placeholder="Your answer (optional)"
                    style={{
                      width: "100%", padding: "9px 12px",
                      border: `1px solid ${BORDER}`, borderRadius: 8,
                      fontSize: 13, color: FG, background: "#faf9f5",
                      fontFamily: "inherit", outline: "none", boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = FG)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = BORDER)}
                  />
                </div>
              ))}
              <button
                onClick={() => onRefine(answers)}
                style={{
                  padding: "10px 20px", background: FG, color: "white",
                  border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Regenerate with answers →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Template recommendation */}
      <div style={{
        border: `1px solid ${BORDER}`, borderRadius: 14, background: BG_CARD,
        padding: "16px 20px", marginBottom: 20,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: FG, margin: "0 0 2px" }}>
              ATS-Optimised template
              <span style={{ fontSize: 11, fontWeight: 600, color: "#437a1a", background: "rgba(95,139,46,0.10)", borderRadius: 99, padding: "2px 8px", marginLeft: 8 }}>
                Recommended
              </span>
            </p>
            <p style={{ fontSize: 12.5, color: MUTED, margin: 0 }}>
              Single column · real selectable text · ATS score {ats_score_after}/100
            </p>
            <p style={{ fontSize: 11.5, color: MUTED, margin: "4px 0 0", fontStyle: "italic" }}>
              Best for online application portals and ATS systems.
            </p>
          </div>
        </div>
      </div>

      {/* Download */}
      <button
        onClick={onDownload}
        disabled={downloading}
        style={{
          width: "100%", padding: "14px 0",
          background: CORAL, color: "white",
          border: "none", borderRadius: 11, fontSize: 15, fontWeight: 700,
          cursor: downloading ? "not-allowed" : "pointer",
          fontFamily: "inherit", opacity: downloading ? 0.7 : 1,
          boxShadow: "0 4px 16px rgba(242,92,84,0.28)",
          transition: "opacity 0.15s",
        }}
      >
        {downloading ? "Generating PDF…" : "Download PDF ↓"}
      </button>
      <p style={{ fontSize: 12, color: MUTED, textAlign: "center", marginTop: 8 }}>
        ATS score validated · real selectable text · no images
      </p>
    </div>
  );
}

/* ── Main page ────────────────────────────────────────────────────────── */

type Step = 0 | 1 | 2;

export default function RewritePage() {
  const [step, setStep] = useState<Step>(0);
  const [file, setFile] = useState<File | null>(null);
  const [role, setRole] = useState("");
  const [ledger, setLedger] = useState<CVLedger | null>(null);
  const [cvText, setCvText] = useState("");
  const [atsBefore, setAtsBefore] = useState(0);
  const [result, setResult] = useState<GenerateRewriteResponse | null>(null);

  const structure = useStructureCv();
  const generate = useGenerateRewrite();
  const downloadPdf = useDownloadPdf();

  function handleExtract() {
    if (!file) return;
    structure.mutate(file, {
      onSuccess(data) {
        setLedger(data.ledger);
        setCvText(data.cv_text);
        setAtsBefore(data.ats_score_before);
        setStep(1);
      },
    });
  }

  function handleGenerate(userAnswers: Record<string, string> = {}) {
    if (!ledger) return;
    generate.mutate(
      { ledger, cvText, targetRole: role, userAnswers },
      {
        onSuccess(data) {
          setResult(data);
          setStep(2);
        },
      },
    );
  }

  function handleDownload() {
    if (!result) return;
    const name = result.rewritten?.contact?.name ?? "candidate";
    const filename = `${name.replace(/\s+/g, "-").toLowerCase()}-${role.replace(/\s+/g, "-").toLowerCase()}.pdf`;
    downloadPdf.mutate({ rewritten: result.rewritten as RewrittenCVLedger, filename });
  }

  const structureError = structure.isError
    ? (structure.error as Error)?.message?.includes("scanned") ? "This PDF appears to be a scanned image — please use a text-based PDF." : "Extraction failed — please try again."
    : null;

  const generateError = generate.isError
    ? "Rewrite failed — please try again."
    : null;

  return (
    <div style={{ padding: "40px 48px", maxWidth: 800 }}>
      <StepDots step={step} />

      {step === 0 && (
        <StepUpload
          file={file}
          onFile={setFile}
          role={role}
          onRole={setRole}
          onNext={handleExtract}
          loading={structure.isPending}
          error={structureError}
        />
      )}

      {step === 1 && ledger && (
        <StepReview
          ledger={ledger}
          atsBefore={atsBefore}
          role={role}
          onNext={() => handleGenerate()}
          loading={generate.isPending}
        />
      )}

      {generateError && step === 1 && (
        <p style={{ fontSize: 13, color: "#c7302b", marginTop: 12 }}>{generateError}</p>
      )}

      {step === 2 && result && ledger && (
        <StepResult
          result={result}
          ledger={ledger}
          role={role}
          onRefine={(answers) => handleGenerate(answers)}
          onDownload={handleDownload}
          downloading={downloadPdf.isPending}
        />
      )}
    </div>
  );
}
