import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";
import type { DesignIntent } from "@/types/design";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  intent?: DesignIntent;
};

const badgeClasses: Record<DesignIntent, string> = {
  neutral: "bg-ink-50 text-ink-700",
  purpose: "bg-purpose-50 text-purpose-900",
  action: "bg-action-50 text-action-900",
  success: "bg-purpose-100 text-purpose-900",
  warning: "bg-warmth-50 text-warmth-900",
  danger: "bg-gentleDanger-50 text-gentleDanger-900",
  restart: "bg-warmth-50 text-warmth-900",
  lowEnergy: "bg-action-50 text-action-900"
};

export function Badge({ className, intent = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", badgeClasses[intent], className)}
      {...props}
    />
  );
}
