export type Verdict = "HIRE" | "MAYBE" | "REJECT";

/* ── CV Rewrite types ──────────────────────────────────────────────────── */

export interface LedgerBullet {
  id: string;
  text: string;
}

export interface LedgerExperience {
  id: string;
  title: string;
  org: string;
  start: string;
  end: string;
  bullets: LedgerBullet[];
}

export interface LedgerEducation {
  id: string;
  qualification: string;
  institution: string;
  year: string;
}

export interface LedgerProject {
  id: string;
  name: string;
  bullets: LedgerBullet[];
}

export interface LedgerContact {
  name: string;
  email: string;
  phone: string;
  location: string;
  links: string[];
}

export interface CVLedger {
  contact: LedgerContact;
  summary: string;
  experience: LedgerExperience[];
  education: LedgerEducation[];
  skills: string[];
  projects: LedgerProject[];
}

export interface RewrittenBullet extends LedgerBullet {
  source_ids: string[];
  needs_metric: boolean;
  metric_prompt: string | null;
}

export interface RewrittenExperience extends Omit<LedgerExperience, "bullets"> {
  bullets: RewrittenBullet[];
}

export interface RewrittenProject extends Omit<LedgerProject, "bullets"> {
  bullets: RewrittenBullet[];
}

export interface RewrittenCVLedger extends Omit<CVLedger, "experience" | "projects"> {
  experience: RewrittenExperience[];
  projects: RewrittenProject[];
}

export interface MetricPrompt {
  bullet_id: string;
  question: string;
  context: string;
  section: string;
}

export interface StructureResponse {
  ledger: CVLedger;
  cv_text: string;
  ats_score_before: number;
  cv_checklist_before: CVChecklist;
}

export interface GenerateRewriteResponse {
  rewritten: RewrittenCVLedger;
  metric_prompts: MetricPrompt[];
  verified: boolean;
  flagged_items: string[];
  ats_score_before: number;
  ats_score_after: number;
  cv_checklist_before: CVChecklist;
  cv_checklist_after: CVChecklist;
}
export type PipelineStatus = "HIRE" | "HOLD" | "REJECT";
export type UserMode = "job_seeker" | "professional";
export type SeniorityLevel = "Entry-level" | "Junior" | "Mid-level" | "Senior";
export type EmployabilityTier =
  | "required_for_employability"
  | "helpful_for_competitiveness"
  | "exceptional_differentiator";

export type Role =
  | "Software Engineer"
  | "Data Scientist"
  | "Data Analyst"
  | "ML Engineer"
  | "Product Manager"
  | "UX Designer"
  | "DevOps Engineer"
  | "Business Analyst";

// From GET /candidates (sidebar list)
export interface CandidateSummary {
  id: string;
  name: string;
  role: string;
  score: number;
  verdict: Verdict;
  pipeline_status: PipelineStatus | null;
  initials: string;
}

export interface SkillRoadmap {
  timeline: string;
  steps: string[];
  milestone: string;
}

export interface CoachingGap {
  type: "skill" | "soft_skill" | "certification" | "project";
  item: string;
  impact: "high" | "medium" | "low";
  employability_tier?: EmployabilityTier;
  reason: string;
  action: string;
  rewrite_hint: string | null;
  learning_path?: string;
}

export interface CoachingResult {
  priority_gaps: CoachingGap[];
  quick_wins: string[];
  longer_term: string[];
  overall_coaching_summary: string;
  score_delta?: number;
  score_delta_item?: string;
}

export interface ResearchedRole {
  role_title: string;
  seniority_level: string;
  required_skills: string[];
  nice_to_have_skills: string[];
  competitive_advantage_skills?: string[];
  experience_years: string;
  key_responsibilities: string[];
  current_market_trends: string[];
  certifications_or_qualifications: string[];
}

export interface SkillTierMatch {
  must_have_matched: string[];
  strongly_expected_matched: string[];
  nice_to_have_matched: string[];
  competitive_advantage_matched: string[];
}

export interface CVChecklist {
  has_quantified_achievements: boolean;
  has_action_verbs: boolean;
  has_contact_info: boolean;
  has_linkedin: boolean;
  has_github: boolean;
  word_count_ok: boolean;
  word_count: number;
  has_skills_section: boolean;
  has_profile_summary: boolean;
  ats_score: number;
}

export interface AIResult {
  matched_skills: string[];
  missing_skills: string[];
  recommended_skills?: string[];
  inferred_skills?: string[];
  unique_strengths?: string[];
  years_experience: number;
  certifications: string[];
  seniority_level?: SeniorityLevel;
  skill_tier_match?: SkillTierMatch;
  trending_for_role?: string[];
  trending_narrative?: string;
  reasoning?: string;
  career_advice?: string;
  ai_summary: string;
  match_score?: number;
  keyword_alignment?: number;
  has_projects?: boolean;
  has_metrics?: boolean;
  soft_skills_evidence?: boolean;
  coaching?: CoachingResult | null;
}

export interface ScoringResult {
  verdict: Verdict;
  knockout: boolean;
  final_score: number;
  component_scores?: Record<string, number>;
  experience_flag?: boolean;
  experience_flag_message?: string;
  knockout_reason?: string;
}

// From GET /candidates/{id} and POST /analyse
export interface CandidateDetail {
  id: string;
  candidate_name: string;
  role: string;
  ai: AIResult;
  scoring: ScoringResult;
  pipeline_status: PipelineStatus | null;
  researched_role?: ResearchedRole;
  cv_checklist?: CVChecklist;
  user_mode?: UserMode;
}
