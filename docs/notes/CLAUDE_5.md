# TalentScan — Project Memory

## What this is
AI CV analyser. Employer uploads PDF, selects role, gets HIRE/MAYBE/REJECT verdict with score breakdown.

## Stack
- Frontend: Streamlit (app.py)
- AI: OpenAI GPT-4o-mini (ai_client.py)
- PDF: pdfplumber (pdf_processor.py)
- Scoring: Pure Python (scoring_engine.py)
- Roles: role_profiles.py
- Config: config.py + .env

## File responsibilities
- app.py → UI only, no logic
- ai_client.py → OpenAI call only, returns JSON
- pdf_processor.py → PDF to text only
- scoring_engine.py → knockout filter + weighted score + verdict
- role_profiles.py → role definitions
- config.py → load .env keys

## Architecture
PDF → pdf_processor → ai_client → scoring_engine → app.py display

## Scoring weights
| Metric                | Weight |
|-----------------------|--------|
| Technical skill match | 25%    |
| Achievements          | 20%    |
| Experience            | 15%    |
| Recency               | 10%    |
| Certifications        | 10%    |
| Projects              | 10%    |
| Keywords              | 5%     |
| Soft skills           | 5%     |

## Verdicts
- 75–100 → HIRE
- 50–74  → MAYBE
- 0–49   → REJECT

## Knockout rule
3+ missing must-have skills → instant REJECT, skip scoring

## OpenAI JSON response schema
Return ONLY this JSON, no markdown, no backticks:
{
  "matched_skills": [],
  "missing_skills": [],
  "years_experience": 0,
  "has_projects": false,
  "has_metrics": false,
  "certifications": [],
  "match_score": 0,
  "keyword_alignment": 0,
  "soft_skills_evidence": false,
  "ai_summary": ""
}

## Role profiles
Data Analyst: must=[SQL, Excel, Data Visualisation] nice=[Power BI, Python, Tableau] min=1yr
Data Scientist: must=[Python, Machine Learning, Statistics] nice=[TensorFlow, R, Spark] min=2yr
Software Engineer: must=[Git, Data Structures, Algorithms] nice=[Docker, AWS, CI/CD] min=1yr
ML Engineer: must=[Python, Machine Learning, Model Deployment] nice=[Kubeflow, MLflow, Airflow] min=2yr
Product Manager: must=[Roadmapping, Stakeholder Management, Analytics] nice=[SQL, Figma] min=2yr

## UI (app.py)
Colours: purple=#534AB7 green=#1D9E75 amber=#BA7517 red=#E24B4A
Light bgs: purple=#EEEDFE green=#E1F5EE amber=#FAEEDA red=#FCEBEB
Dark text: purple=#3C3489 green=#085041 red=#791F1F

Layout:
- st.sidebar → brand + nav + user footer
- st.columns([1,1]) → left controls, right results
- All CSS in inject_css() at top of app.py

Left column:
- Role chips (pill buttons, active=filled purple)
- Custom job description textarea
- PDF upload zone (dashed → green on upload)
- Run analysis button (disabled until file uploaded)

Right column:
- Empty state → muted icon + "Results appear here"
- Loading → spinner + cycling step text
- Results → verdict banner + metrics + score bars + skill tags + AI summary + action buttons

Verdict banner colours:
- HIRE: bg=#E1F5EE border=#5DCAA5 text=#085041
- MAYBE: bg=#FAEEDA border=#EF9F27 text=#633806
- REJECT: bg=#FCEBEB border=#F09595 text=#791F1F

Score bar colours: ≥70%=green 40-69%=amber <40%=red

## Coding rules
1. API keys only in .env, never in code
2. AI logic only in ai_client.py
3. Always try/except around API calls
4. Trim cv_text to 3000 chars before sending
5. max_tokens=2000 in OpenAI call
6. Type hints on all functions
7. Never st.form — use session_state + buttons

## Coming later (do not build yet)
- Google Sheets logging (gspread)
- Gmail automation (gmail-api)
- Candidate pipeline view
- Batch CV upload

## Run command
py -m streamlit run app.py

## Swap AI provider
Only change ai_client.py — function signature stays the same:
def analyse_cv(cv_text: str, job_role: str, role_profile: dict) -> dict
