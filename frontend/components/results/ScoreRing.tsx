"use client";

import { useEffect, useState } from "react";

const R = 52;
const C = 2 * Math.PI * R;

function band(v: number) {
  if (v >= 75) return "#5f8b2e";
  if (v >= 50) return "#c5811c";
  return "#e84a45";
}

interface Props {
  score: number;
  size?: number;
  strokeWidth?: number;
  numSize?: number;
}

export function ScoreRing({ score, size = 156, strokeWidth = 12, numSize = 42 }: Props) {
  const clamped = Math.max(0, Math.min(100, score));
  const finalOffset = C * (1 - clamped / 100);
  const [offset, setOffset] = useState(C);

  useEffect(() => {
    const t = setTimeout(() => setOffset(finalOffset), 60);
    return () => clearTimeout(t);
  }, [finalOffset]);

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg
        viewBox="0 0 120 120"
        width={size}
        height={size}
        style={{ transform: "rotate(-90deg)", display: "block" }}
      >
        {/* Track */}
        <circle cx="60" cy="60" r={R} fill="none" stroke="#edebe1" strokeWidth={strokeWidth} />
        {/* Progress */}
        <circle
          cx="60"
          cy="60"
          r={R}
          fill="none"
          stroke={band(clamped)}
          strokeWidth={strokeWidth}
          strokeDasharray={C}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1,
      }}>
        <span style={{
          fontFamily: "var(--font-serif), 'Source Serif 4', serif",
          fontSize: numSize, fontWeight: 600, color: "#22272f", lineHeight: 1,
        }}>
          {clamped}
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#a7a99f" }}>
          / 100
        </span>
      </div>
    </div>
  );
}
