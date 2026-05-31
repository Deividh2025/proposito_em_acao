import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

export function Panel({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn("rounded-panel border border-ink-100 bg-white/86 p-5 shadow-soft", className)}
      {...props}
    />
  );
}
