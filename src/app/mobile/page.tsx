import Link from "next/link";

export const dynamic = "force-dynamic";

import { persistPreparedBetaFeedbackAction } from "@/app/settings/actions";
import { FeedbackButton } from "@/components/feedback/FeedbackButton";
import { MobileQuickActionGrid } from "@/components/mobile/MobileQuickActionGrid";
import { MobileShell } from "@/components/mobile/MobileShell";
import { getRealIntegrationFlags } from "@/lib/config";

export default function MobileHomePage() {
  const { feedback } = getRealIntegrationFlags();

  return (
    <MobileShell
      showBack={false}
      subtitle="Abrir, tocar, registrar e fechar. O desktop continua sendo o lugar de planejamento profundo."
      title="Ações rápidas"
    >
      <MobileQuickActionGrid />
      <section className="rounded-card border border-warmth-100 bg-warmth-50 p-4 text-sm leading-6 text-warmth-900">
        Mobile complementar: sem calendário complexo, sem edição profunda de projetos e sem Atalaia funcional.
      </section>
      <section className="rounded-card border border-ink-100 bg-white p-4">
        <h2 className="font-bold text-ink-900">Agora</h2>
        <p className="mt-2 text-sm leading-6 text-ink-600">
          Se estiver em baixa energia, comece por energia, foco 5 min ou Desbloqueador.
        </p>
        <Link className="mt-3 inline-flex text-sm font-semibold text-purpose-900" href="/mobile/today">
          Ver atalhos de hoje
        </Link>
      </section>
      <FeedbackButton
        compact
        defaultModule="mobile"
        persistFeedback={feedback ? persistPreparedBetaFeedbackAction : undefined}
      />
    </MobileShell>
  );
}
