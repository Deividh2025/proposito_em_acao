export type MetacognitionPrivacyLevel = "private" | "manual_summary_only";

export type MetacognitionFrame = {
  fact?: string;
  interpretation?: string;
  feeling?: string;
  impulse?: string;
  nextAction?: string;
};
