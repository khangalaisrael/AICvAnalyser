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
- Two-column layout: left = controls, right = results
- Left column:
  - Role selector (pill/chip buttons for each role)
  - Divider with "or paste job description"
  - Text area for custom job description
  - PDF uploader
  - "Run analysis" button (disabled until file uploaded)
- Right column:
  - Empty state before analysis
  - Loading spinner with step messages during analysis
  - Results: verdict banner, 3 metric cards, score bars, skill tags, AI summary
  - Action buttons: Move to hire / Hold for review / Reject

Keep the UI clean and professional. Use Streamlit columns, st.metric,
st.progress, and st.success/warning/error for verdict colours.

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
