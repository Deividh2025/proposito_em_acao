import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn("min-h-11 w-full rounded-control border border-ink-300 bg-white px-3 text-sm text-ink-900 placeholder:text-ink-500 disabled:cursor-not-allowed disabled:bg-ink-50 disabled:text-ink-500", className)}
      {...props}
    />
  );
}
