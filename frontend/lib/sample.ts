import type { CVChecklist } from "@/lib/types";

/** A made-up report used only to illustrate the product on the landing page. */
export const SAMPLE = {
  role: "Data Analyst",
  score: 78,
  components: [
    { label: "Technical skill match", value: 0.82 },
    { label: "Quantifiable achievements", value: 0.71 },
    { label: "Keyword alignment", value: 0.64 },
  ],
  matched: ["Python", "Excel", "Data visualisation", "Stakeholder reporting"],
  inferred: ["Data cleaning", "ETL basics"],
  gaps: {
    must: ["SQL"],
    nice: ["Power BI", "A/B testing"],
    edge: ["dbt"],
  },
  trending: [
    "Cloud data warehouses (BigQuery, Snowflake)",
    "SQL as a baseline expectation",
    "Dashboards that tell a story, not just charts",
  ],
  checklist: {
    has_quantified_achievements: true,
    has_action_verbs: true,
    has_contact_info: true,
    has_linkedin: false,
    has_github: false,
    word_count_ok: true,
    word_count: 640,
    has_skills_section: true,
    has_profile_summary: false,
    ats_score: 70,
  } as CVChecklist,
};
