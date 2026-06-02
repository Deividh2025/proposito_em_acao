export type EnergyLevel = "low" | "medium" | "high";

export type EnergyCheckInSource = "mobile" | "focus" | "daily_checkin" | "manual";

export type EnergyAdjustment = {
  label: string;
  suggestion: string;
  nextRoute: string;
  tone: "low-energy" | "steady" | "expansive";
};
