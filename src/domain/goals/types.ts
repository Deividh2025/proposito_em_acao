export type GoalStatus = "draft" | "active" | "paused" | "completed" | "abandoned" | "needs_review";

export type CallingAlignmentLevel = "low" | "medium" | "high";

export type SmartEGoalDraft = {
  title: string;
  status: GoalStatus;
  lifeArea: string;
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timebound: string;
  ecologicalAnalysis: {
    risks: string[];
    protectedAreas: string[];
    adjustments: string[];
    isEcologicallySafe: boolean;
  };
  callingAlignment: {
    alignmentLevel: CallingAlignmentLevel;
    explanation: string;
    concerns: string[];
  };
  firstAction: string;
  suggestedProjects: string[];
};

export type GoalShareScope =
  | "goal_status"
  | "progress_summary"
  | "milestones"
  | "authorized_delay"
  | "help_request"
  | "limited_scoreboard"
  | "commitment_document";
