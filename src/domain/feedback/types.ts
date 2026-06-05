export type BetaFeedbackModule = (typeof betaFeedbackModules)[number];

export type BetaFeedbackDraft = {
  mode: "local-draft";
  module: BetaFeedbackModule;
  hasSensitiveHint: boolean;
  message: string;
};

export type BetaFeedbackPersistenceBlockReason =
  | "missing_consent"
  | "sensitive_hint"
  | "validation_error";

export type PersistableBetaFeedback = {
  module: BetaFeedbackModule;
  worked: string;
  confused: string;
  blocked: string;
  clarityScore: number;
  usefulnessScore: number;
  frictionScore: number;
  comment: string | null;
  consentVersion: string;
  noticeAccepted: true;
  submittedAt: string;
  expiresAt: string;
};

export type BetaFeedbackPersistenceResult =
  | {
      ok: true;
      feedback: PersistableBetaFeedback;
      reason: null;
      message: string;
    }
  | {
      ok: false;
      feedback: null;
      reason: BetaFeedbackPersistenceBlockReason;
      message: string;
    };

export type PersistBetaFeedbackActionResult = {
  ok: boolean;
  mode: "supabase" | "local-draft";
  message: string;
  id?: string;
};

export type PersistBetaFeedbackAction = (
  payload: PersistableBetaFeedback
) => Promise<PersistBetaFeedbackActionResult>;

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
