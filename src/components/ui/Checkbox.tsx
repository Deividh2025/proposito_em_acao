import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
};

export function Checkbox({ className, label, ...props }: CheckboxProps) {
  return (
    <label className="flex items-start gap-3 text-sm font-medium text-ink-800">
      <input
        className={cn("mt-1 h-4 w-4 rounded border-ink-300 text-purpose-700", className)}
        type="checkbox"
        {...props}
      />
      <span>{label}</span>
    </label>
  );
}
