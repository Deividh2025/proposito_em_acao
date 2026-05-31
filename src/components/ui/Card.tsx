import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: "article" | "aside" | "section" | "div";
};

export function Card({ as: Element = "article", className, ...props }: CardProps) {
  return (
    <Element
      className={cn("rounded-card border border-ink-100 bg-white p-4 shadow-sm", className)}
      {...props}
    />
  );
}
