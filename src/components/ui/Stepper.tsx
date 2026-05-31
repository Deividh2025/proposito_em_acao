type Step = {
  label: string;
  status: "done" | "current" | "upcoming";
};

type StepperProps = {
  steps: Step[];
};

export function Stepper({ steps }: StepperProps) {
  return (
    <ol className="grid gap-2 sm:grid-cols-3">
      {steps.map((step, index) => (
        <li
          className="rounded-card border border-ink-100 bg-white p-3 text-sm"
          key={`${step.label}-${index}`}
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-500">
            Passo {index + 1}
          </span>
          <span className="mt-1 block font-bold text-ink-900">{step.label}</span>
          <span className="mt-1 block text-xs text-purpose-700">{step.status}</span>
        </li>
      ))}
    </ol>
  );
}
