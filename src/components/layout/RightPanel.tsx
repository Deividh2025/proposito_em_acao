import { ShieldCheck } from "lucide-react";

import { designModes } from "@/lib/design/modes";

export function RightPanel() {
  return (
    <aside className="sticky top-4 ml-4 flex h-[calc(100vh-2rem)] flex-col gap-4 overflow-y-auto rounded-panel border border-ink-100 bg-white/82 p-4 shadow-soft">
      <section aria-labelledby="support-modes-heading" className="space-y-3">
        <h2 id="support-modes-heading" className="text-sm font-bold text-ink-900">
          Modos de apoio
        </h2>
        {[designModes.lowEnergy, designModes.restart].map((mode) => (
          <article className="rounded-card border border-ink-100 bg-ink-50 p-3" key={mode.id}>
            <h3 className="text-sm font-semibold text-ink-900">{mode.name}</h3>
            <p className="mt-1 text-xs leading-5 text-ink-600">{mode.description}</p>
          </article>
        ))}
      </section>

      <section
        aria-labelledby="privacy-panel-heading"
        className="mt-auto rounded-card border border-purpose-100 bg-purpose-50 p-3 text-sm text-purpose-900"
      >
        <ShieldCheck aria-hidden className="h-5 w-5" />
        <h2 id="privacy-panel-heading" className="mt-2 font-bold">
          Privacidade primeiro
        </h2>
        <p className="mt-1 text-xs leading-5">
          Metacognição, Chamado completo, revisões e dados íntimos continuam privados por
          padrão. Atalaia só entra por alvo e consentimento.
        </p>
      </section>
    </aside>
  );
}
