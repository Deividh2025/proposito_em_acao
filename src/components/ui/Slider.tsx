import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type SliderProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
};

export function Slider({ className, label, ...props }: SliderProps) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-ink-900">
      {label}
      <input className={cn("w-full accent-action-700", className)} type="range" {...props} />
    </label>
  );
}
