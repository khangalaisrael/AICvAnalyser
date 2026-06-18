"use client";

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

/* ── inline SVG helpers ─────────────────────────────────────── */
function CheckIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8l3.5 3.5L13 4.5" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ArrowIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size, borderRadius: size * 0.25, background: "#f25c54" }}
      className="flex items-center justify-center flex-shrink-0"
    >
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M3.5 8.5L6.5 11.5L12.5 5" stroke="white" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ── scroll-triggered fade-up ──────────────────────────────── */
function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── hero mock: CV result card ─────────────────────────────── */
function ResultCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative z-10"
      style={{
        background: "#ffffff",
        border: "1px solid #ecebe3",
        borderRadius: 20,
        padding: "26px",
        boxShadow: "0 8px 48px rgba(34,39,47,0.11), 0 2px 8px rgba(34,39,47,0.05)",
        maxWidth: 368,
        width: "100%",
        fontFamily: "var(--font-sans), sans-serif",
      }}
    >
      {/* header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "#f0efe7", border: "1px solid #ecebe3" }} className="flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M5 4h7l4 4v8H5V4z" stroke="#7c818b" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M12 4v4h4" stroke="#7c818b" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M8 11h5M8 14h3" stroke="#7c818b" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#22272f" }}>Sarah Mitchell</div>
            <div style={{ fontSize: 11, color: "#7c818b" }}>Senior Product Designer · 7 yrs</div>
          </div>
        </div>
        <span style={{
          fontSize: 10, fontWeight: 800, letterSpacing: "0.07em", textTransform: "uppercase",
          background: "rgba(95,139,46,0.12)", color: "var(--color-hire-text)", borderRadius: 99, padding: "4px 10px",
        }}>
          HIRE
        </span>
      </div>

      {/* score bar */}
      <div className="mb-5">
        <div className="flex justify-between mb-[5px]">
          <span style={{ fontSize: 11, color: "#7c818b" }}>Match score</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#22272f" }}>87 / 100</span>
        </div>
        <div style={{ height: 5, background: "#ecebe3", borderRadius: 99 }}>
          <div style={{ height: 5, width: "87%", background: "linear-gradient(90deg,var(--color-hire),var(--color-hire-light))", borderRadius: 99 }} />
        </div>
      </div>

      {/* strengths */}
      <div className="flex flex-col gap-[7px] mb-5">
        {[
          "Strong UX portfolio with proven user research",
          "7 yrs experience matches senior requirement",
          "Led design systems for 2 enterprise clients",
        ].map((txt, i) => (
          <div key={i} className="flex gap-2 items-start">
            <div style={{ width: 16, height: 16, borderRadius: 4, background: "rgba(95,139,46,0.12)", flexShrink: 0, marginTop: 1 }} className="flex items-center justify-center">
              <CheckIcon size={9} color="var(--color-hire-text)" />
            </div>
            <span style={{ fontSize: 11.5, color: "#22272f", lineHeight: 1.5 }}>{txt}</span>
          </div>
        ))}
      </div>

      {/* skill tags */}
      <div className="flex flex-wrap gap-[6px]">
        {["Figma", "Design Systems", "User Research", "Prototyping"].map((tag) => (
          <span key={tag} style={{ fontSize: 10.5, fontWeight: 500, color: "#7c818b", background: "#f5f4ef", border: "1px solid #ecebe3", borderRadius: 99, padding: "3px 9px" }}>
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ── pipeline mini-card ────────────────────────────────────── */
function PipelineCard() {
  const rows = [
    { name: "James K.", badge: "HIRE",   bg: "rgba(95,139,46,0.10)",   color: "var(--color-hire-text)" },
    { name: "Priya M.", badge: "MAYBE",  bg: "rgba(197,129,28,0.10)",  color: "var(--color-maybe-text)" },
    { name: "Tom W.",   badge: "REJECT", bg: "rgba(232,74,69,0.10)",   color: "var(--color-reject-text)" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, x: 16, y: 12 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        position: "absolute", bottom: -18, right: -14, zIndex: 0,
        background: "#ffffff", border: "1px solid #ecebe3", borderRadius: 14,
        padding: "14px 16px", width: 210,
        boxShadow: "0 4px 24px rgba(34,39,47,0.07)",
        fontFamily: "var(--font-sans), sans-serif",
      }}
    >
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "#7c818b", marginBottom: 10 }}>
        Pipeline · 12 CVs
      </div>
      {rows.map((r) => (
        <div key={r.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #f0efe7" }}>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: "#22272f" }}>{r.name}</span>
          <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", background: r.bg, color: r.color, borderRadius: 99, padding: "2px 8px" }}>
            {r.badge}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

/* ── feature data ──────────────────────────────────────────── */
const FEATURES = [
  {
    title: "PDF Upload & Parsing",
    desc: "Drop in any CV. TalentScan extracts structured data from PDFs instantly — no templates, no setup.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M5 3h8l4 4v10H5V3z" stroke="#f25c54" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M13 3v4h4" stroke="#f25c54" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 10h5M8 13h3" stroke="#f25c54" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Two Analysis Modes",
    desc: "Aspiring for graduates. Applying for active candidates. One toggle switches the scoring lens.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="7" stroke="#f25c54" strokeWidth="1.5" />
        <path d="M6 10h8M10 6l4 4-4 4" stroke="#f25c54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "HIRE / MAYBE / REJECT",
    desc: "Every CV gets a decisive recommendation backed by match scores, strengths, and red flags.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M3 10h3l2 5 4-10 2 5h3" stroke="#f25c54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Candidate Pipeline",
    desc: "All screened CVs in one organised view. Filter, sort, and shortlist without juggling spreadsheets.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="14" height="14" rx="3" stroke="#f25c54" strokeWidth="1.5" />
        <path d="M7 8h7M7 12h5" stroke="#f25c54" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Coaching Feedback",
    desc: "Detailed written feedback for every candidate — ready to share or brief your hiring team.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M4 4h12v9H4z" stroke="#f25c54" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M7 16l3-3 3 3" stroke="#f25c54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 8h6M7 11h4" stroke="#f25c54" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Free to Start",
    desc: "Create an account and screen CVs immediately. No credit card, no onboarding call, no gatekeeping.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 3l2 5h5l-4 3 1.5 5L10 13l-4.5 3L7 11 3 8h5L10 3z" stroke="#f25c54" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const STEPS = [
  {
    n: "01",
    title: "Upload a CV",
    body: "Drag-and-drop or browse. TalentScan handles any PDF format — no manual extraction, no reformatting.",
  },
  {
    n: "02",
    title: "Pick your mode",
    body: "Aspiring for graduates and career changers. Applying for active job-seekers. One toggle, right lens every time.",
  },
  {
    n: "03",
    title: "Get your verdict",
    body: "HIRE, MAYBE, or REJECT — with a full score breakdown, key strengths, and coaching notes. Done.",
  },
];

/* ─────────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-[100dvh]" style={{ background: "#faf9f5", color: "#22272f", fontFamily: "var(--font-sans), sans-serif" }}>

      {/* ── NAV ────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50"
        style={{
          borderBottom: "1px solid #ecebe3",
          background: "rgba(250,249,245,0.88)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
        }}
      >
        <div className="flex items-center justify-between mx-auto px-6" style={{ maxWidth: 1160, height: 62 }}>
          <div className="flex items-center gap-[10px]">
            <LogoMark size={30} />
            <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em" }}>TalentScan</span>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <a href="#features" style={{ fontSize: 13.5, color: "#7c818b", textDecoration: "none" }}
               className="hover:text-[#22272f] transition-colors">Features</a>
            <a href="#how-it-works" style={{ fontSize: 13.5, color: "#7c818b", textDecoration: "none" }}
               className="hover:text-[#22272f] transition-colors">How it works</a>
            <Link href="/auth"
              className="transition-all hover:opacity-90 active:scale-[0.98]"
              style={{
                fontSize: 13.5, fontWeight: 600, color: "white",
                background: "#22272f", borderRadius: 10, padding: "8px 18px",
                textDecoration: "none",
              }}>
              Get started →
            </Link>
          </div>
          {/* mobile CTA */}
          <Link href="/auth"
            className="sm:hidden transition-opacity hover:opacity-90"
            style={{ fontSize: 13, fontWeight: 600, color: "#f25c54", textDecoration: "none" }}>
            Sign up
          </Link>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="mx-auto px-6 pt-[72px] pb-[88px]" style={{ maxWidth: 1160 }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <span className="inline-flex items-center gap-2 mb-6"
                style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                  color: "#f25c54", background: "rgba(242,92,84,0.09)", border: "1px solid rgba(242,92,84,0.2)",
                  borderRadius: 99, padding: "5px 12px",
                }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#f25c54" }} />
                AI-Powered CV Screening
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.07, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                fontSize: "clamp(38px, 5.5vw, 62px)",
                fontWeight: 700, lineHeight: 1.07,
                letterSpacing: "-0.03em", color: "#22272f",
                marginBottom: 22,
              }}
            >
              Screen CVs in{" "}
              <em style={{
                fontStyle: "italic",
                fontFamily: "var(--font-serif), 'Source Serif 4', serif",
                fontWeight: 600, color: "#f25c54",
              }}>
                seconds,
              </em>
              {" "}not hours.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16, ease: "easeOut" }}
              style={{ fontSize: 17, color: "#7c818b", lineHeight: 1.72, maxWidth: 460, marginBottom: 34 }}
            >
              TalentScan analyses every CV against your requirements and returns a clear{" "}
              <strong style={{ color: "var(--color-hire-text)" }}>HIRE</strong>,{" "}
              <strong style={{ color: "var(--color-maybe-text)" }}>MAYBE</strong>, or{" "}
              <strong style={{ color: "var(--color-reject-text)" }}>REJECT</strong>{" "}
              — with the reasoning to back it up.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.26, ease: "easeOut" }}
              className="flex flex-wrap gap-3"
            >
              <Link href="/auth"
                className="inline-flex items-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
                style={{
                  fontSize: 14.5, fontWeight: 700, color: "white",
                  background: "#f25c54", borderRadius: 11, padding: "13px 26px",
                  textDecoration: "none",
                  boxShadow: "0 4px 20px rgba(242,92,84,0.32)",
                }}>
                Start for free <ArrowIcon size={14} />
              </Link>
              <a href="#how-it-works"
                className="inline-flex items-center gap-2 transition-all hover:bg-[#f0efe7] active:scale-[0.98]"
                style={{
                  fontSize: 14.5, fontWeight: 500, color: "#22272f",
                  background: "transparent", border: "1px solid #ecebe3",
                  borderRadius: 11, padding: "13px 22px", textDecoration: "none",
                }}>
                See how it works
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.48 }}
              className="flex flex-wrap gap-5 mt-7"
            >
              {["No credit card", "Instant results", "Any CV format"].map((txt) => (
                <div key={txt} className="flex items-center gap-[6px]">
                  <CheckIcon size={13} color="var(--color-hire-text)" />
                  <span style={{ fontSize: 13, color: "#7c818b" }}>{txt}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* right: floating mockup */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative" style={{ width: "100%", maxWidth: 400 }}>
              <ResultCard />
              <PipelineCard />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAND ─────────────────────────────────────── */}
      <section style={{ borderTop: "1px solid #ecebe3", borderBottom: "1px solid #ecebe3", background: "#ffffff" }}>
        <div className="mx-auto px-6" style={{ maxWidth: 1160 }}>
          <FadeUp>
            <div className="grid grid-cols-1 sm:grid-cols-3">
              {[
                { value: "10×",   label: "faster than manual screening" },
                { value: "3",     label: "clear decisions per CV" },
                { value: "100%",  label: "AI reasoning, every candidate" },
              ].map((s, i) => (
                <div key={i}
                  className="py-10 text-center"
                  style={{ borderRight: i < 2 ? "1px solid #ecebe3" : "none" }}
                >
                  <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.04em", color: "#22272f", marginBottom: 5 }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 13.5, color: "#7c818b" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────── */}
      <section id="features" className="mx-auto px-6 pt-[72px] pb-[80px]" style={{ maxWidth: 1160 }}>
        <FadeUp>
          <div className="text-center mb-14">
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#f25c54", marginBottom: 14 }}>
              FEATURES
            </p>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.15, color: "#22272f" }}>
              Everything you need to hire smarter
            </h2>
          </div>
        </FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <FadeUp key={f.title} delay={i * 0.05}>
              <div
                className="h-full transition-all duration-200 hover:-translate-y-[2px]"
                style={{
                  padding: "26px", border: "1px solid #ecebe3", borderRadius: 16,
                  background: "#ffffff",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(34,39,47,0.08)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "none")}
              >
                <div className="flex items-center justify-center mb-5"
                  style={{ width: 42, height: 42, borderRadius: 11, background: "rgba(242,92,84,0.08)" }}>
                  {f.icon}
                </div>
                <div style={{ fontSize: 15.5, fontWeight: 700, color: "#22272f", marginBottom: 8, letterSpacing: "-0.01em" }}>
                  {f.title}
                </div>
                <div style={{ fontSize: 13.5, color: "#7c818b", lineHeight: 1.68 }}>{f.desc}</div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────── */}
      <section id="how-it-works" style={{ borderTop: "1px solid #ecebe3", borderBottom: "1px solid #ecebe3", background: "#ffffff" }}>
        <div className="mx-auto px-6 py-[80px]" style={{ maxWidth: 1160 }}>
          <FadeUp>
            <div className="text-center mb-16">
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#f25c54", marginBottom: 14 }}>
                HOW IT WORKS
              </p>
              <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.15, color: "#22272f" }}>
                CV to decision in three steps
              </h2>
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-12">
            {STEPS.map((step, i) => (
              <FadeUp key={step.n} delay={i * 0.1}>
                <div>
                  <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: "-0.04em", color: "#ecebe3", lineHeight: 1, marginBottom: 18 }}>
                    {step.n}
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#22272f", letterSpacing: "-0.01em", marginBottom: 10 }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: 14, color: "#7c818b", lineHeight: 1.72 }}>{step.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────── */}
      <section className="mx-auto px-6 py-[80px]" style={{ maxWidth: 1160 }}>
        <FadeUp>
          <div
            className="text-center relative overflow-hidden"
            style={{ borderRadius: 24, padding: "72px 40px", background: "#22272f" }}
          >
            {/* coral ambient glow */}
            <div style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
              width: 640, height: 320, borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(242,92,84,0.18) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            <p className="relative" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>
              GET STARTED
            </p>
            <h2 className="relative" style={{
              fontSize: "clamp(26px, 4vw, 46px)", fontWeight: 700, letterSpacing: "-0.03em",
              lineHeight: 1.1, color: "white", marginBottom: 18,
            }}>
              Your next great hire is in that pile.
              <br />
              <em style={{ fontStyle: "italic", fontFamily: "var(--font-serif), 'Source Serif 4', serif", fontWeight: 600, color: "#f25c54" }}>
                Find them faster.
              </em>
            </h2>
            <p className="relative mx-auto mb-9" style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", maxWidth: 440, lineHeight: 1.7 }}>
              Join recruiters already using TalentScan to cut screening time and make better, faster hiring decisions.
            </p>
            <Link href="/auth"
              className="relative inline-flex items-center gap-2 transition-all hover:opacity-95 active:scale-[0.98]"
              style={{
                fontSize: 14.5, fontWeight: 700, color: "#22272f",
                background: "white", borderRadius: 11, padding: "14px 30px",
                textDecoration: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.22)",
              }}>
              Create free account <ArrowIcon size={14} />
            </Link>
          </div>
        </FadeUp>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid #ecebe3", padding: "28px 24px" }}>
        <div className="mx-auto flex flex-wrap items-center justify-between gap-4" style={{ maxWidth: 1160 }}>
          <div className="flex items-center gap-[9px]">
            <LogoMark size={24} />
            <span style={{ fontSize: 13.5, fontWeight: 700, color: "#22272f" }}>TalentScan</span>
          </div>
          <p style={{ fontSize: 12.5, color: "#7c818b" }}>© 2026 TalentScan · AI-powered CV screening</p>
          <Link href="/auth" style={{ fontSize: 13, fontWeight: 600, color: "#f25c54", textDecoration: "none" }}
            className="hover:underline">
            Get started →
          </Link>
        </div>
      </footer>

    </div>
  );
}
