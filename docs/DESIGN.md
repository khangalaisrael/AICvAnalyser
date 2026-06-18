---
name: TalentScan
description: AI-powered CV screening for talent acquisition leads who need a fast, confident hiring signal.
colors:
  coral-confidence: "#f25c54"
  bg-canvas: "#faf9f5"
  bg-sidebar: "#fbfaf6"
  bg-surface: "#ffffff"
  border-default: "#ecebe3"
  border-muted: "#f1efe7"
  ink-primary: "#22272f"
  ink-secondary: "#52575f"
  ink-muted: "#7c818b"
  ink-subtle: "#a7a99f"
  verdict-hire-text: "#4d6b22"
  verdict-hire-fill: "#5f8b2e"
  verdict-hire-bg: "#e4efd2"
  verdict-maybe-text: "#8c6113"
  verdict-maybe-fill: "#c5811c"
  verdict-maybe-bg: "#f6ecd2"
  verdict-reject-text: "#b23a30"
  verdict-reject-fill: "#e84a45"
  verdict-reject-bg: "#f8dcd7"
typography:
  display:
    fontFamily: "'Source Serif 4', Georgia, serif"
    fontSize: "clamp(1.25rem, 2vw, 1.5rem)"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "'Source Serif 4', Georgia, serif"
    fontSize: "1.1875rem"
    fontWeight: 600
    lineHeight: 1.3
  title:
    fontFamily: "'Source Sans 3', system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 700
    lineHeight: 1.4
  body:
    fontFamily: "'Source Sans 3', system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Source Sans 3', system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.1em"
rounded:
  btn: "11px"
  card-sm: "10px"
  card-md: "16px"
  card-lg: "20px"
  avatar: "9px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "22px"
  xxl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.coral-confidence}"
    textColor: "#ffffff"
    rounded: "{rounded.btn}"
    padding: "0.6rem 1rem"
  button-primary-hover:
    backgroundColor: "{colors.coral-confidence}"
    textColor: "#ffffff"
    rounded: "{rounded.btn}"
    padding: "0.6rem 1rem"
  button-secondary:
    backgroundColor: "{colors.bg-surface}"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.btn}"
    padding: "0.6rem 1rem"
  verdict-hire:
    backgroundColor: "{colors.verdict-hire-bg}"
    textColor: "{colors.verdict-hire-text}"
    rounded: "{rounded.pill}"
    padding: "7px 15px"
  verdict-maybe:
    backgroundColor: "{colors.verdict-maybe-bg}"
    textColor: "{colors.verdict-maybe-text}"
    rounded: "{rounded.pill}"
    padding: "7px 15px"
  verdict-reject:
    backgroundColor: "{colors.verdict-reject-bg}"
    textColor: "{colors.verdict-reject-text}"
    rounded: "{rounded.pill}"
    padding: "7px 15px"
  skill-matched:
    backgroundColor: "{colors.verdict-hire-bg}"
    textColor: "{colors.verdict-hire-text}"
    rounded: "{rounded.pill}"
    padding: "7px 14px"
  skill-missing:
    backgroundColor: "{colors.verdict-reject-bg}"
    textColor: "{colors.verdict-reject-text}"
    rounded: "{rounded.pill}"
    padding: "7px 14px"
---

# Design System: TalentScan

## 1. Overview

**Creative North Star: "The Hiring Partner"**

TalentScan feels like advice from a trusted colleague — someone who's read the CV so you don't have to, and will give you a straight answer. The interface is warm without being casual, professional without being corporate. It doesn't hedge: HIRE is green and means yes, REJECT is red and means no, and the interface is built around the confidence to say so clearly.

The aesthetic is informed by Linear's opinionated precision (every element earns its place, zero decoration) and Notion's structured density (information is a feature, not a liability). The canvas is a warm cream (`#faf9f5` — oklch 97.5% 0.007 80°), not the sterile white of a legacy ATS. Cards surface on clean white. The sidebar sits on a slightly differentiated background (`#fbfaf6`). Depth is tonal, not shadowed — surfaces step up in lightness, not elevation. The only shadow that exists is on the primary button's coral glow, and on interactive elements at hover state.

The coral accent (`#f25c54` — oklch 62% 0.21 22°) is Coral Confidence: warm enough to avoid alarm, authoritative enough to command attention. It appears on primary actions, active nav states, and the brand mark. Its rarity is deliberate. A screen saturated with coral loses the signal; a single coral CTA means something.

**Key Characteristics:**
- Warm cream canvas with white card surfaces — tonal depth without shadows at rest
- Coral accent used sparingly: CTAs, active states, brand only
- Serif display font (Source Serif 4) for scores, verdicts, and section headers — authority
- Sans-serif body (Source Sans 3) for UI copy, labels, metadata — efficiency
- Three semantic verdict colors (green/amber/red) that always appear with text labels, never alone
- Score displayed as a large circular SVG ring — the single most important number on any results screen

## 2. Colors: The Coral Confidence Palette

A restrained palette built on warm neutrals with one authoritative accent and three verdict signal colors.

### Primary
- **Coral Confidence** (`#f25c54`, oklch 62% 0.21 22°): The product's voice and primary action color. Used on the CTA button, active sidebar nav indicator, brand mark, and score bar fills for high scores. Not used for background fills, hero areas, or decorative purposes. **Its scarcity is what gives it authority.**

### Neutral
- **Canvas Cream** (`#faf9f5`, oklch 97.5% 0.007 80°): The body background. Warm enough to feel human; not warm enough to be "cream/parchment/paper" in the generic AI sense — it's the brand's own neutral, tinted slightly toward the coral hue's warmth.
- **Sidebar Veil** (`#fbfaf6`): The sidebar background. One step lighter than canvas. The distinction is intentional: the sidebar is a service layer, not the stage.
- **Surface White** (`#ffffff`): Cards and content panels. Pure white creates the tonal step that gives cards presence without shadow.
- **Border Default** (`#ecebe3`, oklch 93% 0.009 80°): Card outlines, dividers, input strokes at rest. The same warm undertone as the canvas.
- **Border Muted** (`#f1efe7`): Nested dividers, subtle separators within components. One step lighter than Border Default.
- **Ink Primary** (`#22272f`): Headings, candidate names, scores. Near-black with a slight cool-blue shift (oklch 22% 0.016 250°) that keeps it from feeling stark.
- **Ink Secondary** (`#52575f`): Body copy, button text on secondary. Dark enough to hit 4.5:1 on white; lighter than primary to create clear hierarchy.
- **Ink Muted** (`#7c818b`): Captions, role labels, placeholder text. Hits 4.5:1 on the canvas. **Not lighter than this. The muted-gray-on-tinted-background trap kills readability.**
- **Ink Subtle** (`#a7a99f`): Metadata, scores-per-100 denominators, sidebar section labels. Decorative-weight text only — never for information the user needs to read.

### Verdict Signal Colors
Three semantic color systems, each with three paired values (text / fill / background). Always used as a trio — never mix roles across verdicts.

- **HIRE** — text `#4d6b22`, fill `#5f8b2e`, bg `#e4efd2`: Forest green family. Confident, affirmative.
- **MAYBE** — text `#8c6113`, fill `#c5811c`, bg `#f6ecd2`: Amber family. Measured, holding.
- **REJECT** — text `#b23a30`, fill `#e84a45`, bg `#f8dcd7`: Deep rose-red. Decisive, not alarming.

**The Rarity Rule.** Coral Confidence appears on ≤15% of any screen. If a surface reads "coral" when you squint, it's wrong — it should read "cream with one clear signal."

**The Verdict Completeness Rule.** Verdict colors never appear without a paired text label (HIRE / MAYBE / REJECT). Color alone fails WCAG 1.4.1 (use of color). A dot indicator is acceptable if a visible text label accompanies it in the same component.

## 3. Typography

**Display Font:** Source Serif 4 (Variable, opsz 8–60, weights 500–600) — Google Fonts  
**Body Font:** Source Sans 3 (Variable, weights 400–700) — Google Fonts

**Character:** The pairing works on a contrast axis — the optical-size-variable serif brings authority and warmth to scores and verdicts; the humanist sans handles dense UI copy with maximum legibility at small sizes. The combination reads "intelligent tool," not "polished marketing site."

### Hierarchy

- **Display** (Source Serif 4, 600, clamp(1.25rem → 1.5rem), lh 1.3, ls -0.01em): Score numbers, the candidate name in results headers, section titles on the full-page report view. The serif makes large numbers feel deliberate, not mechanical.
- **Headline** (Source Serif 4, 600, 1.1875rem / 19px, lh 1.3): Panel section headers ("Score breakdown", "Matched skills", "AI summary"). Mid-weight serif maintains the authority register at a more compact size.
- **Title** (Source Sans 3, 700, 0.9375rem / 15px, lh 1.4): Candidate names in the sidebar list, column headers, button labels, role selector text. Sans-serif 700 for legibility under information density.
- **Body** (Source Sans 3, 400, 0.9375rem / 15px, lh 1.5): AI summary paragraphs, alert text, description copy. Cap at 65–75ch. `text-wrap: pretty` on paragraphs to suppress orphans.
- **Label** (Source Sans 3, 700, 0.6875rem / 11px, lh 1, ls 0.1em, uppercase): Section kickers ("VERDICT", "/ 100", sidebar metadata tags). Tight uppercase labels — used sparingly to mark structural elements, not decorative eyebrows on every section.

**The Two-Voice Rule.** Source Serif 4 speaks for the product's judgements (scores, verdicts, section titles, the brand mark). Source Sans 3 handles everything the user operates (buttons, labels, inputs, sidebar nav, status text). Never use the serif for utility copy; never use the sans for display numerals.

## 4. Elevation

TalentScan uses **hybrid elevation**: surfaces are flat at rest; shadow appears only as a response to interaction state. Depth at rest is conveyed through tonal layering — canvas cream → sidebar veil → white card surface — without any shadows.

### Shadow Vocabulary

- **Accent Glow** (`0 3px 10px rgba(242, 92, 84, 0.32)`): The primary button only. Not a generic elevation shadow — it's a color-matched warm glow that reinforces the coral brand. Used on the CTA button at rest.
- **Interactive Lift** (`0 4px 16px rgba(0, 0, 0, 0.08)`): Cards and candidate cards on hover/focus. Appears on `:hover` and `:focus-visible` states only. Crisp, diffuse, neutral — not warm, not dramatic. 16ms ease-out on shadow transition.
- **Dropdown / Float** (`0 8px 24px rgba(0, 0, 0, 0.12)`): Floating elements (context menus, tooltips, dropdowns). Slightly stronger to separate from the page surface. Use `position: fixed` or the Popover API to escape `overflow: hidden` parent contexts.

**The Flat-by-Default Rule.** No surface has a shadow at rest unless it's floating (menu, tooltip) or branded (coral button glow). Shadow appearing on hover is feedback, not decoration. A candidate card that casts shadow at rest looks like a broken hover state.

## 5. Components

### Buttons

Buttons are the loudest interactive element. Shape and weight must match the call to action's importance.

- **Shape:** Gently rounded (11px radius — `rounded.btn`). Not sharp enough to feel legacy; not pill-enough to feel consumer. Consistent across all button sizes.
- **Primary:** Coral Confidence fill (`#f25c54`), white text, 700 weight, 14px. Accent glow shadow at rest. Opacity 0.9 on hover. `box-shadow: 0 3px 10px rgba(242,92,84,.32)` — the only warm shadow in the system.
- **Secondary:** White fill, Border Default stroke (1px), Ink Secondary text, 600 weight. `border-color` shifts to `#cfcdc2` on hover. No shadow.
- **Disabled:** `#f0eee6` fill, `#e3e1d8` border, `#c2c4c8` text. `cursor: not-allowed`. **Do not use opacity for disabled states** — low-opacity interactive elements look broken, not disabled.
- **Sizing:** `padding: 0.6rem 1rem` is the standard size. `use_container_width` on primary CTAs within constrained panels; inline width on secondary actions.

### Verdict Badges

The most semantically loaded components in the system. Always a pill shape (999px radius), always text + colored dot side by side.

- **Structure:** 8px dot + "VERDICT · HIRE" text, 700 weight, 13px, 0.05em letter-spacing. Uppercase is correct here — it signals "this is a structured categorization," not decorative tracking.
- **HIRE:** `#e4efd2` bg, `#4d6b22` text, `#5f8b2e` dot.
- **MAYBE:** `#f6ecd2` bg, `#8c6113` text, `#c5811c` dot.
- **REJECT:** `#f8dcd7` bg, `#b23a30` text, `#e84a45` dot.
- The badge never appears without the dot — color + text + shape must all agree.

### Score Ring (Signature Component)

The centrepiece of every results screen. An SVG circular progress indicator displaying the final score (0–100) as a filled arc.

- **Geometry:** `viewBox="0 0 120 120"`, circle at cx=60 cy=60 r=52. Track stroke: `#edebe1`, 12px. Progress stroke: verdict fill color, 12px, `stroke-linecap="round"`, rotated -90° from the top.
- **Color:** Green (`#5f8b2e`) at ≥75, Amber (`#c5811c`) at 50–74, Red (`#e84a45`) below 50.
- **Inner label:** Score in Source Serif 4 600 at 42px; "/ 100" in Source Sans 3 700 at 11px, `#a7a99f`, 0.1em letter-spacing.
- **Sizes:** 156px on the report full-page view, 106px on the dashboard compact header.
- **Animation:** On first render, the progress arc animates from 0 to its final `stroke-dashoffset` over 800ms ease-out. Static at rest after initial reveal. `@media (prefers-reduced-motion: reduce)` skips to final value instantly.

### Score Bars

Horizontal bar components for the score breakdown section.

- **Structure:** Label (Source Sans 3, 600, 15px) + score value at right (Source Sans 3, 700, 13px, verdict color) + full-width 11px bar.
- **Track:** Verdict track color (`#e9efdd`, `#f4ecd9`, or `#f7e3df`).
- **Fill:** Verdict fill color. Animates from 0% width to final value on mount, 600ms ease-out, staggered 80ms per bar.
- **Card variant (Dashboard view):** Each bar wrapped in a white card (16px radius, `border: 1px solid #ecebe3`, 20px internal padding). Verdict badge label in top-right corner. 28px score number in Source Serif 4 600.

### Skill Pills

Inline indicators for matched and missing skills.

- **Matched:** `#e4efd2` bg, `#4d6b22` text, checkmark prefix (`✓`), 600 weight, 13.5px.
- **Missing:** `#f8dcd7` bg, `#b23a30` text, no prefix. The absence of a ✓ is signal enough — don't add an ✗.
- **Shape:** 999px radius, `padding: 7px 14px`, `margin: 3px`.

### Candidate Cards (Sidebar)

Each candidate occupies a 48px-tall row in the sidebar. Native right-click / long-press triggers a delete context menu.

- **Layout:** 32×32 avatar (9px radius, `#f0eee6` bg, Ink Muted initials, 12px 700) + name/role stack + score at right.
- **Active state:** `#fdecea` row background, Coral Confidence left-accent dot in the nav indicator.
- **Hover:** `rgba(0,0,0,0.06)` overlay on the 48px hit target. Interactive Lift shadow on `:hover`.
- **Context menu:** Floated via `position: fixed`, white bg, `border: 1px solid #ecebe3`, `border-radius: 10px`, `box-shadow: 0 4px 20px rgba(0,0,0,.12)`. Delete item in Reject text color (`#e84a45`).

### Input Fields

- **Style:** White bg, `border: 1px solid #ecebe3`, 11px radius. Font: Source Sans 3, 14px.
- **Focus:** `border-color: #f25c54`, `box-shadow: 0 0 0 2px rgba(242,92,84,.1)`. The coral focus ring matches the primary action color — keyboard navigation stays on-brand.
- **Placeholder:** Ink Muted (`#7c818b`). Must hit 4.5:1 against white. **Never lighter than this.**
- **Error state:** `border-color: #e84a45`, error message in Reject text color below the field.

### Sidebar Navigation

- **Active item:** 9px rounded pill, `#fdecea` bg, Coral Confidence text, 7px dot in coral.
- **Inactive item:** `#6b7078` text, `#cfcdc2` dot, no background.
- **Section header:** Source Sans 3, 11px, 700, uppercase, 0.1em letter-spacing, `#a7a99f`. Appears above "Candidates" list only — not above every sidebar section.

## 6. Do's and Don'ts

### Do:
- **Do** use Source Serif 4 for all scores, verdicts, and section headings. The serif voice belongs to the product's judgements.
- **Do** pair every verdict color badge with a visible text label (HIRE / MAYBE / REJECT) — never use color alone.
- **Do** keep Coral Confidence to ≤15% of any screen. The accent derives its authority from restraint.
- **Do** use the warm canvas (`#faf9f5`) as the body background, white (`#ffffff`) for card surfaces, and border strokes (`#ecebe3`) for containment. Tonal depth; no shadows at rest.
- **Do** animate the score ring and score bars on first render — they are the result of analysis, and the entrance should feel earned. Respect `prefers-reduced-motion`.
- **Do** use `position: fixed` or the Popover API for all floating UI (context menus, dropdowns, tooltips). Never `position: absolute` inside an `overflow: hidden` container.
- **Do** keep body text and input placeholders at ≥ `#7c818b` on the canvas background. That shade is the minimum for 4.5:1 compliance.
- **Do** apply `text-wrap: balance` on `h1`–`h3` and `text-wrap: pretty` on multi-line body copy.

### Don't:
- **Don't** use gradient text (`background-clip: text` + gradient). Not in this system. Color emphasis uses weight or size.
- **Don't** add a colored `border-left` stripe to cards, list items, or callouts as a decorative accent. If a border is needed, use a full border in `{colors.border-default}`.
- **Don't** build the UI to look like Greenhouse or Workday — dense grey forms, deep nested dropdowns, tabular data with no visual hierarchy. TalentScan is lighter, faster, more direct. If a screen could pass for legacy ATS software, strip it back.
- **Don't** reference Canva, consumer SaaS, or playful design aesthetics — pastel gradient backgrounds, bubbly rounded corners beyond 20px on large surfaces, celebratory emoji copy, confetti animations. This is a professional tool used in real hiring decisions.
- **Don't** use the generic AI SaaS dashboard aesthetic: warm-cream background paired with big hero metric cards, identical icon-heading-text grids, and coral as a dominant surface color. The canvas IS warm cream — so every other choice must be deliberately non-generic. Enforce scarcity on the accent.
- **Don't** use shadow at rest on any non-floating, non-branded surface. Interactive Lift appears on `:hover` only.
- **Don't** apply uppercase tracked labels (`font-weight: 700`, `letter-spacing: 0.1em`, `text-transform: uppercase`) to every section header. That pattern is the AI scaffold default. In TalentScan, uppercase labels appear only on structured categorization (VERDICT, HIRE, sidebar metadata) — not as section eyebrows.
- **Don't** disable states with `opacity: 0.5`. Use the explicit disabled color set (`#f0eee6` bg, `#c2c4c8` text) instead.
- **Don't** render nested cards. A card inside a card is always the wrong answer — flatten the hierarchy or use a row layout.
