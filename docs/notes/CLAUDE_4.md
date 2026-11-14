# TalentScan — Claude Code Project Memory

## What this project is
An AI-powered CV analyser called TalentScan. Employers upload candidate CVs (PDF),
select a job role, and get an instant hire/maybe/reject verdict with a detailed
score breakdown. Built with Streamlit, OpenAI GPT-4o-mini, and Python.

---

## Project structure
```
talentscan/
├── CLAUDE.md            ← you are here
├── app.py               ← Streamlit frontend (main entry point)
├── pdf_processor.py     ← extracts text from uploaded PDF using pdfplumber
├── ai_client.py         ← OpenAI API call, returns structured JSON
├── scoring_engine.py    ← weighted scorecard, knockout filter, verdict logic
├── role_profiles.py     ← job role definitions with must-have and nice-to-have skills
├── config.py            ← loads environment variables from .env
├── .env                 ← API keys (never commit this to GitHub)
└── requirements.txt     ← all dependencies
```

---

## Tech stack
- **Frontend**: Streamlit
- **AI**: OpenAI GPT-4o-mini (swap to gpt-4o for production)
- **PDF parsing**: pdfplumber
- **Env management**: python-dotenv
- **Language**: Python 3.10+

## AI provider note
We started with OpenAI because the developer has existing credits.
The ai_client.py is built as an adapter so we can swap to:
- Groq (free, fast) — change client and model name only
- Google Gemini (free tier) — change client and model name only
- Anthropic Claude — change client and model name only
Never hardwire the AI logic into app.py — always keep it in ai_client.py.

---

## Architecture — how the layers connect

```
PDF upload (app.py)
      ↓
pdf_processor.py  →  extracts raw text
      ↓
ai_client.py      →  sends text + role to OpenAI, returns JSON
      ↓
scoring_engine.py →  knockout filter → weighted scorecard → verdict
      ↓
app.py            →  displays results to employer
```

Each file does exactly one job. Never mix concerns between files.

---

## The scoring system

### Knockout filter (instant reject — checked first)
- Missing 3 or more must-have skills → REJECT immediately, skip scorecard
- Years experience below minimum for role → flag but do not auto-reject

### Weighted scorecard (0–100)
| Metric                    | Weight |
|---------------------------|--------|
| Technical skill match     | 25%    |
| Quantifiable achievements | 20%    |
| Years experience          | 15%    |
| Recency of skills         | 10%    |
| Certifications            | 10%    |
| Projects / portfolio      | 10%    |
| Keyword alignment         | 5%     |
| Soft skills               | 5%     |

### Verdict thresholds
| Score   | Verdict |
|---------|---------|
| 75–100  | HIRE ✅  |
| 50–74   | MAYBE 🤔 |
| 0–49    | REJECT ❌ |

---

## What OpenAI must return (JSON schema)
The prompt in ai_client.py must instruct the model to return ONLY this JSON.
No markdown, no explanation, no backticks — just the raw JSON object.

```json
{
  "matched_skills": ["Python", "SQL", "Excel"],
  "missing_skills": ["R", "Spark", "dbt"],
  "years_experience": 3,
  "has_projects": true,
  "has_metrics": true,
  "certifications": ["Google Data Analytics"],
  "match_score": 78,
  "keyword_alignment": 40,
  "soft_skills_evidence": true,
  "ai_summary": "Candidate shows strong analytical foundations..."
}
```

Always wrap JSON parsing in try/except. If parsing fails, return a safe error
state — never crash the app on a bad API response.

---

## Job role profiles (defined in role_profiles.py)

### Data Analyst
- Must have: SQL, Excel, Data Visualisation
- Nice to have: Power BI, Python, Tableau
- Min experience: 1 year

### Data Scientist
- Must have: Python, Machine Learning, Statistics
- Nice to have: TensorFlow, R, SQL, Spark
- Min experience: 2 years

### Software Engineer
- Must have: Git, Data Structures, Algorithms
- Nice to have: Docker, AWS, CI/CD
- Min experience: 1 year

### ML Engineer
- Must have: Python, Machine Learning, Model Deployment
- Nice to have: Kubeflow, MLflow, Airflow, Kafka
- Min experience: 2 years

### Product Manager
- Must have: Roadmapping, Stakeholder Management, Analytics
- Nice to have: SQL, Figma, A/B Testing
- Min experience: 2 years

---

## UI layout (app.py)

### Overall structure
- App name: TalentScan — AI recruitment platform
- st.sidebar for navigation, main area for content
- Two st.columns inside main: left controls, right results

### Sidebar
- Brand: "TalentScan" with subtitle "AI recruitment platform"
- Nav items with icons: Analyse CV (active), Candidates, Pipeline,
  Job roles, Email templates, Preferences
- Footer: avatar initials "HR", name "HR Admin", role "Recruiter"
- Active item style: purple bg #EEEDFE, purple text #3C3489

### Topbar
- Left: page title "Analyse candidate CV"
- Right: History button (outline) + Run analysis button (purple #534AB7)
- Run analysis disabled until file uploaded

### Left column — controls

Card 1: Role selector
- Step circle "1" in purple
- Pill chips: Data analyst, Data scientist, Software engineer,
  ML engineer, Product manager
- Default selected: Data analyst (filled purple)
- Unselected: outline style
- Divider: "or paste custom job description"
- Textarea: placeholder "Paste any job description here…"

Card 2: Upload CV
- Step circle "2" in purple, sublabel "PDF · max 5 MB"
- Dashed upload zone, hover turns purple
- After upload: green border, checkmark, filename, step circle turns green
- Progress bar fills during upload with % text

### Right column — results

State 1 — Empty:
- Muted analytics icon centred
- "Results appear here after analysis"

State 2 — Loading:
- Purple spinner
- "Analysing with AI…"
- Step text cycles every 400ms:
  "Extracting CV text…" → "Parsing skills…" →
  "Running AI analysis…" → "Scoring against role…" →
  "Generating summary…"

State 3 — Results:

Verdict banner (rounded, full width):
- HIRE: green bg #E1F5EE, border #5DCAA5, checkmark icon,
  "Recommended to hire", reason, score % right aligned
- MAYBE: amber bg #FAEEDA, border #EF9F27, alert icon,
  "Manual review suggested"
- REJECT: red bg #FCEBEB, border #F09595, X icon,
  "Not recommended"

3 metric cards (grey bg, no border):
- Experience (e.g. "3 yrs")
- Skills matched (e.g. "7 / 9")
- Has projects ("Yes" green or "No" red)

Score breakdown card:
- 6 bar rows: name (130px) | track bar | percentage
- Bar colours: green ≥70%, amber 40-69%, red <40%
- Metrics: Technical skills, Achievements, Experience level,
  Certifications, Projects, Keyword match

Skills section (2 columns):
- Left: green checkmark + "Matched" + green pill tags
- Right: red X + "Missing" + red pill tags

AI summary card:
- Left purple border accent (2px solid #534AB7)
- Grey background, one paragraph from OpenAI

Action buttons (3, full width row):
- "Move to hire" — green bg #E1F5EE, text #085041
- "Hold for review" — grey outline, clock icon
- "Reject" — red bg #FCEBEB, text #791F1F

### Colours
- Purple: #534AB7 | Light purple bg: #EEEDFE | Purple text: #3C3489
- Green: #1D9E75 | Light green bg: #E1F5EE | Dark green text: #085041
- Amber: #BA7517 | Light amber bg: #FAEEDA
- Red: #E24B4A | Light red bg: #FCEBEB | Dark red text: #791F1F
- All neutrals via CSS vars: --color-background-primary/secondary,
  --color-text-primary/secondary, --color-border-tertiary

### Interactivity (session_state)
- selected_role: tracks active chip
- file_uploaded: enables Run analysis button
- analysis_result: stores OpenAI JSON response
- Each role shows different mock results if no real CV uploaded:
    Data analyst     → HIRE  78% 3yrs 7/9
    Data scientist   → MAYBE 61% 2yrs 5/9
    Software engineer→ REJECT 34% 1yr 3/9
    ML engineer      → MAYBE 55% 2yrs 4/9
    Product manager  → HIRE  82% 4yrs 8/9

### Implementation notes
- All custom CSS in single inject_css() function at top of app.py
- Use st.markdown() with unsafe_allow_html=True for chips, 
  verdict banner, skill tags, progress bar, sidebar styling
- Use st.session_state for all state management
- Use st.spinner() for loading state
- Use st.columns([1,1]) for main layout
- Never use st.form — use regular buttons with session_state

---

## Coming features (do not build yet — noted for later)
- **Google Sheets integration**: log every candidate result as a new row
  - Columns: name, email, role, match_score, verdict, date, missing_skills
  - Use gspread library + Google Service Account
- **Gmail automation**: send email to HIRE candidates automatically
  - Trigger only on HIRE verdict
  - Use gmail-api or smtplib
  - Email template stored in /templates/hire_email.txt
- **Candidate pipeline view**: table of all analysed candidates with filters
- **Batch upload**: upload multiple CVs at once
- **Multi-role comparison**: upload one CV, compare across multiple roles

---

## Coding rules — always follow these
1. Never put API keys in code — always use .env + python-dotenv
2. Never put AI logic in app.py — always goes in ai_client.py
3. Always wrap API calls in try/except with user-friendly error messages
4. Always extract PDF text in pdf_processor.py before sending to AI
5. Return safe fallback values if AI returns unexpected output
6. Use type hints on all functions
7. Keep functions short — one function, one job
8. Never auto-send emails without employer confirmation first

---

## How to run the app
```bash
# Install dependencies
pip install openai pdfplumber streamlit python-dotenv

# Add your OpenAI key to .env
echo "OPENAI_API_KEY=sk-your-key-here" > .env

# Run
streamlit run app.py
```

---

## How to swap AI provider (when ready)
Only ai_client.py needs to change. The function signature stays the same:

```python
def analyse_cv(cv_text: str, job_role: str, role_profile: dict) -> dict:
    # swap internals here only
```

Swap guide:
- OpenAI → Groq: change import + client + model name
- OpenAI → Gemini: change import + client + model name
- OpenAI → Claude: change import + client + model name + response field

---

## Developer context
- Student project — intermediate Python level
- Goal: portfolio piece that demonstrates real AI product thinking
- Existing credits: OpenAI
- Future plan: swap to free model (Groq/Gemini) once OpenAI credits run out
- Later extension: Google Sheets + Gmail automation (confirmed feature)
