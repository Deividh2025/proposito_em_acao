import type { ComponentType, ReactNode } from "react";

export type DesignIntent =
  | "neutral"
  | "purpose"
  | "action"
  | "success"
  | "warning"
  | "danger"
  | "restart"
  | "lowEnergy";

export type DesignSize = "sm" | "md" | "lg";

export type DesignMode = {
  id: "standard" | "low-energy" | "restart";
  name: string;
  description: string;
  tone: string;
  interactionRules: string[];
};

export type NavigationItem = {
  label: string;
  href: string;
  description: string;
  status: "em preparação" | "base visual";
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
};

export type PlaceholderPageDefinition = {
  title: string;
  href: string;
  status: "em preparação";
  description: string;
  components: string[];
  nextStep: string;
  privacyNote?: string;
};

export type ComponentShellProps = {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
};
