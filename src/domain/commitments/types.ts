import type { CommitmentDocumentOutput } from "@/ai/schemas";
import type { AccountabilityPermission } from "@/domain/accountability";

export type CommitmentLeverType = "progress_reward" | "completion_reward" | "restorative_consequence";
export type CommitmentLeverSafety = "safe" | "needs_review" | "blocked";

export type CommitmentLever = {
  type: CommitmentLeverType;
  description: string;
  safety: CommitmentLeverSafety;
  notes: string[];
};

export type CommitmentDocumentDraft = {
  document: CommitmentDocumentOutput;
  levers: CommitmentLever[];
  privacyNotice: string;
  sharingPermissions: AccountabilityPermission[];
};
