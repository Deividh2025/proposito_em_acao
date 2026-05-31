import type { LifeAreaSlug } from "@/domain/life-map";

export type AiSupportTone = "light" | "balanced" | "firm";
export type ChristianLayerPreference = "discreet" | "balanced" | "intense";
export type EnergyLevel = "low" | "medium" | "high" | "variable";

export type ProfileEssentialInput = {
  name: string;
  occupation: string;
  currentRoutine: string;
  mainResponsibilities: string;
  mainDifficulty: string;
  focusRelationship: string;
  habitualEnergy: EnergyLevel;
  disorderAreas: string;
  faithRelationship: string;
  familyContext: string;
  platformExpectation: string;
  aiSupportTone: AiSupportTone;
  christianLayerPreference: ChristianLayerPreference;
};

export type LifeMapAreaInput = {
  areaSlug: LifeAreaSlug;
  score: number;
  note?: string;
};

export type CallingQuestionKey =
  | "world_burden"
  | "pain_to_solve"
  | "people_to_serve"
  | "remembered_for"
  | "marking_experiences"
  | "gifts"
  | "core_values"
  | "responsibility_places"
  | "fruitful_life"
  | "faithful_contribution";

export type CallingAnswers = Record<CallingQuestionKey, string>;

export type OnboardingDraft = {
  profile: ProfileEssentialInput;
  lifeMap: LifeMapAreaInput[];
  callingAnswers: CallingAnswers;
  acceptedCallingDraft?: boolean;
  updatedAt: string;
};

export type OnboardingJourneyStatus = {
  profileCompleted: boolean;
  lifeMapCompleted: boolean;
  callingDraftCreated: boolean;
  completionPercent: number;
};
