import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn("min-h-28 w-full rounded-control border border-ink-300 bg-white px-3 py-2 text-sm leading-6 text-ink-900 placeholder:text-ink-500 disabled:cursor-not-allowed disabled:bg-ink-50 disabled:text-ink-500", className)}
      {...props}
    />
  );
}
