# Product

## Register

product

## Users

Talent acquisition leads and hiring managers at mid-size companies (20–500 people). These are senior decision-makers reviewing shortlisted or AI-screened candidates — not doing the initial volume pass, but making the call on who to progress. They use TalentScan to get a fast, confident signal on a candidate before a hiring conversation or committee decision. Context: busy professionals, usually switching between this and email or an ATS. Every extra second of ambiguity costs them.

## Product Purpose

TalentScan screens CVs against defined role profiles using AI — extracting structured signals (matched skills, years of experience, keyword alignment, quantifiable achievements) and producing a scored verdict: HIRE, MAYBE, or REJECT. The product exists so hiring managers spend time on the right candidates, not on reading every CV to the bottom. Success looks like: open a CV, see the score and verdict, understand why in 10 seconds, make a decision, move on.

## Brand Personality

Sharp, trustworthy, efficient.

Sharp: the interface takes a stance. Verdicts are decisive, not hedged. The score means something. Trustworthy: consistency builds confidence. The same verdict logic applied the same way, every time — the visual system feels principled, not ad-hoc. Efficient: no decorative elements. No onboarding fanfare. No empty marketing language. Density is a feature.

Reference: Linear's opinionated, fast, zero-clutter energy. Notion's structured information density. The feel of a tool that respects your time and intelligence.

## Anti-references

- **Greenhouse / Workday / legacy ATS**: grey forms, enterprise clutter, dropdowns inside dropdowns, rows and rows of metadata nobody reads. TalentScan is lighter, faster, more direct.
- **Canva / playful consumer apps**: pastel gradients, rounded bubbly cards, celebratory micro-copy. TalentScan is professional and trustworthy — used for real hiring decisions.
- **Generic SaaS dashboard aesthetic**: warm-cream background, big hero metric cards, identical icon-heading-text grids. This is the saturated AI default of 2026. TalentScan has a specific visual identity (coral accent, Source fonts, structured verdict colors) and should feel intentional, not generated.

## Design Principles

1. **Signal over noise.** The verdict and score are the product. Every element earns its place by either surfacing the signal or helping the user act on it. Anything that doesn't do one of those two things is decoration — remove it.

2. **Confident clarity.** The UI should match the confidence of the verdict. HIRE is green and means yes. REJECT is red and means no. No soft-pedaling, no ambiguous labeling, no "this candidate shows potential" hedging in the copy. Bold, clear, direct.

3. **Density as respect.** TA leads are busy and experienced. Information density is a feature — a Notion-style structure that gives density meaning, not a legacy-ATS form that uses density to hide confusion. Pack it in, but make the hierarchy unmistakable.

4. **Consistency builds trust.** A verdict is only trustworthy if the system feels principled. The visual system — verdict colors, score ring, component patterns — should feel applied consistently across every candidate, every session. No surprises.

5. **Speed is the primary affordance.** Every interaction should be completable in fewer steps than the user expects. Upload → score → verdict → action: that's the whole flow. No detours, no confirmation dialogs, no unnecessary state.

## Accessibility & Inclusion

WCAG 2.1 AA. Body text ≥ 4.5:1 contrast against background. Large / bold text ≥ 3:1. Keyboard navigable throughout (sidebar, upload, results, pipeline actions). Screen reader compatible (semantic HTML, ARIA labels on icon-only buttons). `prefers-reduced-motion` respected — score ring animation and bar entrances must have a static fallback. Verdict colors must not rely on color alone (always paired with a text label).
