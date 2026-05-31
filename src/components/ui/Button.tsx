import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";
import type { DesignIntent, DesignSize } from "@/types/design";

type ButtonVariant = "solid" | "soft" | "outline" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  intent?: Extract<DesignIntent, "purpose" | "action" | "neutral" | "warning" | "danger">;
  size?: DesignSize;
  variant?: ButtonVariant;
};

const sizeClasses: Record<DesignSize, string> = {
  sm: "min-h-9 px-3 text-xs",
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-5 text-base"
};

const variantClasses: Record<ButtonVariant, Record<NonNullable<ButtonProps["intent"]>, string>> = {
  solid: {
    purpose: "bg-purpose-700 text-white hover:bg-purpose-900",
    action: "bg-action-700 text-white hover:bg-action-900",
    neutral: "bg-ink-900 text-white hover:bg-ink-700",
    warning: "bg-warmth-700 text-white hover:bg-warmth-900",
    danger: "bg-gentleDanger-500 text-white hover:bg-gentleDanger-700"
  },
  soft: {
    purpose: "bg-purpose-50 text-purpose-900 hover:bg-purpose-100",
    action: "bg-action-50 text-action-900 hover:bg-action-100",
    neutral: "bg-ink-50 text-ink-900 hover:bg-ink-100",
    warning: "bg-warmth-50 text-warmth-900 hover:bg-warmth-100",
    danger: "bg-gentleDanger-50 text-gentleDanger-900 hover:bg-gentleDanger-100"
  },
  outline: {
    purpose: "border-purpose-300 text-purpose-900 hover:bg-purpose-50",
    action: "border-action-100 text-action-900 hover:bg-action-50",
    neutral: "border-ink-300 text-ink-900 hover:bg-ink-50",
    warning: "border-warmth-100 text-warmth-900 hover:bg-warmth-50",
    danger: "border-gentleDanger-100 text-gentleDanger-900 hover:bg-gentleDanger-50"
  },
  ghost: {
    purpose: "text-purpose-900 hover:bg-purpose-50",
    action: "text-action-900 hover:bg-action-50",
    neutral: "text-ink-700 hover:bg-ink-50",
    warning: "text-warmth-900 hover:bg-warmth-50",
    danger: "text-gentleDanger-900 hover:bg-gentleDanger-50"
  }
};

export function Button({
  className,
  intent = "purpose",
  size = "md",
  type = "button",
  variant = "solid",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-control border border-transparent font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-55",
        sizeClasses[size],
        variantClasses[variant][intent],
        className
      )}
      type={type}
      {...props}
    />
  );
}
