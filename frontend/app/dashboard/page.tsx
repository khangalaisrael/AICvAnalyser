"use client";

import { useState, useEffect } from "react";
import { useAnalyse } from "@/hooks/useAnalyse";
import { PdfDropzone } from "@/components/upload/PdfDropzone";
import { JobDescriptionInput } from "@/components/upload/JobDescriptionInput";
import { AnalyseButton } from "@/components/upload/AnalyseButton";
import { ResultsPanel } from "@/components/results/ResultsPanel";

type Mode = "aspiring" | "apply";
type UserMode = "job_seeker" | "professional";

const STEPS: Record<Mode, string[]> = {
  aspiring: ["Researching role...", "Coaching your CV...", "Scoring results..."],
  apply:    ["Reading job listing...", "Matching CV...", "Scoring results..."],
};

const TABS: { id: Mode; label: string }[] = [
  { id: "aspiring", label: "Aspiring" },
  { id: "apply",    label: "Applying" },
];

const USER_MODE_OPTIONS: { id: UserMode; label: string; sub: string }[] = [
  { id: "job_seeker",   label: "Job hunting",   sub: "Land your next role" },
  { id: "professional", label: "Professional",  sub: "Stay ahead at work" },
];

export default function DashboardPage() {
  const [mode, setMode] = useState<Mode>("aspiring");
  const [userMode, setUserMode] = useState<UserMode>("job_seeker");
  const [file, setFile] = useState<File | null>(null);
  const [aspiringText, setAspiringText] = useState("");
  const [applyJd, setApplyJd] = useState("");
  const [step, setStep] = useState(0);
  const analyse = useAnalyse();

  useEffect(() => {
    if (!analyse.isPending) { setStep(0); return; }
    const id = setInterval(() => setStep((s) => Math.min(s + 1, 2)), 3000);
    return () => clearInterval(id);
  }, [analyse.isPending]);

  const canAnalyse =
    !!file &&
    (mode === "aspiring" ? aspiringText.trim().length > 0 : applyJd.trim().length > 0);

  function handleAnalyse() {
    if (!canAnalyse) return;
    setStep(0);
    analyse.mutate({
      file: file!,
      customJd: mode === "aspiring" ? aspiringText : applyJd,
      mode,
      userMode,
    });
  }

  const errorMsg = (() => {
    if (!analyse.isError) return null;
    const msg = (analyse.error as Error)?.message ?? "";
    if (msg.includes("422") || msg.toLowerCase().includes("research")) {
      return mode === "aspiring"
        ? "Couldn't identify a role from that description — try being a bit more specific."
        : "Analysis failed — please try again.";
    }
    return "Analysis failed — please try again.";
  })();

  return (
    <div style={{ display: "flex", height: "100%", minHeight: "100vh" }}>
      {/* Left: upload panel */}
      <div style={{
        width: 312,
        flexShrink: 0,
        borderRight: "1px solid #ecebe3",
        padding: "28px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        background: "#fff",
      }}>
        <div>
          <p style={{
            fontFamily: "var(--font-serif), 'Source Serif 4', serif",
            fontSize: 18, fontWeight: 600, color: "#22272f", margin: "0 0 4px",
          }}>
            Analyse a CV
          </p>
          <p style={{ fontSize: 13.5, color: "#7c818b", margin: 0 }}>
            Upload a PDF and choose how you want to match it.
          </p>
        </div>

        {/* User mode toggle */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#a7a99f", letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 8px" }}>
            I am currently
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {USER_MODE_OPTIONS.map(({ id, label, sub }) => (
              <button
                key={id}
                onClick={() => setUserMode(id)}
                style={{
                  padding: "10px 10px",
                  borderRadius: 10,
                  border: userMode === id ? "1.5px solid #f25c54" : "1.5px solid #ecebe3",
                  background: userMode === id ? "rgba(242,92,84,0.05)" : "#fafaf7",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                  transition: "border-color 0.15s, background 0.15s",
                }}
              >
                <p style={{ fontSize: 12.5, fontWeight: 700, color: userMode === id ? "#f25c54" : "#22272f", margin: "0 0 1px" }}>{label}</p>
                <p style={{ fontSize: 11, color: "#a7a99f", margin: 0 }}>{sub}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 2-mode toggle */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          background: "#f3f2ec", borderRadius: 10, padding: 3, gap: 2,
        }}>
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              style={{
                height: 34, borderRadius: 8, border: "none",
                background: mode === id ? "#fff" : "transparent",
                color: mode === id ? "#22272f" : "#7c818b",
                fontSize: 12.5, fontWeight: mode === id ? 600 : 400,
                cursor: "pointer", fontFamily: "inherit",
                boxShadow: mode === id ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                transition: "background 0.15s, color 0.15s, box-shadow 0.15s",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {mode === "aspiring" && (
          <JobDescriptionInput
            value={aspiringText}
            onChange={setAspiringText}
            variant="aspiring"
          />
        )}
        {mode === "apply" && (
          <JobDescriptionInput
            value={applyJd}
            onChange={setApplyJd}
            variant="apply"
          />
        )}

        <PdfDropzone file={file} onFile={setFile} />

        {errorMsg && (
          <p style={{ fontSize: 13, color: "#e84a45", margin: 0 }}>
            {errorMsg}
          </p>
        )}

        <AnalyseButton
          onClick={handleAnalyse}
          disabled={!canAnalyse || analyse.isPending}
          loading={analyse.isPending}
          step={step}
          steps={STEPS[mode]}
        />
      </div>

      {/* Right: results */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <ResultsPanel />
      </div>
    </div>
  );
}
