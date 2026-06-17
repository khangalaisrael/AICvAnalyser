export type Verdict = "HIRE" | "MAYBE" | "REJECT";
export type PipelineStatus = "HIRE" | "HOLD" | "REJECT";
export type Role =
  | "Software Engineer"
  | "Data Scientist"
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

export interface CoachingGap {
  type: "skill" | "soft_skill" | "certification" | "project";
  item: string;
  impact: "high" | "medium" | "low";
  reason: string;
  action: string;
  rewrite_hint: string | null;
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
  experience_years: string;
  key_responsibilities: string[];
  current_market_trends: string[];
  certifications_or_qualifications: string[];
}

export interface AIResult {
  matched_skills: string[];
  missing_skills: string[];
  recommended_skills?: string[];
  years_experience: number;
  certifications: string[];
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
}
