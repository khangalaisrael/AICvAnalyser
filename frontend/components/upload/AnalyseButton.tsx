"use client";

interface Props {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
  step: number;
  steps?: string[];
}

const DEFAULT_STEPS = [
  "Extracting CV text...",
  "Analysing with AI...",
  "Scoring against role...",
];

export function AnalyseButton({ onClick, disabled, loading, step, steps }: Props) {
  const STEPS = steps ?? DEFAULT_STEPS;

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {STEPS.map((label, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: done ? "#5f8b2e" : active ? "#f25c54" : "#ecebe3",
                transition: "background 0.25s",
              }}>
                {done ? (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : active ? (
                  <span style={{
                    width: 7, height: 7, borderRadius: "50%", background: "#fff",
                    animation: "pulse 1s ease-in-out infinite",
                  }} />
                ) : null}
              </div>
              <span style={{
                fontSize: 13.5,
                color: done ? "#5f8b2e" : active ? "#22272f" : "#a7a99f",
                fontWeight: active ? 600 : 400,
                transition: "color 0.25s",
              }}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%", height: 42, borderRadius: 11,
        background: disabled ? "#e8e7e0" : "#f25c54",
        color: disabled ? "#a7a99f" : "#fff",
        fontSize: 14, fontWeight: 600,
        border: "none", cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: disabled ? "none" : "0 3px 10px rgba(242,92,84,.30)",
        transition: "background 0.15s, box-shadow 0.15s",
        fontFamily: "inherit",
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = "#e04e47"; }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.background = "#f25c54"; }}
    >
      Analyse CV
    </button>
  );
}
