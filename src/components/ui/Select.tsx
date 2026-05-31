import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn("min-h-11 w-full rounded-control border border-ink-300 bg-white px-3 text-sm font-medium text-ink-900 disabled:cursor-not-allowed disabled:bg-ink-50 disabled:text-ink-500", className)}
      {...props}
    >
      {children}
    </select>
  );
}
