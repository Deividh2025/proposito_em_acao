import Link from "next/link";
import { Inbox, Leaf, ListRestart, TimerReset, Zap } from "lucide-react";

import { MobileShell } from "@/components/mobile/MobileShell";
import { getAuthenticatedDataContext } from "@/lib/supabase/queries/authenticated-data";
import { getMobileTodaySummary, type MobileTodaySummary } from "@/lib/supabase/queries/mobile";

const todayActions = [
  { href: "/mobile/capture", label: "Capturar agora", icon: Inbox },
  { href: "/mobile/energy", label: "Registrar energia", icon: Zap },
  { href: "/mobile/focus", label: "Foco 5 min", icon: TimerReset },
  { href: "/mobile/habits", label: "Marcar hábito", icon: Leaf },
  { href: "/mobile/unblock", label: "Destravar tarefa", icon: ListRestart }
];

async function loadMobileSummary(): Promise<{ message: string | null; summary: MobileTodaySummary | null }> {
  const context = await getAuthenticatedDataContext();

  if (context.kind !== "authenticated") {
    return {
      message: context.kind === "local-demo" ? "Nenhum resumo real carregado no modo local-demo." : context.userMessage,
      summary: null
    };
  }

  try {
    return {
      message: null,
      summary: await getMobileTodaySummary(context.supabase, context.user)
    };
  } catch {
    return {
      message: "Nao foi possivel carregar o resumo mobile agora.",
      summary: null
    };
  }
}

export default async function MobileTodayPage() {
  const { message, summary } = await loadMobileSummary();

  return (
    <MobileShell
      subtitle="Uma lista curta para voltar ao movimento sem abrir a plataforma inteira."
      title="Hoje"
    >
      <section className="rounded-card border border-ink-100 bg-white p-4 shadow-sm">
        <h2 className="font-bold text-ink-900">Resumo real</h2>
        {summary?.latestEnergy ? (
          <p className="mt-2 text-sm leading-6 text-ink-600">
            Ultima energia registrada: <span className="font-semibold text-ink-900">{summary.latestEnergy.label}</span>.
          </p>
        ) : (
          <p className="mt-2 text-sm leading-6 text-ink-600">
            Nenhum dado minimo disponivel para hoje. Registre energia ou escolha uma acao rapida.
          </p>
        )}
        {message ? <p className="mt-2 text-xs leading-5 text-ink-500">{message}</p> : null}
        <p className="mt-2 text-xs leading-5 text-ink-500">Notas e conteudo sensivel nao sao cacheados nem exibidos aqui.</p>
      </section>
      <section className="space-y-3">
        {todayActions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              className="flex min-h-16 items-center gap-3 rounded-card border border-ink-100 bg-white p-4 font-semibold text-ink-900 shadow-sm"
              href={action.href}
              key={action.href}
            >
              <Icon aria-hidden className="h-5 w-5 text-purpose-700" />
              {action.label}
            </Link>
          );
        })}
      </section>
    </MobileShell>
  );
}
