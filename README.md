# TalentScan AI CV Analyzer

TalentScan is an AI-powered recruitment assistant that helps employers evaluate candidate CVs against job requirements. Upload a CV in PDF format, select a job role or provide a custom job description, and receive an AI-generated hiring recommendation with detailed scoring and insights.

## Features

* Upload candidate CVs in PDF format
* Extract and analyze CV content automatically
* Select predefined job roles or provide a custom job description
* AI-powered candidate evaluation using OpenAI GPT-4o-mini
* Hire / Maybe / Reject recommendations
* Weighted candidate scoring system
* Detailed skill gap analysis
* AI-generated candidate summaries
* Professional Streamlit interface
* Modular architecture for easy AI provider swapping

## Demo Workflow

1. Upload a candidate CV (PDF).
2. Select a predefined role or paste a custom job description.
3. Run the analysis.
4. Receive:

   * Overall match score
   * Hiring recommendation
   * Matched skills
   * Missing skills
   * Experience evaluation
   * AI-generated candidate summary

## Tech Stack

| Component              | Technology         |
| ---------------------- | ------------------ |
| Frontend               | Streamlit          |
| AI Model               | OpenAI GPT-4o-mini |
| PDF Processing         | pdfplumber         |
| Environment Management | python-dotenv      |
| Language               | Python 3.10+       |

## Project Architecture

```text
PDF Upload
    ↓
pdf_processor.py
    ↓
ai_client.py
    ↓
scoring_engine.py
    ↓
Streamlit UI
```

### File Structure

```text
talentscan/
├── app.py
├── pdf_processor.py
├── ai_client.py
├── scoring_engine.py
├── role_profiles.py
├── config.py
├── requirements.txt
├── .env
└── README.md
```

## Scoring System

### Knockout Filter

Candidates are automatically rejected if:

* Three or more required skills are missing

Candidates below the minimum experience requirement are flagged for review but are not automatically rejected.

### Weighted Scorecard

| Metric                    | Weight |
| ------------------------- | ------ |
| Technical Skill Match     | 25%    |
| Quantifiable Achievements | 20%    |
| Years of Experience       | 15%    |
| Recency of Skills         | 10%    |
| Certifications            | 10%    |
| Projects / Portfolio      | 10%    |
| Keyword Alignment         | 5%     |
| Soft Skills Evidence      | 5%     |

### Hiring Thresholds

| Score Range | Verdict |
| ----------- | ------- |
| 75–100      | Hire    |
| 50–74       | Maybe   |
| 0–49        | Reject  |

## Supported Job Roles

### Data Analyst

Required:

* SQL
* Excel
* Data Visualisation

Preferred:

* Power BI
* Python
* Tableau

### Data Scientist

Required:

* Python
* Machine Learning
* Statistics

Preferred:

* TensorFlow
* R
* SQL
* Spark

### Software Engineer

Required:

* Git
* Data Structures
* Algorithms

Preferred:

* Docker
* AWS
* CI/CD

### Machine Learning Engineer

Required:

* Python
* Machine Learning
* Model Deployment

Preferred:

* Kubeflow
* MLflow
* Airflow
* Kafka

### Product Manager

Required:

* Roadmapping
* Stakeholder Management
* Analytics

Preferred:

* SQL
* Figma
* A/B Testing

## Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/talentscan.git
cd talentscan
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file:

```env
OPENAI_API_KEY=your_api_key_here
```

Run the application:

```bash
streamlit run app.py
```

## Example AI Response

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
  "ai_summary": "Candidate shows strong analytical foundations and relevant experience."
}
```

## Future Enhancements

* Batch CV uploads
* Candidate ranking dashboard
* Multi-role candidate comparison
* Google Sheets integration
* Gmail automation for shortlisted candidates
* Downloadable candidate reports
* ATS-style candidate tracking

## Security Notes

* API keys are stored using environment variables
* `.env` files should never be committed to GitHub
* AI responses are validated before processing
* Error handling prevents application crashes from malformed model output

## Why This Project?

TalentScan was built as a portfolio project to demonstrate:

* Applied AI product development
* Prompt engineering
* OpenAI API integration
* PDF document processing
* Modular software architecture
* Real-world recruitment workflow automation

This project showcases how AI can streamline candidate screening while maintaining transparency through structured scoring and explainable recommendations.

<img width="1771" height="871" alt="image" src="https://github.com/user-attachments/assets/cc3a4250-3af9-47c1-abce-f7d906c405c4" />
<img width="1747" height="823" alt="image" src="https://github.com/user-attachments/assets/3f0d90e9-e544-4bb1-9120-8f3f0f99ed90" />
