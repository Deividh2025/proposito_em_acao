import type { InputHTMLAttributes } from "react";

type RadioOption = {
  label: string;
  value: string;
  description?: string;
};

type RadioGroupProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value"> & {
  legend: string;
  name: string;
  options: RadioOption[];
  value?: string;
};

export function RadioGroup({ legend, name, options, value, ...props }: RadioGroupProps) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-bold text-ink-900">{legend}</legend>
      <div className="grid gap-2">
        {options.map((option) => (
          <label
            className="flex items-start gap-3 rounded-card border border-ink-100 bg-white p-3 text-sm text-ink-800"
            key={option.value}
          >
            <input
              className="mt-1 h-4 w-4 border-ink-300 text-purpose-700"
              defaultChecked={value === option.value}
              name={name}
              type="radio"
              value={option.value}
              {...props}
            />
            <span>
              <span className="block font-semibold">{option.label}</span>
              {option.description ? (
                <span className="mt-1 block text-xs leading-5 text-ink-500">{option.description}</span>
              ) : null}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
