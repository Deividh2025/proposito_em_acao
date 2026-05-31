export type CallingStatus = "draft" | "in_discernment" | "active" | "archived";

export type CallingSummary = {
  id: string;
  status: CallingStatus;
  statement: string | null;
  hypothesis: string | null;
};
