interface Props {
  text: string;
  matched: boolean;
}

export function SkillPill({ text, matched }: Props) {
  return matched ? (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: "rgba(95,139,46,0.12)", color: "#5f8b2e",
      padding: "7px 14px", borderRadius: 999,
      fontSize: 13.5, fontWeight: 600, margin: 3,
    }}>
      ✓ {text}
    </span>
  ) : (
    <span style={{
      display: "inline-flex", alignItems: "center",
      background: "rgba(232,74,69,0.10)", color: "#e84a45",
      padding: "7px 14px", borderRadius: 999,
      fontSize: 13.5, fontWeight: 600, margin: 3,
    }}>
      {text}
    </span>
  );
}
