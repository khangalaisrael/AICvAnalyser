const SERIF = "var(--font-serif), 'Source Serif 4', serif";

/** One bar showing how the role's skills split into matched, inferred and missing. */
export function SkillCoverage({
  matched, inferred, missing,
}: { matched: number; inferred: number; missing: number }) {
  const total = matched + inferred + missing;
  if (total === 0) return null;
  const parts = [
    { label: "Matched", n: matched, color: "#5f8b2e" },
    { label: "Inferred", n: inferred, color: "#c5811c" },
    { label: "Missing", n: missing, color: "#e84a45" },
  ];
  const covered = Math.round(((matched + inferred) / total) * 100);
  return (
    <div style={{ background: "#fff", border: "1px solid #ecebe3", borderRadius: 18, padding: "20px 22px", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
        <p style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 600, margin: 0, color: "#22272f" }}>Skill coverage</p>
        <p style={{ fontSize: 13, color: "#7c818b", margin: 0 }}>
          <strong style={{ color: "#22272f" }}>{covered}%</strong> of {total} skills covered
        </p>
      </div>
      <div style={{ display: "flex", height: 12, borderRadius: 99, overflow: "hidden", background: "#f3f2ec", gap: 2 }}>
        {parts.filter((p) => p.n > 0).map((p) => (
          <div key={p.label} title={`${p.label}: ${p.n}`} style={{ width: `${(p.n / total) * 100}%`, background: p.color, transition: "width .6s" }} />
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 18px", marginTop: 12 }}>
        {parts.map((p) => (
          <span key={p.label} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "#52575f" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }} />
            {p.label} <strong style={{ color: "#22272f" }}>{p.n}</strong>
          </span>
        ))}
      </div>
    </div>
  );
}
