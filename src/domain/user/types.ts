export type OnboardingStatus = "not_started" | "in_progress" | "completed";
export type ChristianLayerIntensity = "off" | "light" | "balanced" | "strong";

export type ProfileSummary = {
  id: string;
  displayName: string | null;
  timezone: string;
  onboardingStatus: OnboardingStatus;
  christianLayerIntensity: ChristianLayerIntensity;
};
