interface Props {
  label: string;
  value: number; // 0–1 float from component_scores
}

function band(v: number) {
  if (v >= 75) return { fill: "#5f8b2e", track: "rgba(95,139,46,0.12)", label: "Strong" };
  if (v >= 50) return { fill: "#c5811c", track: "rgba(197,129,28,0.12)", label: "Average" };
  return { fill: "#e84a45", track: "rgba(232,74,69,0.10)", label: "Weak" };
}

export function ScoreBar({ label, value }: Props) {
  const v = Math.round(value * 100);
  const b = band(v);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#22272f" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: b.fill }}>
          {v}<span style={{ fontWeight: 600, color: "#a7a99f" }}> / 100</span>
        </span>
      </div>
      <div style={{ height: 11, borderRadius: 999, background: b.track, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: "100%", borderRadius: 999, background: b.fill,
          transform: `scaleX(${v / 100})`,
          transformOrigin: "left",
          transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)",
        }} />
      </div>
    </div>
  );
}

export function ScoreBarCard({ label, value }: Props) {
  const v = Math.round(value * 100);
  const b = band(v);

  return (
    <div style={{
      background: "#fff", border: "1px solid #ecebe3", borderRadius: 16,
      padding: "20px 22px", marginBottom: 14,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#52575f", lineHeight: 1.3 }}>{label}</span>
        <span style={{
          fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999,
          background: b.track, color: b.fill, whiteSpace: "nowrap",
        }}>
          {b.label}
        </span>
      </div>
      <div style={{
        fontFamily: "var(--font-serif), 'Source Serif 4', serif",
        fontSize: 28, fontWeight: 600, color: "#22272f", lineHeight: 1, marginBottom: 10,
      }}>
        {v}<span style={{ fontSize: 14, color: "#a7a99f", fontWeight: 600 }}> / 100</span>
      </div>
      <div style={{ height: 8, borderRadius: 999, background: b.track, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: "100%", borderRadius: 999, background: b.fill,
          transform: `scaleX(${v / 100})`,
          transformOrigin: "left",
          transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)",
        }} />
      </div>
    </div>
  );
}
