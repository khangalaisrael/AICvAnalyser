"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
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
      maxWidth: 380,
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

function RewriteFeatureMock() {
  return (
    <MockCard>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: MUTED, marginBottom: 8 }}>
          Before
        </div>
        <div style={{
          fontSize: 12.5, color: "#999", lineHeight: 1.6,
          textDecoration: "line-through", background: "#f5f4ef",
          borderRadius: 6, padding: "8px 10px",
        }}>
          Managed a team of engineers and delivered the project on time.
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
        <div style={{ flex: 1, height: 1, background: BORDER }} />
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M7 2v10M3 9l4 4 4-4" stroke={MUTED} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ flex: 1, height: 1, background: BORDER }} />
      </div>
      <div>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#437a1a", marginBottom: 8 }}>
          After
        </div>
        <div style={{
          fontSize: 12.5, color: INK, lineHeight: 1.6,
          background: "rgba(67,122,26,0.06)", borderLeft: "2px solid #7db83a",
          borderRadius: "0 6px 6px 0", padding: "8px 10px",
        }}>
          Led 6-person engineering team to deliver payment API gateway — reduced checkout latency by 40% across 3 markets.
        </div>
        <div style={{ fontSize: 10.5, color: MUTED, marginTop: 8, fontStyle: "italic" }}>
          Every change traces to your original. Nothing invented.
        </div>
      </div>
    </MockCard>
  );
}

/* ── feature section layout ─────────────────────────────────────────────── */

function FeatureSection({
  eyebrow, headline, body, mock, flip = false,
}: {
  eyebrow: string;
  headline: string;
  body: string;
  mock: React.ReactNode;
  flip?: boolean;
}) {
  return (
    <div style={{ borderTop: `1px solid ${BORDER}` }}>
      <div
        className="mx-auto px-6"
        style={{
          maxWidth: 1100,
          paddingTop: 96,
          paddingBottom: 96,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 72,
          alignItems: "center",
        }}
      >
        {/* text first or second depending on flip */}
        {flip ? (
          <>
            <FadeUp delay={0.1}>
              <div style={{ display: "flex", justifyContent: "center" }}>{mock}</div>
            </FadeUp>
            <FadeUp delay={0.0}>
              <TextBlock eyebrow={eyebrow} headline={headline} body={body} />
            </FadeUp>
          </>
        ) : (
          <>
            <FadeUp delay={0.0}>
              <TextBlock eyebrow={eyebrow} headline={headline} body={body} />
            </FadeUp>
            <FadeUp delay={0.1}>
              <div style={{ display: "flex", justifyContent: "center" }}>{mock}</div>
            </FadeUp>
          </>
        )}
      </div>
    </div>
  );
}

function TextBlock({ eyebrow, headline, body }: { eyebrow: string; headline: string; body: string }) {
  return (
    <div>
      <p style={{
        fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
        textTransform: "uppercase", color: MUTED, marginBottom: 18,
      }}>
        {eyebrow}
      </p>
      <h2 style={{
        fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 700,
        letterSpacing: "-0.025em", lineHeight: 1.15,
        color: INK, marginBottom: 18,
      }}>
        {headline}
      </h2>
      <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.75, maxWidth: 440 }}>
        {body}
      </p>
    </div>
  );
}

/* ── main page ──────────────────────────────────────────────────────────── */

export default function LandingPage() {

  return (
    <div className="min-h-[100dvh]" style={{ background: BG, color: INK, fontFamily: "var(--font-sans), sans-serif" }}>

      {/* ── NAV ────────────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50"
        style={{
          borderBottom: `1px solid ${BORDER}`,
          background: "rgba(250,249,245,0.90)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <div
          className="flex items-center justify-between mx-auto px-6"
          style={{ maxWidth: 1100, height: 64 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <LogoMark size={30} />
            <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em", color: INK }}>TalentScan</span>
          </div>

          <div className="hidden sm:flex items-center gap-7">
            <a href="#how-it-works" style={{ fontSize: 13.5, color: MUTED, textDecoration: "none" }}
              className="hover:text-[#22272f] transition-colors">
              How it works
            </a>
            <a href="#features" style={{ fontSize: 13.5, color: MUTED, textDecoration: "none" }}
              className="hover:text-[#22272f] transition-colors">
              Features
            </a>
            <Link href="/auth"
              className="inline-flex items-center gap-[6px] transition-all hover:opacity-90 active:scale-[0.98]"
              style={{
                fontSize: 13.5, fontWeight: 600, color: "white",
                background: CORAL, borderRadius: 10, padding: "8px 18px",
                textDecoration: "none", boxShadow: "0 2px 10px rgba(242,92,84,0.30)",
              }}>
              Analyze my CV <Arrow size={13} />
            </Link>
          </div>

          <Link href="/auth"
            className="sm:hidden"
            style={{ fontSize: 13.5, fontWeight: 600, color: CORAL, textDecoration: "none" }}>
            Get started
          </Link>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="mx-auto px-6" style={{ maxWidth: 1100, paddingTop: 88, paddingBottom: 104 }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-16 items-center">

          {/* left: headline + CTAs */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ marginBottom: 28 }}
            >
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                color: CORAL, background: "rgba(242,92,84,0.09)",
                border: "1px solid rgba(242,92,84,0.20)", borderRadius: 99, padding: "5px 12px",
              }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: CORAL }} />
                Free CV analysis
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontSize: "clamp(36px, 5.5vw, 60px)",
                fontWeight: 700, lineHeight: 1.08,
                letterSpacing: "-0.03em", color: INK,
                marginBottom: 22,
              }}
            >
              Know exactly where
              <br />
              your CV stands.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18, ease: "easeOut" }}
              style={{ fontSize: 17, color: MUTED, lineHeight: 1.75, maxWidth: 460, marginBottom: 36 }}
            >
              Enter a role, upload your CV. TalentScan scores it against live postings, flags ATS problems, surfaces the skill gaps — and rewrites it into a clean, downloadable PDF.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28, ease: "easeOut" }}
              style={{ display: "flex", flexWrap: "wrap", gap: 12 }}
            >
              <Link href="/auth"
                className="inline-flex items-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
                style={{
                  fontSize: 15, fontWeight: 700, color: "white",
                  background: CORAL, borderRadius: 11, padding: "13px 26px",
                  textDecoration: "none",
                  boxShadow: "0 4px 20px rgba(242,92,84,0.30)",
                }}>
                Analyze my CV <Arrow size={14} />
              </Link>
              <a href="#how-it-works"
                className="inline-flex items-center gap-2 transition-all hover:bg-[#f0efe7] active:scale-[0.98]"
                style={{
                  fontSize: 15, fontWeight: 500, color: INK,
                  background: "transparent", border: `1px solid ${BORDER}`,
                  borderRadius: 11, padding: "13px 22px", textDecoration: "none",
                }}>
                See how it works
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              style={{ display: "flex", gap: 18, marginTop: 22, flexWrap: "wrap" }}
            >
              {["Free to use", "Any PDF format", "No credit card"].map((txt) => (
                <div key={txt} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Check size={10} pass={true} />
                  <span style={{ fontSize: 13, color: MUTED }}>{txt}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* right: CV → score transformation */}
          <div className="hidden lg:flex items-center justify-center gap-4">
            <PlainCvCard />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.42 }}
              style={{ color: "#d4d3cb", flexShrink: 0 }}
            >
              <Arrow size={18} />
            </motion.div>
            <ScoreResultCard />
          </div>
        </div>
      </section>

      {/* ── PROBLEM ────────────────────────────────────────────────── */}
      <section style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, background: CARD }}>
        <FadeUp>
          <div
            className="mx-auto px-6 text-center"
            style={{ maxWidth: 740, paddingTop: 80, paddingBottom: 80 }}
          >
            <p style={{
              fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 600,
              color: INK, lineHeight: 1.4, letterSpacing: "-0.02em",
            }}>
              Most candidates submit their CV and hope.
              <span style={{ color: MUTED }}> You'll know exactly where you're competitive and where you're not — before you hit send.</span>
            </p>
          </div>
        </FadeUp>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────── */}
      <section id="how-it-works">
        <div className="mx-auto px-6" style={{ maxWidth: 1100, paddingTop: 96, paddingBottom: 96 }}>
          <FadeUp>
            <div style={{ marginBottom: 64 }}>
              <p style={{
                fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                textTransform: "uppercase", color: MUTED, marginBottom: 16,
              }}>
                How it works
              </p>
              <h2 style={{
                fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700,
                letterSpacing: "-0.025em", lineHeight: 1.12, color: INK, maxWidth: 540,
              }}>
                Three steps to a stronger application.
              </h2>
            </div>
          </FadeUp>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 48 }}>
            {[
              {
                n: "01",
                title: "Enter the role you want",
                body: "Not a generic analysis. We pull live job postings for that specific title and market — then score your CV against what employers are actually asking for right now.",
              },
              {
                n: "02",
                title: "See where you're competitive",
                body: "Match score, ATS flags, skill gaps, trending requirements. Every finding is specific and grounded in real data — not AI assumptions about what a CV 'should' look like.",
              },
              {
                n: "03",
                title: "Download a rewritten CV",
                body: "We reframe your real experience in the role's language and generate a clean, ATS-safe PDF. Nothing invented — every change traces back to your original CV.",
              },
            ].map((step, i) => (
              <FadeUp key={step.n} delay={i * 0.1}>
                <div>
                  <div style={{
                    fontSize: 52, fontWeight: 800, letterSpacing: "-0.05em",
                    color: BORDER, lineHeight: 1, marginBottom: 22,
                    fontFamily: MONO,
                  }}>
                    {step.n}
                  </div>
                  <h3 style={{
                    fontSize: 18, fontWeight: 700, color: INK,
                    letterSpacing: "-0.015em", marginBottom: 12,
                  }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: 14.5, color: MUTED, lineHeight: 1.75 }}>{step.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────── */}
      <div id="features">
        <FeatureSection
          eyebrow="Match score"
          headline="A score that tells you why."
          body="87/100 without context is noise. We show exactly which requirements you matched, which you're missing, and how many live postings cite each gap — so you know what's worth fixing."
          mock={<ScoreFeatureMock />}
        />
        <FeatureSection
          eyebrow="ATS check"
          headline="The problems ATS systems actually catch."
          body="Two-column layouts, contact info in headers, tables in skills sections — these are the real reasons CVs fail to parse. We flag the actual issues, not CV folklore."
          mock={<AtsFeatureMock />}
          flip
        />
        <FeatureSection
          eyebrow="Skill gaps · live data"
          headline="Gaps from live postings, not guesswork."
          body={`"9 of 10 current postings for this role mention SQL. Your CV doesn't mention it." That's actionable. Every gap is grounded in real listings for the specific role you entered.`}
          mock={<GapsFeatureMock />}
        />
        <FeatureSection
          eyebrow="Inferred skills"
          headline="Skills you have — even when you didn't say so."
          body="We read between the lines. If your CV describes managing a data pipeline but doesn't list SQL, we flag it as inferred — so you know what you can confidently claim and what to make explicit."
          mock={<InferredSkillsMock />}
          flip
        />
        <FeatureSection
          eyebrow="Market intelligence"
          headline="What the market is actually hiring for."
          body="Not generic advice — live signal from current postings. We tell you which skills are trending for your target role right now, so you know what's worth adding before you apply."
          mock={<TrendingFeatureMock />}
        />
        <FeatureSection
          eyebrow="CV rewrite"
          headline="Your experience, in the role's language."
          body="We rewrite every bullet to mirror the target role's vocabulary — using only what's already in your CV. Every change traces to your original. Nothing is invented, nothing is removed."
          mock={<RewriteFeatureMock />}
          flip
        />
      </div>

      {/* ── HONESTY STRIP ──────────────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, background: CARD }}>
        <FadeUp>
          <div className="mx-auto px-6 text-center" style={{ maxWidth: 700, paddingTop: 52, paddingBottom: 52 }}>
            <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.7 }}>
              TalentScan is an assessment and improvement tool — not a hiring guarantee.
              We show you where you're competitive and where you're not. What you do with that is yours.
            </p>
          </div>
        </FadeUp>
      </div>

      {/* ── FINAL CTA ──────────────────────────────────────────────── */}
      <section className="mx-auto px-6" style={{ maxWidth: 1100, paddingTop: 80, paddingBottom: 80 }}>
        <FadeUp>
          <div
            style={{
              borderRadius: 24, padding: "80px 48px", background: INK,
              textAlign: "center", position: "relative", overflow: "hidden",
            }}
          >
            {/* ambient glow */}
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%,-50%)",
              width: 600, height: 300, borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(242,92,84,0.14) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            <p className="relative" style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 20,
            }}>
              Free · No credit card
            </p>
            <h2 className="relative" style={{
              fontSize: "clamp(26px, 4vw, 48px)", fontWeight: 700,
              letterSpacing: "-0.03em", lineHeight: 1.1,
              color: "white", marginBottom: 16,
            }}>
              See where you actually stand.
            </h2>
            <p className="relative mx-auto" style={{
              fontSize: 16, color: "rgba(255,255,255,0.5)",
              maxWidth: 420, lineHeight: 1.75, marginBottom: 36,
            }}>
              Upload your CV and the role you want. The analysis takes seconds.
            </p>
            <Link href="/auth"
              className="relative inline-flex items-center gap-2 transition-all hover:opacity-95 active:scale-[0.98]"
              style={{
                fontSize: 15, fontWeight: 700, color: INK,
                background: "white", borderRadius: 11, padding: "14px 30px",
                textDecoration: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.24)",
              }}>
              Analyze my CV <Arrow size={14} />
            </Link>
          </div>
        </FadeUp>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: "28px 24px" }}>
        <div
          className="mx-auto flex flex-wrap items-center justify-between gap-4"
          style={{ maxWidth: 1100 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <LogoMark size={22} />
            <span style={{ fontSize: 13.5, fontWeight: 700, color: INK }}>TalentScan</span>
          </div>
          <p style={{ fontSize: 12.5, color: MUTED }}>
            © 2026 TalentScan · Assessment tool, not a hiring guarantee.
          </p>
          <Link href="/auth"
            style={{ fontSize: 13, fontWeight: 600, color: CORAL, textDecoration: "none" }}
            className="hover:underline">
            Analyze my CV →
          </Link>
        </div>
      </footer>

    </div>
  );
}
