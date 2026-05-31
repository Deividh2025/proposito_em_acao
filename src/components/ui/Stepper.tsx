type Step = {
  label: string;
  status: "done" | "current" | "upcoming";
  description?: string;
};

type StepperProps = {
  steps: Step[];
};

export function Stepper({ steps }: StepperProps) {
  return (
    <ol className="grid gap-2 sm:grid-cols-3">
      {steps.map((step, index) => (
        <li
          aria-current={step.status === "current" ? "step" : undefined}
          className={[
            "rounded-card border p-3 text-sm",
            step.status === "current"
              ? "border-purpose-300 bg-purpose-50"
              : step.status === "done"
                ? "border-action-100 bg-action-50"
                : "border-ink-100 bg-white"
          ].join(" ")}
          key={`${step.label}-${index}`}
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-500">
            Passo {index + 1}
          </span>
          <span className="mt-1 block font-bold text-ink-900">{step.label}</span>
          {step.description ? (
            <span className="mt-1 block text-xs leading-5 text-ink-600">{step.description}</span>
          ) : null}
          <span className="mt-1 block text-xs font-semibold text-purpose-700">
            {step.status === "done" ? "Concluido" : step.status === "current" ? "Agora" : "Proximo"}
          </span>
        </li>
      ))}
    </ol>
  );
}
