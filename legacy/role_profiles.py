from typing import TypedDict


class RoleProfile(TypedDict):
    must_have: list[str]
    nice_to_have: list[str]
    min_experience_years: int


ROLE_PROFILES: dict[str, RoleProfile] = {
    "Data Analyst": {
        "must_have": ["SQL", "Excel", "Data Visualisation"],
        "nice_to_have": ["Power BI", "Python", "Tableau"],
        "min_experience_years": 1,
    },
    "Data Scientist": {
        "must_have": ["Python", "Machine Learning"],
        "nice_to_have": ["TensorFlow", "R", "SQL", "Spark"],
        "min_experience_years": 2,
    },
    "Software Engineer": {
        "must_have": ["Git", "Data Structures", "Algorithms"],
        "nice_to_have": ["Docker", "AWS", "CI/CD"],
        "min_experience_years": 1,
    },
    "ML Engineer": {
        "must_have": ["Python", "Machine Learning", "Model Deployment"],
        "nice_to_have": ["Kubeflow", "MLflow", "Airflow", "Kafka"],
        "min_experience_years": 2,
    },
    "Product Manager": {
        "must_have": ["Roadmapping", "Stakeholder Management", "Analytics"],
        "nice_to_have": ["SQL", "Figma", "A/B Testing"],
        "min_experience_years": 2,
    },
}


def get_role_names() -> list[str]:
    return list(ROLE_PROFILES.keys())


def get_profile(role_name: str) -> RoleProfile | None:
    return ROLE_PROFILES.get(role_name)
