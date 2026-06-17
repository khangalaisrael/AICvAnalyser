from typing import TypedDict


class RoleProfile(TypedDict):
    must_have: list[str]
    strongly_expected: list[str]
    nice_to_have: list[str]
    competitive_advantage: list[str]
    relevant_certifications: list[str]
    min_experience_years: int


ROLE_PROFILES: dict[str, RoleProfile] = {
    "Data Analyst": {
        "must_have": ["SQL", "Excel", "Data Visualisation"],
        "strongly_expected": ["Python", "Power BI or Tableau", "Data Cleaning"],
        "nice_to_have": ["Statistics", "ETL Pipelines", "Git"],
        "competitive_advantage": ["dbt", "Spark", "Cloud (AWS/GCP/Azure)", "Airflow"],
        "relevant_certifications": ["Google Data Analytics", "Microsoft PL-300 (Power BI)", "AWS Cloud Practitioner"],
        "min_experience_years": 1,
    },
    "Data Scientist": {
        "must_have": ["Python", "Machine Learning", "Statistics"],
        "strongly_expected": ["Pandas", "Scikit-learn", "SQL", "Data Visualisation"],
        "nice_to_have": ["Deep Learning", "NLP", "R", "Spark"],
        "competitive_advantage": ["TensorFlow or PyTorch", "MLflow", "Feature Engineering", "Causal Inference"],
        "relevant_certifications": ["Google Professional ML Engineer", "AWS Machine Learning Specialty", "DeepLearning.AI specialisations"],
        "min_experience_years": 2,
    },
    "Software Engineer": {
        "must_have": ["Git", "Data Structures", "Algorithms"],
        "strongly_expected": ["At least one backend language (Python/Java/Go/Node)", "REST APIs", "SQL or NoSQL"],
        "nice_to_have": ["Docker", "CI/CD", "Testing (unit/integration)", "Cloud (AWS/GCP/Azure)"],
        "competitive_advantage": ["Kubernetes", "System Design", "Open Source Contributions", "Distributed Systems"],
        "relevant_certifications": ["AWS Solutions Architect", "Google Associate Cloud Engineer", "Certified Kubernetes Application Developer"],
        "min_experience_years": 1,
    },
    "ML Engineer": {
        "must_have": ["Python", "Machine Learning", "Model Deployment"],
        "strongly_expected": ["MLOps", "Docker", "REST APIs", "Cloud (AWS/GCP/Azure)"],
        "nice_to_have": ["Kubernetes", "Airflow", "Kafka", "Feature Stores"],
        "competitive_advantage": ["Kubeflow", "MLflow", "Ray", "Real-time Inference Pipelines"],
        "relevant_certifications": ["Google Professional ML Engineer", "AWS Machine Learning Specialty", "MLflow Certified"],
        "min_experience_years": 2,
    },
    "Product Manager": {
        "must_have": ["Roadmapping", "Stakeholder Management", "Analytics"],
        "strongly_expected": ["User Research", "Agile/Scrum", "A/B Testing", "Prioritisation Frameworks"],
        "nice_to_have": ["SQL", "Figma", "Go-to-Market Strategy", "OKR Frameworks"],
        "competitive_advantage": ["Technical Background", "Growth Product Experience", "AI/ML Product Knowledge"],
        "relevant_certifications": ["Certified Scrum Product Owner (CSPO)", "Product School CPM", "Google Project Management"],
        "min_experience_years": 2,
    },
}


def get_role_names() -> list[str]:
    return list(ROLE_PROFILES.keys())


def get_profile(role_name: str) -> RoleProfile | None:
    return ROLE_PROFILES.get(role_name)
