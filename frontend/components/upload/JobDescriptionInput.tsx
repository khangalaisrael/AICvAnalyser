"use client";

interface Props {
  value: string;
  onChange: (v: string) => void;
  variant: "aspiring" | "apply";
}

const CONFIG = {
  aspiring: {
    label: "What role are you aiming for?",
    placeholder: "e.g. 'software engineer' or 'I want to get into data science'",
    helper: "AI will research current market requirements and coach your CV toward this goal.",
    rows: 2,
  },
  apply: {
    label: "Job description",
    placeholder: "Paste the full job description from LinkedIn, Indeed, or any job board...",
    helper: "AI will match your CV directly against this listing.",
    rows: 6,
  },
};

export function JobDescriptionInput({ value, onChange, variant }: Props) {
  const cfg = CONFIG[variant];

  return (
    <div>
      <p style={{
        fontSize: 12, fontWeight: 600, color: "#7c818b",
        letterSpacing: "0.05em", textTransform: "uppercase", margin: "0 0 10px",
      }}>
        {cfg.label}
      </p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={cfg.placeholder}
        rows={cfg.rows}
        style={{
          width: "100%",
          padding: "10px 12px",
          border: "1px solid #d9d8d0",
          borderRadius: 10,
          fontSize: 13.5,
          color: "#22272f",
          background: "#fff",
          resize: "vertical",
          fontFamily: "inherit",
          lineHeight: 1.55,
          outline: "none",
          transition: "border-color 0.15s",
          boxSizing: "border-box",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#f25c54")}
        onBlur={(e) => (e.target.style.borderColor = "#d9d8d0")}
      />
      <p style={{ fontSize: 12, color: "#a7a99f", margin: "6px 0 0" }}>
        {cfg.helper}
      </p>
    </div>
  );
}
