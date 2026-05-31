import type { ReactNode } from "react";

type TooltipProps = {
  children: ReactNode;
  tip: string;
};

export function Tooltip({ children, tip }: TooltipProps) {
  return (
    <span className="inline-flex items-center gap-2">
      {children}
      <span className="rounded-control bg-ink-900 px-2 py-1 text-xs font-medium text-white" role="tooltip">
        {tip}
      </span>
    </span>
  );
}
