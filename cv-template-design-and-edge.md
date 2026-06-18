# CV Template Design & Competitive Edge — Brief

> **For: Claude Code.** Companion to `cv-rewrite-spec.md`. That file covers the rewrite _engine_
> (reframe-never-fabricate, verification, PDF generation, two-track architecture). **This** file
> covers two things: (1) how to design CV templates that recruiters actually respond to, enhancing
> the user's existing CV without flattening its creativity, and (2) the differentiating features
> that make this tool beat the popular rewrite apps. Read both files, then propose a plan and wait
> for "go." Before designing, **do your own current research** too ("recruiter resume eye-tracking",
> "6-second resume scan 2026", "AI resume builder generic output complaints") — the findings below
> are the foundation, not the ceiling.

---

## 1. How recruiters actually read a CV (the research that drives everything)

The first pass is **not a read — it's a 6–7 second visual pattern-match**, because recruiters triage
high volumes. Design every template around how that scan actually works:

- **Six fixation points get ~80% of attention:** name → current title → current company → current
  dates → previous title/company → education. If these aren't instantly findable, the rest never
  gets read.
- **Top-third dominance:** ~80% of the hiring judgment forms from the top third of page one. The
  bottom 30% and page two are barely seen on the first pass. Put the strongest material up top.
- **F-pattern scan:** eyes go horizontally across the top, then vertically down the **left margin**.
  On that vertical run, only **section headers and the first 2–3 words of each line** are seen — so
  the start of every bullet must carry the punch.
- **First bullet wins:** the first bullet under the most recent role gets more attention than the
  entire bottom half of the CV. It must be the strongest, most quantified achievement — never a
  generic duty.
- **Dense paragraphs are skipped entirely.** Bullets only, 1–2 lines each.
- **Generic summaries/objectives are ignored after ~2 seconds.** Use a specific, quantified one-line
  headline, or omit it — never fill the space with fluff.
- **White space increases engagement; cramming reduces it.** Under ~20% white space reads as
  cramped and shortens dwell time. Use line spacing ~1.15–1.3, real space between sections, and
  0.5–0.75" margins. Do **not** cram content to fill the page.
- **Numbers stop the scan.** Quantified results ("cut load time 40%") get read; vague claims slide
  past unseen.
- **One subtle accent colour boosts recall** by roughly 13 points — used on name/headings only (see
  the colour rule in the rewrite spec: never on body text; navy, not red).
- **Market-standard job titles matter** — recruiters search databases by title and ATS weight
  titles. Translate internal titles to the market term (keep the internal one in parentheses), but
  **never inflate seniority** ("Coordinator" cannot become "Director").

---

## 2. The winning template anatomy (structure these in detail)

A single, ATS-safe, recruiter-optimized skeleton underlies every template. Section order and the top
third are doing the heavy lifting:

```
┌─────────────────────────────────────────────────────────┐
│  NAME            (largest, top-left, navy accent)         │  ← fixation 1
│  Target job title / one-line specialism                   │  ← orient
│  email · phone · city · LinkedIn/portfolio (one line,     │
│        plain text in the BODY, never header/footer)       │
├─────────────────────────────────────────────────────────┤
│  HEADLINE (optional): one specific, quantified line.       │  ← skip if generic
│  e.g. "Backend engineer — built payments pipeline         │
│        handling 12M txns/mo at 99.99% uptime."            │
├─────────────────────────────────────────────────────────┤
│  WORK EXPERIENCE   (standard heading, bold, slightly       │
│   larger)                                                  │
│   Job Title (market-standard) — Company, dates  ← left     │  ← fixations 2–5
│     • [first bullet = strongest quantified win]            │  ← most-read line
│     • result-first bullets, 1–2 lines, action verb start   │
├─────────────────────────────────────────────────────────┤
│  SKILLS  (grouped by category, real text)                  │  ← skills-first 2026
│   Languages: …  Tools: …  (degrade chips→text in ATS track)│
├─────────────────────────────────────────────────────────┤
│  EDUCATION   (standard heading)                            │  ← fixation 6
├─────────────────────────────────────────────────────────┤
│  PROJECTS / CERTIFICATIONS (optional, after experience)    │
└─────────────────────────────────────────────────────────┘
```

Rules baked into the skeleton: single column; reverse-chronological; standard headings; contact in
the body (never header/footer); strongest content top-third; first bullet = best achievement; bullet
first words carry impact; generous white space; one navy accent on name + headings only.

---

## 3. The three templates (described, so design intent is unambiguous)

All three share the skeleton above and are all ATS-safe. They differ in _personality within the safe
zone_ — this is how you give range without breaking parsing.

- **Classic** — maximally conservative. Serif or restrained sans (Georgia / Calibri), black text,
  thin horizontal rules between sections, navy only on the name. For finance, law, government,
  academia, and senior corporate roles. The "this person is a safe, serious hire" look.
- **Modern** — clean contemporary sans (Helvetica/Arial/Inter family), a touch more air, a navy
  accent on the name and section headings, subtle small-caps or letter-spacing on headers. For tech,
  startups, product, marketing. Polished but never decorative.
- **Compact** — built for students / grads / career-changers with less content. Slightly larger
  type, generous spacing, a tighter section set so one page looks _intentional and full_, not thin.
  Solves the "empty page" problem that makes early-career CVs look weak.

Each template exposes the same safe knobs (rewrite spec §7.3): accent colour (one variable), a font
pairing from 2–3 safe combos, and density. **Defaults must be genuinely good** — most users won't
touch them — and a **live preview** updates as template / colour / font / density / track change.

---

## 4. Enhance, don't compromise — preserve the user's creativity

The user's complaint about generic tools flattening good CVs is the thing to engineer _against_. The
rewrite must **amplify what's already there, not overwrite it**:

1. **Lock-and-enhance.** Let the user **lock** any bullet, section, or their whole skills layout so
   the rewrite leaves it untouched and only improves what they allow. The best competitor tools let
   users steer/lock the AI; most don't — this directly serves "enhance, not replace."
2. **Preserve structure.** Keep the user's skill **groupings**, custom sections, and project layout
   from the source CV. Reorganize only when it demonstrably helps the scan (e.g., moving the
   strongest role's best bullet to first), and surface that as a suggestion, not a silent change.
3. **Carry the personality into the Design track.** The visual flair the user likes (skill chips,
   accent colour, spacing) lives in the Design track; the ATS track is the safe-submission twin.
   They keep their creativity _and_ get a parser-proof version.
4. **Translate, don't sanitize.** Reframe into market vocabulary and tighten wording, but keep the
   user's voice and specifics. Enhancement = front-loading impact, quantifying, fixing hierarchy and
   white space — not homogenizing every CV into the same beige paragraph.

---

## 5. What the popular apps lack (the gap = your edge)

Documented, recurring weaknesses across Rezi, Teal, Zety, Kickresume, Enhancv, etc.:

1. **Generic, boilerplate output.** The #1 complaint everywhere: AI bullets read like job-description
   _duties_, and summaries feel vague and don't "sell" the candidate.
2. **It undersells / strips real wins.** Tested tools, asked to "improve" an existing bullet, have
   **removed key details and outcomes** — actively making strong CVs weaker. This is the single
   biggest opening.
3. **ATS-only myopia.** They optimize for keyword matching and ignore the 6-second _human_ scan
   (top-third, F-pattern, first-bullet, white space). A CV can pass ATS and still die in the
   recruiter's hands.
4. **Surface-level, hit-or-miss scores** that reward cosmetic edits over meaningful ones.
5. **Cramped spacing**, with white-space control sometimes paywalled, and **two-column "free"
   templates that hurt ATS** — exactly the failure modes your two-track design avoids.
6. **No steering/locking** of what the AI touches, so users can't protect the parts they like.
7. **Download bait-and-switch** — build free, then pay to export a formatted file.

---

## 6. The edge features (build these to win)

Pick the headline differentiators from this list — each maps directly to a competitor gap above:

### 6.1 The "nothing lost, only amplified" guarantee _(beats gap #2 — the biggest one)_

Extend the rewrite spec's provenance/verification system so it doesn't just block _fabrication_ — it
also **prevents loss**. Before finalizing, diff the rewrite against the source ledger and assert that
**every metric, outcome, and concrete achievement in the original still appears** (reworded is fine,
removed is not). If the rewrite would drop a quantified win, flag it and keep it. Then show the user
a transparent **"what we preserved / what we enhanced / why"** diff. No mainstream tool can honestly
promise this, and it's the exact failure users hate.

### 6.2 Recruiter 6-second-scan simulator _(beats gap #3 — and it's a killer demo)_

A **visual heatmap / preview** that shows what a recruiter actually sees in the first 6 seconds:
overlay the F-pattern, highlight the six fixation points, and grade the top third. Flag concrete
problems — "your strongest metric is in bullet 4 of job 2; it won't be seen," "your most recent
title doesn't match the target role's market term," "this paragraph will be skipped." This optimizes
for the **human** scan, which the ATS-obsessed competitors ignore, and it's genuinely impressive to
show in an interview or demo.

### 6.3 Dual score: ATS readiness + recruiter-scan readiness _(beats gap #4)_

Two explainable scores side by side, each with the specific reasons behind it — machine-parseability
(reusing the existing ATS checker) **and** human-scan strength (top-third impact, first-bullet
quality, quantification density, title match). A score tied to real, meaningful fixes, not vanity
keyword counting.

### 6.4 Lock-and-enhance _(beats gaps #1 and #6)_

As in §4.1 — the user protects what they love; the AI enhances the rest. This both preserves
creativity and prevents the generic-overwrite problem in one move.

### 6.5 Honest, quantification-first rewriting _(beats gap #1)_

Bake the recruiter research into the rewrite prompt: every bullet must lead with impact and, where a
real number exists, surface it; reframe internal titles to market-standard (internal in parens, never
inflated); offer an optional one-line company-context line for lesser-known employers. The result
reads like _achievements_, not duties — the exact thing competitors get wrong.

### 6.6 Free formatted PDF export _(beats gap #7 — positioning, not design)_

Don't paywall the download. Let users export a real, formatted, ATS-safe PDF for free. The
bait-and-switch is the category's most hated pattern; not doing it is an instant trust win.

---

## 7. How it fits together (build notes)

- The rewrite engine (`cv-rewrite-spec.md`) produces the structured content model. The **loss-check
  (6.1)** is an extension of the verification pass already specified there.
- Templates (§2–§3 here) render that model; the **scan simulator (6.2)** and **dual score (6.3)**
  read the rendered output. The simulator can be a lightweight overlay computed from the structured
  layout (where each fixation element sits, what's in the top third) — no heavy ML needed; keep it
  transparent and rule-based, consistent with the rest of the app.
- **Lock state (6.4)** lives in the content model: locked bullets/sections are passed through
  verbatim and excluded from rewriting.
- Prioritize **6.1, 6.2, 6.4** — they hit the biggest gaps and double as standout portfolio/demo
  features. 6.3, 6.5, 6.6 are strong supporting wins.

---

## 8. Definition of done

1. Three ATS-safe templates (Classic, Modern, Compact) share one recruiter-optimized skeleton:
   single column, six fixation points instantly findable, strongest content in the top third, first
   bullet = best quantified win, generous white space, navy accent on name/headings only.
2. Templates are grounded in current recruiter eye-tracking / scan research, not invented.
3. The user can **lock** bullets/sections; the rewrite enhances only what's unlocked and preserves
   skill grouping and the user's voice.
4. The rewrite **provably preserves every real achievement/metric** from the source (loss-check) and
   shows a preserved/enhanced diff.
5. A **6-second recruiter-scan preview/heatmap** flags top-third weaknesses, buried metrics, and
   title mismatches.
6. **Two explainable scores** ship: ATS readiness + recruiter-scan readiness, each with reasons.
7. Bullets read as quantified achievements, not duties; titles are market-standard but never
   inflated.
8. A formatted, ATS-safe PDF exports **without a paywall**.
