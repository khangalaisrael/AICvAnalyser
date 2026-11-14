"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import Link from "next/link";

/* ── design tokens ──────────────────────────────────────────────────────── */
const CORAL = "#f25c54";
const INK = "#22272f";
const MUTED = "#7c818b";
const BORDER = "#ecebe3";
const BG = "#faf9f5";
const CARD = "#ffffff";
const MONO = "'ui-monospace','SF Mono','Cascadia Code','Roboto Mono',monospace";

/* ── tiny motion primitives ─────────────────────────────────────────────── */

function FadeUp({
  children,
  delay = 0,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ── icons ──────────────────────────────────────────────────────────────── */

function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.27,
      background: CORAL, flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 2px 8px rgba(242,92,84,0.28)",
    }}>
      <svg width={size * 0.46} height={size * 0.46} viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M3 8.5L6.5 12L13 5" stroke="white" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function Arrow({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Check({ size = 11, pass = true }: { size?: number; pass?: boolean }) {
  return pass ? (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 6l3 3 5-5" stroke="#437a1a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M3 3l6 6M9 3l-6 6" stroke="#c7302b" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/* ── hero visual: CV → analysis transformation ──────────────────────────── */

function PlainCvCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14,
        padding: "18px 16px", width: 148,
        boxShadow: "0 2px 12px rgba(34,39,47,0.06)",
      }}
    >
      {/* mini CV document */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
        <div style={{ width: 22, height: 22, borderRadius: 6, background: "#f0efe7", flexShrink: 0 }} />
        <div>
          <div style={{ width: 60, height: 6, background: "#d4d3cb", borderRadius: 3, marginBottom: 3 }} />
          <div style={{ width: 44, height: 5, background: "#e8e7df", borderRadius: 3 }} />
        </div>
      </div>
      {[72, 58, 72, 48, 64, 52].map((w, i) => (
        <div key={i} style={{
          width: `${w}%`, height: 5, background: i % 3 === 0 ? "#d4d3cb" : "#e8e7df",
          borderRadius: 3, marginBottom: 5,
        }} />
      ))}
      <div style={{ marginTop: 10 }}>
        {[80, 64].map((w, i) => (
          <div key={i} style={{
            width: `${w}%`, height: 4, background: "#eae9e1",
            borderRadius: 3, marginBottom: 4,
          }} />
        ))}
      </div>
      <div style={{ fontSize: 9, color: "#bbb", marginTop: 10, fontFamily: MONO, textAlign: "center" }}>
        your-cv.pdf
      </div>
    </motion.div>
  );
}

function ScoreResultCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14,
        padding: "18px 16px", width: 190,
        boxShadow: "0 6px 32px rgba(34,39,47,0.10)",
      }}
    >
      <div style={{ fontSize: 10, color: MUTED, marginBottom: 8, letterSpacing: 0.1 }}>
        Senior Product Manager
      </div>

      {/* score */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginBottom: 6 }}>
        <span style={{ fontSize: 34, fontWeight: 800, color: INK, fontFamily: MONO, letterSpacing: "-0.04em", lineHeight: 1 }}>87</span>
        <span style={{ fontSize: 13, color: MUTED, fontFamily: MONO }}>/100</span>
      </div>

      {/* bar */}
      <div style={{ height: 4, background: BORDER, borderRadius: 99, marginBottom: 12, overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "87%" }}
          transition={{ duration: 0.9, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
          style={{ height: 4, background: "linear-gradient(90deg,#437a1a,#7db83a)", borderRadius: 99 }}
        />
      </div>

      {/* match items */}
      {[
        { text: "Product leadership exp.", pass: true },
        { text: "Cross-functional teams", pass: true },
        { text: "OKR framework missing", pass: false },
        { text: "SQL not in skills", pass: false },
      ].map((item) => (
        <div key={item.text} style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 5 }}>
          <div style={{ marginTop: 1, flexShrink: 0 }}>
            <Check pass={item.pass} />
          </div>
          <span style={{ fontSize: 10.5, color: item.pass ? INK : MUTED, lineHeight: 1.4 }}>{item.text}</span>
        </div>
      ))}
    </motion.div>
  );
}

/* ── feature section mock UIs ───────────────────────────────────────────── */

function MockCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16,
      padding: "24px", boxShadow: "0 4px 24px rgba(34,39,47,0.07)",
      maxWidth: 380, width: "100%",
    }}>
      {children}
    </div>
  );
}

function ScoreFeatureMock() {
  const items = [
    { text: "Led cross-functional teams (3 mentions)", pass: true },
    { text: "5+ yrs product experience", pass: true },
    { text: "Agile / Scrum methodology", pass: true },
    { text: "OKRs framework — not mentioned", pass: false },
    { text: "SQL proficiency — not in skills", pass: false },
  ];
  return (
    <MockCard>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>Head of Product · Fintech</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
            <span style={{ fontSize: 40, fontWeight: 800, color: INK, fontFamily: MONO, letterSpacing: "-0.04em", lineHeight: 1 }}>82</span>
            <span style={{ fontSize: 14, color: MUTED, fontFamily: MONO }}>/100</span>
          </div>
        </div>
        <div style={{
          fontSize: 10.5, fontWeight: 700, color: "#437a1a",
          background: "rgba(67,122,26,0.10)", borderRadius: 99, padding: "4px 10px",
        }}>Strong match</div>
      </div>
      <div style={{ height: 5, background: BORDER, borderRadius: 99, marginBottom: 14, overflow: "hidden" }}>
        <div style={{ height: 5, width: "82%", background: "linear-gradient(90deg,#437a1a,#7db83a)", borderRadius: 99 }} />
      </div>
      {items.map((item) => (
        <div key={item.text} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
          <div style={{ marginTop: 1, flexShrink: 0 }}><Check pass={item.pass} /></div>
          <span style={{ fontSize: 12.5, color: item.pass ? INK : MUTED, lineHeight: 1.5 }}>{item.text}</span>
        </div>
      ))}
    </MockCard>
  );
}

function AtsFeatureMock() {
  const items = [
    { text: "Two-column layout detected", pass: false },
    { text: "Contact info in header — may be skipped", pass: false },
    { text: "Table used in skills section", pass: false },
    { text: "No images or text in images", pass: true },
    { text: "Standard section headings", pass: true },
    { text: "Machine-readable fonts", pass: true },
  ];
  return (
    <MockCard>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: INK }}>ATS scan</div>
        <div style={{
          fontSize: 10.5, fontWeight: 700, color: "#c7302b",
          background: "rgba(199,48,43,0.08)", borderRadius: 99, padding: "3px 10px",
        }}>3 issues found</div>
      </div>
      <div style={{ height: 1, background: BORDER, marginBottom: 14 }} />
      {items.map((item) => (
        <div key={item.text} style={{ display: "flex", gap: 8, marginBottom: 9, alignItems: "flex-start" }}>
          <div style={{ marginTop: 1, flexShrink: 0 }}><Check pass={item.pass} /></div>
          <span style={{ fontSize: 12.5, color: item.pass ? MUTED : INK, lineHeight: 1.5 }}>{item.text}</span>
        </div>
      ))}
    </MockCard>
  );
}

function GapsFeatureMock() {
  const skills = [
    { name: "SQL", count: 9, have: false },
    { name: "OKR frameworks", count: 8, have: false },
    { name: "Agile / Scrum", count: 8, have: true },
    { name: "Stakeholder mgmt", count: 7, have: true },
    { name: "A/B testing", count: 5, have: false },
  ];
  return (
    <MockCard>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: INK, marginBottom: 3 }}>Live market · Senior PM · London</div>
        <div style={{ fontSize: 11, color: MUTED }}>Based on 47 current postings</div>
      </div>
      <div style={{ height: 1, background: BORDER, marginBottom: 14 }} />
      {skills.map((s) => (
        <div key={s.name} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: s.have ? MUTED : INK, fontWeight: s.have ? 400 : 600 }}>{s.name}</span>
            <span style={{ fontSize: 11, color: MUTED, fontFamily: MONO }}>{s.count}/10 postings</span>
          </div>
          <div style={{ height: 4, background: BORDER, borderRadius: 99, overflow: "hidden" }}>
            <div style={{
              height: 4, width: `${s.count * 10}%`, borderRadius: 99,
              background: s.have ? "#7db83a" : CORAL, opacity: s.have ? 0.5 : 0.8,
            }} />
          </div>
          {!s.have && (
            <div style={{ fontSize: 10, color: CORAL, marginTop: 2 }}>Not in your CV</div>
          )}
        </div>
      ))}
    </MockCard>
  );
}

function TrendingFeatureMock() {
  const bullets = [
    "Demand for AI-native PMs up 34% vs. last quarter in this market",
    "SQL / data proficiency now cited in 8 of 10 postings for this role",
    "Remote-first roles declining; hybrid positions growing across EMEA",
  ];
  const trending = ["AI/ML product thinking", "Data & SQL", "LLM integration", "GenAI roadmapping", "Prompt engineering"];
  return (
    <MockCard>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: "rgba(197,129,28,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c5811c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
          </svg>
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: INK }}>What the market wants right now</div>
      </div>
      <div style={{ fontSize: 11, color: MUTED, marginBottom: 14 }}>Senior PM · London · 47 live postings</div>
      <div style={{ height: 1, background: BORDER, marginBottom: 14 }} />
      {bullets.map((line, i) => (
        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 9, alignItems: "flex-start" }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#c5811c", marginTop: 6, flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: MUTED, lineHeight: 1.6 }}>{line}</span>
        </div>
      ))}
      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, color: MUTED, marginBottom: 8 }}>
          Skills to watch
        </div>
        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
          {trending.map((t) => (
            <span key={t} style={{
              fontSize: 11, fontWeight: 500, padding: "4px 10px", borderRadius: 6,
              background: "rgba(197,129,28,0.09)", color: "#8c6113",
            }}>{t}</span>
          ))}
        </div>
      </div>
    </MockCard>
  );
}

function InferredSkillsMock() {
  const matched = ["Product strategy", "Stakeholder mgmt", "Agile / Scrum", "Roadmapping"];
  const inferred = ["Data analysis", "User research", "KPI ownership"];
  return (
    <MockCard>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#5f8b2e" }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: INK }}>Matched</span>
        <span style={{
          fontSize: 11, fontWeight: 700, color: "#5f8b2e",
          background: "rgba(95,139,46,0.12)", borderRadius: 99, padding: "2px 8px",
        }}>{matched.length}</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6, marginBottom: 18 }}>
        {matched.map((s) => (
          <span key={s} style={{
            fontSize: 12, fontWeight: 500, padding: "5px 12px", borderRadius: 99,
            background: "rgba(95,139,46,0.10)", color: "#437a1a",
          }}>{s}</span>
        ))}
      </div>
      <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, color: MUTED, marginBottom: 10 }}>
          Inferred from your CV
        </div>
        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6, marginBottom: 10 }}>
          {inferred.map((s) => (
            <span key={s} style={{
              fontSize: 12, fontWeight: 500, padding: "5px 12px", borderRadius: 99,
              background: "rgba(95,139,46,0.07)", color: "#5f8b2e",
              border: "1px dashed rgba(95,139,46,0.35)",
            }}>{s}</span>
          ))}
        </div>
        <p style={{ fontSize: 11.5, color: MUTED, fontStyle: "italic", lineHeight: 1.55, margin: 0 }}>
          Skills we deduced you have — even when not explicitly listed.
        </p>
      </div>
    </MockCard>
  );
}


/* ── explore tabs ───────────────────────────────────────────────────────── */

const SERIF = "var(--font-serif), 'Source Serif 4', serif";

const FEATURES: {
  id: string; tab: string; eyebrow: string; headline: string; body: string; mock: React.ReactNode;
}[] = [
  {
    id: "score", tab: "Match score", eyebrow: "Match score",
    headline: "A score that tells you why.",
    body: "87/100 without context is noise. See exactly which requirements you matched, which you're missing, and how many live postings cite each gap.",
    mock: <ScoreFeatureMock />,
  },
  {
    id: "ats", tab: "ATS check", eyebrow: "ATS check",
    headline: "The problems ATS systems actually catch.",
    body: "Two-column layouts, contact info in headers, tables in skills sections. We flag the real parsing issues, not CV folklore.",
    mock: <AtsFeatureMock />,
  },
  {
    id: "gaps", tab: "Skill gaps", eyebrow: "Skill gaps · live data",
    headline: "Gaps from live postings, not guesswork.",
    body: "\"9 of 10 current postings mention SQL. Your CV doesn't.\" Every gap is grounded in real listings for the role you entered.",
    mock: <GapsFeatureMock />,
  },
  {
    id: "inferred", tab: "Inferred skills", eyebrow: "Inferred skills",
    headline: "Skills you have, even when you didn't say so.",
    body: "We read between the lines and flag inferred skills, so you know what you can claim confidently and what to make explicit.",
    mock: <InferredSkillsMock />,
  },
  {
    id: "market", tab: "Market trends", eyebrow: "Market intelligence",
    headline: "What the market is actually hiring for.",
    body: "Live signal from current postings: which skills are trending for your target role right now, before you apply.",
    mock: <TrendingFeatureMock />,
  },
];

const STEPS = [
  { n: "1", title: "Enter your target role", body: "We pull live postings for that title and market." },
  { n: "2", title: "Upload your CV", body: "Any PDF. Scored against what employers ask for now." },
  { n: "3", title: "Get your breakdown", body: "Score, ATS flags, gaps and trends in one report." },
];

function PrimaryButton({ children, href = "/auth", large = false }: { children: React.ReactNode; href?: string; large?: boolean }) {
  return (
    <Link href={href}
      className="inline-flex items-center justify-center gap-2 transition-all hover:-translate-y-px hover:opacity-95 active:scale-[0.98]"
      style={{
        fontSize: large ? 15.5 : 13.5, fontWeight: 650, color: "white",
        background: `linear-gradient(180deg, #f46a62 0%, ${CORAL} 100%)`,
        borderRadius: large ? 13 : 10, padding: large ? "14px 28px" : "9px 18px",
        textDecoration: "none",
        boxShadow: "0 1px 0 rgba(255,255,255,0.25) inset, 0 6px 22px rgba(242,92,84,0.32)",
      }}>
      {children} <Arrow size={large ? 15 : 13} />
    </Link>
  );
}

function ExplorePanel() {
  const [active, setActive] = useState(FEATURES[0].id);
  const f = FEATURES.find((x) => x.id === active) ?? FEATURES[0];

  return (
    <div>
      <div className="lp-tabs" role="tablist" aria-label="Explore features">
        {FEATURES.map((x) => {
          const on = x.id === active;
          return (
            <button
              key={x.id} role="tab" aria-selected={on} onClick={() => setActive(x.id)}
              style={{
                position: "relative", whiteSpace: "nowrap", cursor: "pointer", border: "none",
                background: "transparent", fontFamily: "inherit", fontSize: 13.5,
                fontWeight: on ? 650 : 500, color: on ? "#fff" : MUTED,
                padding: "9px 16px", borderRadius: 999, transition: "color .2s",
              }}
            >
              {on && (
                <motion.span
                  layoutId="lp-tab-pill"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  style={{ position: "absolute", inset: 0, borderRadius: 999, background: INK, boxShadow: "0 4px 14px rgba(34,39,47,0.22)" }}
                />
              )}
              <span style={{ position: "relative" }}>{x.tab}</span>
            </button>
          );
        })}
      </div>

      <div className="lp-panel">
        <AnimatePresence mode="wait">
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="lp-panel-grid"
          >
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: CORAL, marginBottom: 14 }}>
                {f.eyebrow}
              </p>
              <h3 style={{
                fontFamily: SERIF, fontSize: "clamp(24px, 3.2vw, 36px)", fontWeight: 600,
                letterSpacing: "-0.02em", lineHeight: 1.15, color: INK, marginBottom: 14,
              }}>
                {f.headline}
              </h3>
              <p style={{ fontSize: 15.5, color: MUTED, lineHeight: 1.7, marginBottom: 24, maxWidth: 420 }}>{f.body}</p>
              <PrimaryButton>Try it free</PrimaryButton>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>{f.mock}</div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── main page ──────────────────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] lp-root" style={{ background: BG, color: INK, fontFamily: "var(--font-sans), sans-serif" }}>

      {/* NAV */}
      <nav className="sticky top-0 z-50" style={{
        borderBottom: `1px solid ${BORDER}`, background: "rgba(250,249,245,0.85)",
        backdropFilter: "blur(18px) saturate(1.4)", WebkitBackdropFilter: "blur(18px) saturate(1.4)",
      }}>
        <div className="flex items-center justify-between mx-auto px-5 sm:px-6" style={{ maxWidth: 1100, height: 62 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <LogoMark size={30} />
            <span style={{ fontSize: 15.5, fontWeight: 700, letterSpacing: "-0.01em" }}>TalentScan</span>
          </div>
          <div className="hidden sm:flex items-center gap-7">
            <a href="#how" className="hover:text-[#22272f] transition-colors" style={{ fontSize: 13.5, color: MUTED, textDecoration: "none" }}>How it works</a>
            <a href="#explore" className="hover:text-[#22272f] transition-colors" style={{ fontSize: 13.5, color: MUTED, textDecoration: "none" }}>Features</a>
            <PrimaryButton>Analyze my CV</PrimaryButton>
          </div>
          <Link href="/auth" className="sm:hidden" style={{ fontSize: 13.5, fontWeight: 650, color: CORAL, textDecoration: "none" }}>
            Get started
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="lp-hero-bg">
        <div className="mx-auto px-5 sm:px-6 lp-hero" style={{ maxWidth: 1100 }}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-12 lg:gap-16 items-center">
            <div>
              <motion.span
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7, marginBottom: 24,
                  fontSize: 11.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                  color: CORAL, background: "rgba(242,92,84,0.08)", border: "1px solid rgba(242,92,84,0.18)",
                  borderRadius: 99, padding: "6px 13px",
                }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: CORAL }} />
                Free CV analysis
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: SERIF, fontSize: "clamp(38px, 6vw, 64px)", fontWeight: 600,
                  lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 20,
                }}>
                Know exactly where your CV <span style={{ color: CORAL, fontStyle: "italic" }}>stands.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.16 }}
                style={{ fontSize: 17, color: MUTED, lineHeight: 1.7, maxWidth: 470, marginBottom: 30 }}>
                Score your CV against live job postings, catch ATS problems, and close skill gaps before you apply.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.26 }}
                className="lp-cta-row" style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
                <PrimaryButton large>Analyze my CV</PrimaryButton>
                <a href="#explore"
                  className="inline-flex items-center justify-center transition-all hover:bg-white active:scale-[0.98]"
                  style={{ fontSize: 15, fontWeight: 550, color: INK, border: `1px solid ${BORDER}`, borderRadius: 13, padding: "13px 22px", textDecoration: "none", background: "rgba(255,255,255,0.5)" }}>
                  See features
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.45 }}
                style={{ display: "flex", gap: 18, marginTop: 22, flexWrap: "wrap" }}>
                {["Free to use", "Any PDF format", "No credit card"].map((txt) => (
                  <div key={txt} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Check size={10} pass />
                    <span style={{ fontSize: 13, color: MUTED }}>{txt}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* visual */}
            <div className="flex items-center justify-center gap-4 lp-hero-visual">
              <div className="hidden lg:block"><PlainCvCard /></div>
              <div className="hidden lg:block" style={{ color: "#d4d3cb" }}><Arrow size={18} /></div>
              <ScoreResultCard />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS: compact strip */}
      <section id="how" className="mx-auto px-5 sm:px-6" style={{ maxWidth: 1100, paddingBottom: 56 }}>
        <div className="lp-steps">
          {STEPS.map((st, i) => (
            <FadeUp key={st.n} delay={i * 0.08}>
              <div className="lp-step">
                <span className="lp-step-n">{st.n}</span>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 650, marginBottom: 3 }}>{st.title}</p>
                  <p style={{ fontSize: 13.5, color: MUTED, lineHeight: 1.55 }}>{st.body}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* EXPLORE */}
      <section id="explore" className="mx-auto px-5 sm:px-6" style={{ maxWidth: 1100, paddingBottom: 72, scrollMarginTop: 70 }}>
        <FadeUp>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(26px, 3.6vw, 40px)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
              Everything in one report.
            </h2>
            <p style={{ fontSize: 15.5, color: MUTED, marginTop: 10 }}>Tap a feature to see it.</p>
          </div>
          <ExplorePanel />
        </FadeUp>
      </section>

      {/* CTA */}
      <section className="mx-auto px-5 sm:px-6" style={{ maxWidth: 1100, paddingBottom: 64 }}>
        <FadeUp>
          <div className="ts-cta-card" style={{ borderRadius: 26, background: INK, textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{
              position: "absolute", top: "0", left: "50%", transform: "translate(-50%,-40%)",
              width: 640, height: 320, borderRadius: "50%", pointerEvents: "none",
              background: "radial-gradient(ellipse, rgba(242,92,84,0.22) 0%, transparent 70%)",
            }} />
            <h2 className="relative" style={{ fontFamily: SERIF, fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.12, color: "#fff", marginBottom: 12 }}>
              Find out where you stand.
            </h2>
            <p className="relative" style={{ fontSize: 15.5, color: "rgba(255,255,255,0.55)", marginBottom: 26 }}>Free. Takes about a minute.</p>
            <div className="relative" style={{ display: "inline-flex" }}><PrimaryButton large>Analyze my CV</PrimaryButton></div>
          </div>
        </FadeUp>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: "24px 20px" }}>
        <div className="mx-auto flex flex-wrap items-center justify-between gap-3" style={{ maxWidth: 1100 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <LogoMark size={22} />
            <span style={{ fontSize: 13.5, fontWeight: 700 }}>TalentScan</span>
          </div>
          <p style={{ fontSize: 12.5, color: MUTED }}>© 2026 TalentScan · An assessment tool, not a hiring guarantee.</p>
        </div>
      </footer>
    </div>
  );
}
