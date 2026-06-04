import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { SensitiveDataNotice } from "@/components/ui/SensitiveDataNotice";
import { listWeeklyReviewHistoryForCurrentUser } from "@/lib/supabase/queries/reflection";

export default async function ReviewHistoryPage() {
  const history = await listWeeklyReviewHistoryForCurrentUser(8);

  return (
    <div className="space-y-6">
      <PageHeader
        description="Historico privado das revisoes semanais salvas no Supabase quando houver sessao ativa."
        status="Prompt 12"
        title="Historico de revisoes"
      />
      <SensitiveDataNotice title="Historico privado">
        Revisoes Semanais ficam owner-only e nao sao enviadas ao Atalaia.
      </SensitiveDataNotice>

      {history.items.length === 0 ? (
        <EmptyState description={history.message} title="Sem revisoes salvas" />
      ) : (
        <section className="grid gap-4 lg:grid-cols-2" aria-label="Historico privado de revisoes">
          {history.items.map((item) => (
            <Card as="article" className="space-y-3" key={item.id}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge intent={item.overloadWarning ? "warning" : "purpose"}>
                  {item.overloadWarning ? "atencao a sobrecarga" : "privado"}
                </Badge>
                <span className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  {item.weekStart} a {item.weekEnd}
                </span>
              </div>
              <h2 className="font-bold text-ink-900">Resumo da semana</h2>
              <p className="text-sm leading-6 text-ink-600">{item.summary}</p>
              <p className="text-sm font-semibold leading-6 text-purpose-900">{item.nextWeekFocus}</p>
              {item.wins.length > 0 ? (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-500">Vitorias</h3>
                  <ul className="mt-2 space-y-1 text-sm leading-6 text-ink-600">
                    {item.wins.slice(0, 3).map((win) => (
                      <li key={win}>{win}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </Card>
          ))}
        </section>
      )}
      {history.items.length > 0 ? <p className="text-sm leading-6 text-ink-600">{history.message}</p> : null}
    </div>
  );
}
