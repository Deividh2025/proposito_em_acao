import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  icon: ReactNode;
};

export function IconButton({ className, icon, label, type = "button", ...props }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-control border border-ink-100 bg-white text-ink-700 transition duration-200 hover:bg-purpose-50 hover:text-purpose-900 disabled:cursor-not-allowed disabled:opacity-55",
        className
      )}
      type={type}
      {...props}
    >
      {icon}
    </button>
  );
}
