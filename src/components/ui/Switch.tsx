import type { InputHTMLAttributes } from "react";

type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  description?: string;
};

export function Switch({ description, label, ...props }: SwitchProps) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-card border border-ink-100 bg-white p-3">
      <span>
        <span className="block text-sm font-semibold text-ink-900">{label}</span>
        {description ? <span className="mt-1 block text-xs leading-5 text-ink-500">{description}</span> : null}
      </span>
      <input className="h-5 w-9 accent-purpose-700" type="checkbox" role="switch" {...props} />
    </label>
  );
}
