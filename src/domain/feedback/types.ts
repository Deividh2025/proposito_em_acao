export type BetaFeedbackModule = (typeof betaFeedbackModules)[number];

export type BetaFeedbackDraft = {
  mode: "local-draft";
  module: BetaFeedbackModule;
  hasSensitiveHint: boolean;
  message: string;
};

export const betaFeedbackModules = [
  "onboarding",
  "dashboard",
  "calling",
  "goals",
  "projects",
  "tasks",
  "calendar",
  "inbox",
  "action-unblocker",
  "metacognition",
  "focus",
  "habits",
  "scoreboard",
  "weekly-review",
  "garden",
  "accountability",
  "mobile",
  "support",
  "other"
] as const;
