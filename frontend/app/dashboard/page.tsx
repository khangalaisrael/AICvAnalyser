"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/store/appStore";
import { useAnalyse } from "@/hooks/useAnalyse";
import { RoleSelector } from "@/components/upload/RoleSelector";
import { PdfDropzone } from "@/components/upload/PdfDropzone";
import { JobDescriptionInput } from "@/components/upload/JobDescriptionInput";
import { AnalyseButton } from "@/components/upload/AnalyseButton";
import { ResultsPanel } from "@/components/results/ResultsPanel";

type Mode = "role" | "aspiring" | "apply";

const STEPS: Record<Mode, string[]> = {
  role:     ["Analysing CV...", "Scoring results...", "Building feedback..."],
  aspiring: ["Researching role...", "Coaching your CV...", "Scoring results..."],
  apply:    ["Reading job listing...", "Matching CV...", "Scoring results..."],
};

const TABS: { id: Mode; label: string; sub: string }[] = [
  { id: "role",     label: "Quick match",  sub: "Pick a role" },
  { id: "aspiring", label: "Aspiring",     sub: "I want to become..." },
  { id: "apply",    label: "Applying",     sub: "I have a listing" },
];

export default function DashboardPage() {
  const { selectedRole } = useAppStore();
  const [mode, setMode] = useState<Mode>("role");
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
    (mode === "role"
      ? !!selectedRole
      : mode === "aspiring"
      ? aspiringText.trim().length > 0
      : applyJd.trim().length > 0);

  function handleAnalyse() {
    if (!canAnalyse) return;
    setStep(0);
    analyse.mutate({
      file: file!,
      role: selectedRole,
      customJd: mode === "aspiring" ? aspiringText : mode === "apply" ? applyJd : undefined,
      mode,
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
        gap: 24,
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

        {/* 3-mode toggle */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
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
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                padding: "0 6px",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Conditional input per mode */}
        {mode === "role" && <RoleSelector />}
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
