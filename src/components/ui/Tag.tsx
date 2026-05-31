import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

export function Tag({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("inline-flex items-center rounded-control border border-ink-100 bg-white px-2.5 py-1 text-xs font-semibold text-ink-600", className)}
      {...props}
    />
  );
}
