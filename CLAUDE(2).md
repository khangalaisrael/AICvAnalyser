# CLAUDE.md — CV Analyser: Role Description Migration

## What We Are Changing

**Only the role input/research layer is changing.**
Everything else — CV parsing, scoring logic, verdict system, UI architecture, results display — stays exactly as built.

---

## What To Remove

- All predefined role constructs (hardcoded role lists, dropdowns, role constants, static role definitions)
- Any static skill lists tied to predefined roles
- Any role selection UI components (dropdowns, radio buttons, role pickers)

**Do not touch anything else.**

---

## What To Add

### 1. Role Description Input
Replace the predefined role selector with a **free-text input field** where the user describes what they aspire to be.

Examples of what a user might type:
- `"java developer"`
- `"senior frontend engineer at a fintech company"`
- `"I want to become a machine learning engineer"`
- A full copy-pasted job description

---

### 2. Two-Prompt Strategy (OpenAI → Claude)

#### PROMPT 1 — OpenAI: Role Researcher
Use the OpenAI API to research and expand the user's input into a structured role profile.

**Critical instruction to OpenAI:** Always fetch the **most current and in-demand skills** for this role as of today. Reflect what the market requires right now, not outdated standards.

```
System:
You are a career research expert with up-to-date knowledge of the job market.
Given a role description (which may be vague or detailed), research and expand it
into a comprehensive role profile reflecting current market demands.
Always include the latest in-demand skills for this role.
Return ONLY valid JSON, no markdown, no explanation.

User:
Role description: "[user input here]"

Return this exact JSON structure:
{
  "role_title": "",
  "seniority_level": "",
  "required_skills": [],
  "nice_to_have_skills": [],
  "experience_years": "",
  "key_responsibilities": [],
  "current_market_trends": [],
  "certifications_or_qualifications": []
}
```

---

#### PROMPT 2 — Claude (Anthropic): CV Matcher & Coach
Pass the OpenAI role profile JSON + the parsed CV text into Claude for analysis.

```
System:
You are an expert CV coach and hiring specialist.
You will be given a structured role profile and a candidate's CV.
Your job is to assess how well the CV matches the role and provide honest, 
actionable coaching advice.

User:
Role Profile (researched from market):
[INSERT OPENAI JSON OUTPUT HERE]

Candidate CV:
[INSERT PARSED CV TEXT HERE]

Provide your analysis in this structure:
1. Overall Match Score (0-100)
2. Verdict (Strong Match / Partial Match / Needs Work)
3. Strengths (what the CV does well for this role)
4. Gaps (what's missing or weak)
5. CV Improvement Suggestions (specific, actionable advice to tailor this CV for the role)
6. Skills to Learn (based on current market trends for this role)
```

---

### 3. Flow Summary

```
User types role description (any length, vague or detailed)
        ↓
OpenAI API → researches role → returns structured JSON profile
        ↓
Claude API → compares JSON profile against CV
        ↓
Existing verdict + results UI renders the output (unchanged)
```

---

## Rules For Implementation

1. **Do not change the CV parsing logic** — it works, leave it
2. **Do not change the scoring/verdict UI** — feed it Claude's output as before
3. **Do not change the results display architecture** — same components, same layout
4. **The only new components needed are:**
   - Free-text role input field (replaces role selector)
   - OpenAI API call (Prompt 1)
   - Pass OpenAI output into existing Claude call (Prompt 2)
5. Handle the case where OpenAI returns skills — always surface `current_market_trends` and `required_skills` visibly in the results so the user can see what the market expects
6. Show the user the **researched role title** that OpenAI inferred, so they can confirm or re-describe if it's wrong

---

## Error Handling

- If user input is too vague and OpenAI cannot infer a role, show a friendly message asking for a bit more detail
- If OpenAI API fails, do not fall back to predefined roles — show an error state
- Always validate OpenAI JSON before passing to Claude

---

## Summary

> Remove predefined roles. Add a free-text input. 
> OpenAI researches the role with current market skills. 
> Claude matches it to the CV. 
> Everything else stays the same.
