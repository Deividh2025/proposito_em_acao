export const aiBlockedBehaviors = [
  "diagnosis",
  "therapy_replacement",
  "specific_divine_will_claim",
  "spiritual_guilt",
  "humiliation",
  "harmful_punishment",
  "unconsented_private_sharing",
  "crisis_as_productivity"
] as const;

export type AiBlockedBehavior = (typeof aiBlockedBehaviors)[number];
