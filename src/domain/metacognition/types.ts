export type MetacognitionPrivacyLevel = "private" | "manual_summary_only";
export type MetacognitionCategory =
  | "anxiety"
  | "anguish"
  | "procrastination"
  | "paralysis"
  | "perfectionism"
  | "rumination"
  | "guilt"
  | "victimization"
  | "anger"
  | "fear"
  | "confusion"
  | "avoidance"
  | "overload"
  | "low_energy"
  | "other";

export type MetacognitionFrame = {
  fact?: string;
  interpretation?: string;
  feeling?: string;
  impulse?: string;
  nextAction?: string;
};

export type MetacognitionInput = {
  stateText: string;
  intensity: number;
  automaticThought: string;
  impulse: string;
  allowChristianAnchor: boolean;
  relatedTaskId?: string;
  relatedProjectId?: string;
  relatedGoalId?: string;
};
