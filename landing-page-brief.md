# TalentScan — Landing Page Improvement Brief

> **For: Claude Code.** This is a brief, not a script. It covers **two workstreams**:
> **(A)** improving the marketing **landing page** (§0–§7), and **(B)** building a **new CV-rewrite →
> PDF feature** (§8). The app is **already deployed and the backend works**. For workstream A, do
> not touch auth, API routes, the analysis pipeline, or anything behind the login, and keep every
> existing link to `/auth` working. For workstream B, you are adding a new feature — read §8 fully
> and propose a plan before writing code. Read the whole file, then propose short plans (§3 for the
> page, §8.9 for the feature) and wait for my "go" before building either.

---

## 0. AUDIENCE — LOCKED: job seekers

This is **decided**: the landing page is for **job seekers**, not recruiters. The whole page commits
to that. This matters because the **current live page is written for the wrong audience** and must be
rewritten:

- The **current live page** is written for **recruiters**: "Screen CVs in seconds," a
  candidate pipeline, HIRE / MAYBE / REJECT verdicts on other people's CVs. **Replace all of this.**
- The **correct framing** is the **job seeker**: they enter a role they want, the app scores *their
  own* CV against the live market for that role, flags ATS problems, shows skill gaps to close, and
  (new — see §8) rewrites their CV into a clean, ATS-safe, downloadable PDF.

Do not write copy that tries to serve both audiences — that is the fastest way to a vague,
forgettable page. Strip every recruiter-oriented word and rebuild the copy around the candidate.

Also confirm the feature list against the *actual* deployed app before writing feature copy —
do not invent features the product doesn't have. **Note:** CV rewrite (§8) does **not exist yet**;
only advertise it on the landing page once it's actually built.

---

## 1. What the product does (job-seeker framing)

TalentScan helps a job seeker understand and fix their CV for a specific role:

- **Role-targeted match score** — grounded in *live job postings*, not the AI's memory. The score
  is explainable (shows which real requirements matched and which didn't), not a black-box number.
- **ATS check** — flags concrete parsing problems (multi-column layouts, text-in-images, tables,
  odd headings) rather than folklore.
- **Skill-gap analysis** — "8 of 10 live postings want X and your CV doesn't mention it."
- **What's actually trending** — pulled from real current postings for the target role.
- **CV rewrite → downloadable PDF** *(NEW — to be built; see §8)* — reframes the user's *real*
  experience in the language of the target role (never invents experience), output as a clean,
  ATS-safe, real-text PDF.

**Copy honesty rule (important):** never claim the tool "gets you hired" or predict a hiring
outcome. Frame it as an *assessment and improvement tool*: "see where you're competitive and where
you're light." This honesty is a feature — say it plainly.

---

## 2. The design direction: Apple's discipline, not Apple's skin

Take **inspiration from Apple's product pages** — but borrow the *principles*, not the literal look.
A pixel-copy of apple.com would read as generic and templated. The goal is a page that feels as
considered as Apple's, expressed in *this product's* own world (CVs, scores, the rewrite).

What to borrow from Apple:

1. **The hero is a thesis, and it shows the product doing its one magic thing.** Apple leads with
   the product in motion, not a wall of text. Our equivalent: a **CV visibly transforming** — a
   plain CV on the left, and on scroll/load it resolves into a match score, highlighted gaps, and a
   cleaned-up rewritten version. That transformation is the single idea the whole page is built
   around. Make it the **signature moment** (see §3).
2. **Radical restraint and whitespace.** Lots of breathing room. One idea per screen. Generous
   vertical rhythm. Resist cramming.
3. **Confident, large typography.** Big, tight headlines; short, declarative sentences; sentence
   case. Type *is* the design, not a delivery vehicle.
4. **Choreographed scroll.** As the user scrolls, sections reveal and the "CV → score → rewrite"
   story advances. One orchestrated sequence beats scattered little animations everywhere.
5. **Product-led, not adjective-led.** Show the score breakdown, the ATS flags, the before/after
   rewrite. Demonstrate; don't just assert "powerful AI."
6. **Quiet, premium palette.** Mostly neutral (near-white or near-black canvas), one disciplined
   accent used sparingly for the score / key moments.

What to AVOID (these read as AI-generated defaults): three identical feature cards with tiny icons;
a cream-background-serif-terracotta theme; numbered 01/02/03 markers *unless* the step order
genuinely carries meaning (the "how it works" flow does, so numbering is fine *there* only); fake
logos / fake testimonials; generic stock photography.

---

## 3. Process — propose a plan before building

Before writing any code, produce a short **design plan** and show it to me:

- **Palette:** 4–6 named hex values (a neutral canvas, ink, two greys, one accent — pick an accent
  with intent and say why; e.g. a confident blue/green that reads "verified/trusted" rather than the
  default acid-green or terracotta).
- **Type:** a display face + body face + a **mono face for the data/score readouts** (mono on the
  numeric score and ATS flags is a small, tailored touch that makes the data feel real). Good
  defaults on a Vercel/Next stack: **Geist + Geist Mono** (loads via `next/font`), with **Inter** as
  a fallback. Pick deliberately and justify.
- **Layout & sections:** ASCII wireframe of the page top-to-bottom.
- **Signature moment:** describe the CV→score→rewrite transformation and exactly how it animates.

Recommended section order (job-seeker framing):

```
[ NAV ]  logo · How it works · Features · [ Analyze my CV → ]

[ HERO ]                         the THESIS / signature moment
  H1: short, declarative          ┌───────────┐      ┌──────────┐
  one-line subhead                │ plain CV  │ ───▶ │ 87 score │
  [ Analyze my CV ]  [ See how ]  │           │      │ gaps ▢▢  │
  microtrust: free · any PDF      └───────────┘      └──────────┘
                                  (animates on load/scroll)

[ PROBLEM ]   one calm line naming the pain (you're applying blind)

[ HOW IT WORKS ]   3 steps — numbering is OK here, it's a real sequence
  01 Enter the role you want
  02 We score your CV against live postings for it
  03 Get gaps to close + an ATS-safe rewrite to download

[ FEATURE: SCORE ]      show the explainable score breakdown
[ FEATURE: ATS ]        show real ATS flags being caught
[ FEATURE: GAPS+TREND ] grounded in live postings (say so)
[ FEATURE: REWRITE ]    before/after, "reframes real experience, never invents"

[ HONESTY STRIP ]   one line: assessment & improvement, not a hiring guarantee

[ FINAL CTA ]   one strong line + single button

[ FOOTER ]
```

Review the plan against this question: *"if I gave this brief to any AI, would it land here?"* If a
part feels like the default answer, change it and tell me what you changed and why. Only build after
I approve the plan.

---

## 4. Tech stack & libraries

Assume the existing stack is **Next.js (App Router) + React + Tailwind CSS on Vercel** — confirm by
reading the repo first. Match what's already there; don't introduce a second styling system.

Use these (install only what the chosen design actually needs — don't over-import):

- **Motion** (formerly Framer Motion) — scroll-reveal, the hero transformation, hover
  micro-interactions. The primary animation tool. `npm i motion`
- **Lenis** — smooth, weighted scrolling. This is a big part of what makes a page *feel* like
  Apple's. `npm i lenis`
- **GSAP + ScrollTrigger** — *only if* the signature scroll choreography needs frame-accurate,
  scrubbed, pinned sequencing beyond what Motion handles cleanly. Don't add it unless needed.
- **next/font** with **Geist / Geist Mono** (or Inter) — self-hosted, fast, no layout shift.
- **shadcn/ui** + **Radix primitives** — accessible button/dialog/accordion primitives, styled to
  the design (not left as defaults).
- **Magic UI** — a few pre-built animated marketing components (marquees, reveals) you can adapt —
  use sparingly and restyle so it doesn't look stock.
- **next/image** — for any imagery/mockups; never ship unoptimized images.

Skip 3D / React-Three-Fiber unless I ask — it's overkill here and hurts load time.

---

## 5. Repos to read for the skills (learn the patterns, then build your own)

Study these directly — read their docs, examples, and source. Don't copy wholesale; learn the
technique and apply it to our signature moment.

- **`motiondivision/motion`** (Motion / Framer Motion) — `whileInView`, scroll-linked values,
  `useScroll`, layout animations. The reveal + transformation patterns live here.
- **`darkroomengineering/lenis`** — official smooth-scroll; their README shows the Next.js wiring and
  how to sync with scroll animations.
- **`greensock/GSAP`** — ScrollTrigger docs/demos for pinned, scrubbed, choreographed sequences
  (only if you reach for GSAP).
- **`shadcn-ui/ui`** — accessible, composable component patterns; the install/CLI flow.
- **`magicuidesign/magicui`** — marketing-animation components to learn from and adapt.
- **`vercel/geist-font`** — the typeface + usage guidance.
- **`tailwindlabs/tailwindcss`** — for responsive/utility patterns; pair with Tailwind UI marketing
  examples for layout reference.

For broader inspiration, search GitHub for current "awesome landing page" / "awesome Next.js
landing page" lists and Awwwards-featured product sites — but verify anything you pull in still
builds and isn't abandoned before depending on it.

---

## 6. Quality floor (non-negotiable)

- **Responsive to mobile** — the hero transformation must degrade gracefully on a narrow screen
  (stack, simplify, or autoplay a reduced version). Test ~380px width.
- **Respect `prefers-reduced-motion`** — provide a calm, static fallback for every animation.
- **Keyboard accessible** — visible focus states, all CTAs reachable and operable by keyboard.
- **Fast** — lazy-load below-the-fold animation, optimize images, watch the JS bundle. A heavy
  landing page contradicts the "in seconds" promise. Aim for a strong Lighthouse score.
- **Don't break the app** — landing page changes only; `/auth` and all routes stay intact.
- **Copy in the interface voice** — active voice, plain verbs, sentence case, specific over clever.
  Buttons say exactly what happens ("Analyze my CV", not "Submit").

---

## 7. Definition of done

1. Audience decision (§0) is confirmed and the whole page commits to it.
2. A design plan (§3) was shown and approved before code.
3. The hero delivers the signature CV→score→rewrite moment; it works on load and on scroll, and has
   a reduced-motion fallback.
4. Sections follow the approved order; "how it works" is the only place using numbered steps.
5. Copy is honest (no hiring guarantee) and matches the real feature set.
6. Mobile, keyboard, reduced-motion, and performance floors in §6 all pass.
7. The deployed app and all auth links still work.

When in doubt, choose restraint. One memorable moment, executed precisely, beats five competing
effects.

---
---

# Workstream B

## 8. NEW FEATURE SPEC — CV Rewrite → ATS-safe PDF

This is a **product feature**, separate from the landing-page work. The app already parses CVs and
analyzes them against live postings; this feature adds the *cure* to the existing *diagnosis*: it
takes the user's existing CV and produces an improved, role-tailored, ATS-safe version they can
download as a PDF.

### 8.0 The one rule everything serves: reframe, never fabricate

The single hard constraint: **rewrite and reframe only what the candidate actually has. Never invent
a skill, tool, job, qualification, metric, or achievement that is not in their source CV (or that
they explicitly provide when asked).** A rewrite that "improves" a CV by inflating it gets the user
caught lying in an interview — that is a serious harm and would destroy the product's reputation. Every
step below exists to make the output *stronger* while keeping it *true*. When in doubt, leave it out
and surface it as a gap to build, not a claim to make.

### 8.1 Pipeline overview

```
existing CV ──▶ [1] parse to structured JSON  (canonical "facts ledger")
target role/posting ──▶ [2] extract real required skills/keywords (reuse existing grounding)
                              │
                              ▼
                        [3] truthful rewrite engine  (operates on JSON, not raw text)
                              │  reframes existing facts toward the target's vocabulary
                              │  flags bullets that need a metric → asks the user (§8.4)
                              ▼
                        [4] anti-fabrication verification pass  (every output claim must
                              trace to the ledger or a user-supplied answer; else reject/flag)
                              ▼
                        [5] render JSON → ATS-safe HTML template  (chosen design, §8.6)
                              ▼
                        [6] HTML → real-text PDF  (§8.5)  — NEVER an image
                              ▼
                        [7] QA: run output back through our own ATS checker; show score
                              ▼
                        [8] before/after review + download
```

### 8.2 Step 1 — Parse to a structured "facts ledger"

Do **not** rewrite the raw CV text blob. First extract it into canonical structured JSON, e.g.:

```json
{
  "contact": { "name": "", "email": "", "phone": "", "location": "", "links": [] },
  "summary": "",
  "experience": [
    { "id": "exp1", "title": "", "org": "", "start": "", "end": "",
      "bullets": [ { "id": "b1", "text": "" } ] }
  ],
  "education": [ { "id": "ed1", "qualification": "", "institution": "", "year": "" } ],
  "skills": [ "" ],
  "projects": [ { "id": "p1", "name": "", "bullets": [] } ]
}
```

This JSON is the **facts ledger**: the complete, exhaustive set of true claims the rewrite is allowed
to draw from. Nothing outside it (plus §8.4 user answers) may appear in the output.

### 8.3 Step 3 — The truthful rewrite engine

Operate per bullet / per section on the structured data. Instruct the model explicitly:

- Rewrite each existing bullet to be stronger and to **mirror the target posting's vocabulary**,
  but using **only information already present** in that bullet / the ledger.
- The legitimate move is **honest reframing**: if the user wrote "managed the cash-up" and the
  posting says "financial reconciliation," rewrite to the posting's term — it's the same real thing
  in the employer's language. This is allowed and is the core value.
- Push weak bullets toward **action verb + what you did + result/impact** — *only* with facts that
  exist. Do not manufacture the result.
- For keyword alignment: only surface a target keyword if the candidate's real experience supports
  it. If it isn't supported, it is a **gap to build** (feed it to the existing gap analysis), **not**
  a line to insert.
- **Provenance:** every rewritten bullet must record which source bullet id(s) it derives from, so
  the output is auditable and traceable back to the ledger.

### 8.4 Handling missing metrics — ask, don't invent

When a bullet would be stronger with a number or outcome the CV doesn't contain, the engine must
**not** fabricate one. Instead it **prompts the user**: "How many people attended?" / "What was the
result of this project?" Collect the answers, add them to the ledger, and re-incorporate. This turns
a fabrication risk into the feature's secret weapon — the output stays true *and* it coaches the user
to write better bullets. Make these prompts a clear, optional review step in the UX, not a blocker.

### 8.5 Step 4 — Anti-fabrication verification (build this, don't skip it)

A prompt instruction alone is not enough. Add a real guard:

- After rewriting, run a **verification pass** that checks every concrete claim in the output (each
  skill, tool, employer, title, date, number, qualification) against the ledger + user answers.
- Anything that does **not** trace back is flagged and either removed or surfaced to the user for
  confirmation ("we couldn't find this in your CV — did you mean to add it?").
- Prefer a structured check over vibes: e.g. extract the set of claimed skills/entities from the
  output and assert it is a subset of (ledger ∪ user answers).

### 8.6 Step 5–6 — Generate a real-text, ATS-safe PDF

**Critical: the PDF must contain real, selectable text, not a picture of text.**

- **Do NOT** use `html2canvas` + `jsPDF` or any screenshot/rasterize approach. It looks fine to a
  human and scores **zero** in our own ATS check because no text can be extracted. Hard ban.
- **Do:** structured JSON → clean **HTML/CSS template** → real-text PDF. One data source feeds
  multiple templates; only the template (CSS/layout) changes.
- **PDF engine — pick based on the deploy target (confirm the repo's setup first):**
  - **`@react-pdf/renderer`** — *recommended on Vercel.* Pure JS, outputs real-text PDFs, no
    headless-Chromium binary to wrestle into a serverless function. Tradeoff: its own layout system,
    so templates take a little more fiddling. Best fit since the app is on Vercel.
  - **Puppeteer / Playwright (headless Chrome "print to PDF")** — gold standard for fidelity and full
    CSS, real selectable text. But on Vercel serverless it needs `@sparticuz/chromium` and careful
    config; only choose this if you want full CSS control and will handle the serverless Chromium
    setup, or if there's a non-serverless backend to run it on.
  - **WeasyPrint** — if any step runs in **Python**: HTML/CSS → real-text PDF, clean and ATS-safe.

### 8.7 Step 7 — Close the loop with our own ATS checker

After generating the PDF, extract its text and **run it back through the app's existing ATS checker**
before handing it to the user. If the generator and the checker agree it's clean, that's a real
quality gate — and a great demo line ("the tool validates its own output"). Surface the resulting ATS
score next to the download.

### 8.8 Design options — range *within* the ATS-safe zone

"Looks nice" and "ATS-safe" pull in opposite directions; the gorgeous two-column/sidebar/icon CVs are
exactly the ones parsers shred. So offer curated range, not freeform chaos:

- **3–4 hand-built templates** the user picks between (not arbitrary layout controls). Each is
  designed once to look polished *and* parse cleanly.
- **Cheap, high-impact knobs:** a single **accent colour** (one CSS variable), a **font pairing**
  chosen from 2–3 safe professional combos, and **density** (compact / spacious, also helps fit one
  page).
- **Two honest tracks, clearly labelled:**
  - **ATS-Optimized** — single column, plain, guaranteed to parse. For online applications.
  - **Design** — a nicer styled version, flagged *"great for emailing to a human or handing over in
    person; may not parse in some ATS systems."*
  Let the user generate **both** from the same data, and show the **per-template ATS score** live so
  they see the tradeoff in real numbers.
- **Make the defaults genuinely good** — most users won't customize. Good CV typography is restraint:
  generous whitespace, clear hierarchy (name > section > role > bullet), consistent alignment, one
  accent used sparingly, even spacing. Cramped/inconsistent spacing is what reads as homemade.
- **Live preview:** render the chosen template on screen; colour/font/template changes update
  instantly before download. Seeing it update is what makes the feature feel premium.

### 8.8.1 Intelligent template recommendation (pick the best one *for them*)

Don't dump a gallery and make the user guess. **Recommend the single best template for their CV +
role + application route, pre-select it as the default, and show a one-line reason.** Most users
won't customize, so the default must be right; the rest stay available behind it.

**Make the recommendation a transparent, rule-based decision — NOT an LLM "pick a template" call.**
Same lesson as the rest of the app: a small explainable rule is deterministic, instant, consistent,
and lets you show the user *why*. Drive it off signals the app already has, roughly in priority:

1. **Application route (highest weight).** Online portal / ATS → recommend **ATS-Optimized**.
   Emailing a human, in person, or a creative field → **Design** is allowed. Ties directly to the
   two-track system in §8.8. If you don't know the route, ask once with a simple toggle, or default
   to ATS-Optimized (the safe choice).
2. **Industry formality** (derive from the target role): law / finance / government / academia →
   Classic/conservative; tech / startup / marketing → Modern is fine.
3. **Content volume & seniority:** lots of experience → a denser template (allow 2 pages); a
   student / grad with little content → a **spacious** template so the page doesn't look empty.
   Choosing wrong here is exactly what makes a CV read as thin or cramped.
4. **Regional conventions:** CV norms differ by market (photo vs none, personal details, length,
   "CV" vs "résumé"). Detect from the target market and adjust rather than assuming one global
   standard.

**Let the ATS score be the tiebreaker AND the justification.** You already compute a per-template
ATS score live — use it to rank close calls and to phrase the recommendation as *evidence*, not
opinion: "Recommended — scores 96 on ATS for this role vs 71 for the Design version." If the user
picks the prettier one anyway, the visible score drop makes them own the tradeoff.

**Do NOT have AI generate a bespoke custom template per user.** It's unreliable and almost always
breaks ATS-safety. Curated templates + intelligent *selection* gives the personalization without the
parsing risk.

So: a handful of well-made templates, a transparent rule that picks + pre-selects the best one for
this CV/role/route, a one-line *why*, and the live ATS score keeping the choice honest.

### 8.9 Build plan — propose before coding

Before writing code, show me a short plan covering: the JSON ledger shape (confirmed against the
existing parser), the rewrite + verification prompt design, the chosen PDF engine (with the Vercel
tradeoff stated), the template set, and the UX flow. Wait for my "go."

Suggested build order:
1. JSON ledger extraction (reuse/extend the existing parser).
2. Truthful rewrite engine + the user "fill-the-gap" prompts (§8.3–8.4).
3. Anti-fabrication verification pass (§8.5) — this is the spine; don't defer it.
4. One ATS-safe template + real-text PDF export (`@react-pdf/renderer` on Vercel) (§8.5–8.6).
5. Self-QA through the existing ATS checker (§8.7).
6. Before/after review UI with score delta.
7. Then design options: extra templates, accent/font/density, the two-track + live preview (§8.8).
8. Intelligent template recommendation: the transparent rule that pre-selects the best template for
   the CV/role/route, with the one-line reason and ATS-score justification (§8.8.1).

### 8.10 Definition of done (feature)

1. Output draws **only** from the user's real CV + their explicit answers; the verification pass
   actively catches and blocks invented claims.
2. Missing metrics trigger a user prompt, never a fabrication.
3. The PDF contains real, selectable text and **passes the app's own ATS checker**.
4. No image-based PDF method is used anywhere.
5. User sees a before/after comparison with the ATS/match score delta.
6. At least one ATS-Optimized template ships; design options are clearly labelled with their ATS
   tradeoff.
7. The best template for the CV/role/route is **pre-selected by a transparent rule** (not an LLM
   guess) with a visible one-line reason; the others remain available.
8. Framing/copy says "a role-tailored rewrite of *your* experience" — never a hiring guarantee.

