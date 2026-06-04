import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { ExecutionStatusBadge } from "@/components/execution/ExecutionStatus";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { loadGoalDetail, type ExecutionGoalSummary } from "@/lib/supabase/queries/execution";

type GoalDetailPageProps = {
  params: Promise<{ goalId: string }>;
};

export default async function GoalDetailPage({ params }: GoalDetailPageProps) {
  const { goalId } = await params;
  const goalData = await loadGoalDetail(goalId);
  const goal = goalData.item;

  if (!goal) {
    return (
      <div className="space-y-6">
        <PageHeader
          description={goalData.message}
          status="Detalhe de alvo"
          title="Alvo nao carregado"
        />
        <Card as="section">
          <h2 className="font-bold text-ink-900">Nenhum alvo real encontrado</h2>
          <p className="mt-2 text-sm leading-6 text-ink-600">
            Este detalhe so mostra dados do usuario autenticado. Em preview, beta e producao,
            samples nao substituem a leitura via Supabase/RLS.
          </p>
          <Link className="mt-4 inline-flex" href="/goals">
            <Button variant="outline">Voltar para alvos</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        action={
          <Link href="/projects/new">
            <Button>Gerar projeto</Button>
          </Link>
        }
        description={goalData.isSample ? "Amostra local-demo rotulada; nao representa persistencia real." : goalData.message}
        status={goalData.mode === "local-demo" ? "Amostra local-demo" : "Detalhe autenticado"}
        title={goal.title}
      />
      <GoalDetail goal={goal} />
    </div>
  );
}

function GoalDetail({ goal }: { goal: ExecutionGoalSummary }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <Card as="section" className="space-y-4">
        <ExecutionStatusBadge status={goal.status} />
        <dl className="grid gap-4 md:grid-cols-2">
          <Detail title="Especifico" value={goal.specific} />
          <Detail title="Mensuravel" value={goal.measurable} />
          <Detail title="Atingivel" value={goal.achievable} />
          <Detail title="Relevante" value={goal.relevant} />
          <Detail title="Temporal" value={goal.timebound} />
          <Detail title="Alinhamento" value={goal.callingAlignment} />
        </dl>
      </Card>
      <aside className="space-y-4">
        <Card className="border-purpose-100 bg-purpose-50">
          <p className="text-xs font-semibold uppercase tracking-wide text-purpose-700">Proxima acao</p>
          <p className="mt-2 text-base font-bold text-purpose-900">{goal.firstAction}</p>
        </Card>
        <Card>
          <h2 className="font-bold text-ink-900">Analise ecologica</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {goal.protectedAreas.length > 0 ? (
              goal.protectedAreas.map((area) => <Tag key={area}>{area}</Tag>)
            ) : (
              <Tag>revisar areas protegidas</Tag>
            )}
            {goal.isSample ? <Tag>Amostra local-demo</Tag> : null}
          </div>
          <p className="mt-3 text-sm leading-6 text-ink-600">
            {goal.ecologicalAdjustments.join(" ") || "Revise impactos antes de aprofundar este alvo."}
          </p>
        </Card>
      </aside>
    </div>
  );
}

function Detail({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">{title}</dt>
      <dd className="mt-1 text-sm leading-6 text-ink-800">{value}</dd>
    </div>
  );
}
