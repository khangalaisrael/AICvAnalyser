"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ScoreRing } from "@/components/results/ScoreRing";
import { ScoreBar } from "@/components/results/ScoreBar";
import { SkillPill } from "@/components/results/SkillPill";
import { SkillCoverage } from "@/components/results/SkillCoverage";
import { CVHealthPanel } from "@/components/results/CVHealthPanel";
import { SAMPLE } from "@/lib/sample";

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
        background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16,
        padding: "18px 18px 8px", width: 250,
        boxShadow: "0 6px 32px rgba(34,39,47,0.10)",
      }}
    >
      <SampleTag />
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
        <ScoreRing score={SAMPLE.score} size={72} strokeWidth={13} numSize={22} />
        <div>
          <p style={{ fontSize: 10.5, fontWeight: 700, color: "#a7a99f", margin: "0 0 2px", letterSpacing: "0.05em", textTransform: "uppercase" }}>{SAMPLE.role}</p>
          <p style={{ fontFamily: "var(--font-serif), 'Source Serif 4', serif", fontSize: 15, fontWeight: 600, margin: 0 }}>Strong match</p>
        </div>
      </div>
      {SAMPLE.components.slice(0, 2).map((c) => <ScoreBar key={c.label} label={c.label} value={c.value} />)}
    </motion.div>
  );
}

/* ── feature section mock UIs: the real report components fed with sample data ── */

function SampleTag() {
  return (
    <span style={{
      display: "inline-block", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
      color: MUTED, background: "#f3f2ec", borderRadius: 99, padding: "3px 9px", marginBottom: 14,
    }}>
      Sample report
    </span>
  );
}

function MockCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: CARD, border: `1px solid ${BORDER}`, borderRadius: 18,
      padding: "22px 24px", boxShadow: "0 4px 24px rgba(34,39,47,0.07)",
      maxWidth: 440, width: "100%",
    }}>
      <SampleTag />
      {children}
    </div>
  );
}

const TIER_LABEL: Record<string, string> = { must: "Must-have", nice: "Nice to have", edge: "Differentiator" };

function ScoreFeatureMock() {
  return (
    <MockCard>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20, flexWrap: "wrap" }}>
        <ScoreRing score={SAMPLE.score} size={104} strokeWidth={12} numSize={32} />
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#a7a99f", margin: "0 0 3px", letterSpacing: "0.05em", textTransform: "uppercase" }}>{SAMPLE.role}</p>
          <p style={{ fontFamily: "var(--font-serif), 'Source Serif 4', serif", fontSize: 18, fontWeight: 600, margin: 0 }}>Strong match</p>
        </div>
      </div>
      {SAMPLE.components.map((c) => <ScoreBar key={c.label} label={c.label} value={c.value} />)}
    </MockCard>
  );
}

function AtsFeatureMock() {
  return (
    <div style={{ maxWidth: 460, width: "100%" }}>
      <SampleTag />
      <CVHealthPanel checklist={SAMPLE.checklist} />
    </div>
  );
}

function GapsFeatureMock() {
  return (
    <MockCard>
      <SkillCoverage matched={SAMPLE.matched.length} inferred={SAMPLE.inferred.length} missing={Object.values(SAMPLE.gaps).flat().length} />
      {(Object.keys(SAMPLE.gaps) as (keyof typeof SAMPLE.gaps)[]).map((tier) => (
        <div key={tier} style={{ marginBottom: 10 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "#a7a99f", margin: "0 0 4px" }}>
            {TIER_LABEL[tier]}
          </p>
          {SAMPLE.gaps[tier].map((g) => <SkillPill key={g} text={g} matched={false} />)}
        </div>
      ))}
    </MockCard>
  );
}

function InferredSkillsMock() {
  return (
    <MockCard>
      <p style={{ fontSize: 13, fontWeight: 700, margin: "0 0 8px" }}>Matched</p>
      <div style={{ marginBottom: 16 }}>
        {SAMPLE.matched.map((m) => <SkillPill key={m} text={m} matched />)}
      </div>
      <p style={{ fontSize: 11.5, fontWeight: 700, color: "#a7a99f", letterSpacing: "0.05em", textTransform: "uppercase", margin: "0 0 8px" }}>Inferred</p>
      <div>
        {SAMPLE.inferred.map((s) => (
          <span key={s} style={{
            display: "inline-block", fontSize: 13, fontWeight: 500, padding: "5px 11px", borderRadius: 999, margin: "3px 3px 0 0",
            background: "rgba(95,139,46,0.07)", color: "#5f8b2e", border: "1px dashed rgba(95,139,46,0.30)",
          }}>{s}</span>
        ))}
      </div>
      <p style={{ fontSize: 12, color: MUTED, fontStyle: "italic", lineHeight: 1.55, margin: "14px 0 0" }}>
        Described in your experience, but never listed as a skill.
      </p>
    </MockCard>
  );
}

function TrendingFeatureMock() {
  return (
    <MockCard>
      <p style={{ fontSize: 13, fontWeight: 700, margin: "0 0 4px" }}>Trending for this role</p>
      <p style={{ fontSize: 11.5, color: MUTED, margin: "0 0 14px" }}>{SAMPLE.role} · AI-researched profile</p>
      {SAMPLE.trending.map((line) => (
        <div key={line} style={{ display: "flex", gap: 10, marginBottom: 9, alignItems: "flex-start" }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#c5811c", marginTop: 7, flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: "#52575f", lineHeight: 1.6 }}>{line}</span>
        </div>
      ))}
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
        className="mx-auto px-6 ts-feature-grid"
        style={{ maxWidth: 1100, alignItems: "center" }}
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
      <div className="lp-hero-bg">
      <section className="mx-auto px-6 lp-hero" style={{ maxWidth: 1100 }}>
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
              Enter a role, upload your CV. TalentScan scores it against an AI-researched profile of the role, flags ATS problems, and surfaces the exact skill gaps standing between you and the job.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28, ease: "easeOut" }}
              className="lp-cta-row"
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

          {/* compact preview below lg */}
          <div className="flex justify-center lg:hidden">
            <ScoreResultCard />
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
      </div>

      {/* ── PROBLEM ────────────────────────────────────────────────── */}
      <section style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, background: CARD }}>
        <FadeUp>
          <div
            className="mx-auto px-6 text-center lp-pad"
            style={{ maxWidth: 740 }}
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
        <div className="mx-auto px-6 lp-pad-lg" style={{ maxWidth: 1100 }}>
          <FadeUp>
            <div className="lp-head" style={{ marginBottom: 64 }}>
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
                body: "Not a generic analysis. We research that specific title and build a profile of the skills, experience and tools employers expect — then score your CV against it. Paste a job description instead and we score against that.",
              },
              {
                n: "02",
                title: "See where you're competitive",
                body: "Match score, ATS flags, skill gaps, trending requirements. Every finding is specific and grounded in real data — not AI assumptions about what a CV 'should' look like.",
              },
              {
                n: "03",
                title: "Get your full breakdown",
                body: "Match score, ATS flags, skill gaps, inferred skills, and role trends — all in one report. Know exactly what to fix before you apply.",
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
          body="A bare number is noise. We show exactly which requirements you matched, which you're missing, and how much each one matters — so you know what's worth fixing."
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
          eyebrow="Skill gaps"
          headline="Gaps ranked by how much they matter."
          body="Every missing skill is tagged as a must-have, nice-to-have or differentiator for the role you entered, so you fix what moves your score first."
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
          headline="What's trending for your role."
          body="We tell you which skills are trending for your target role, so you know what's worth adding before you apply."
          mock={<TrendingFeatureMock />}
        />
      </div>

      {/* ── HONESTY STRIP ──────────────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, background: CARD }}>
        <FadeUp>
          <div className="mx-auto px-6 text-center lp-pad-sm" style={{ maxWidth: 700 }}>
            <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.7 }}>
              TalentScan is an assessment and improvement tool — not a hiring guarantee.
              We show you where you're competitive and where you're not. What you do with that is yours.
            </p>
          </div>
        </FadeUp>
      </div>

      {/* ── FINAL CTA ──────────────────────────────────────────────── */}
      <section className="mx-auto px-6 lp-pad" style={{ maxWidth: 1100 }}>
        <FadeUp>
          <div
            className="ts-cta-card"
            style={{
              borderRadius: 24, background: INK,
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
          className="mx-auto flex flex-wrap items-center justify-between gap-4 lp-footer"
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
