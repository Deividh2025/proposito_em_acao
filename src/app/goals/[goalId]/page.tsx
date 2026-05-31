import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { ExecutionStatusBadge } from "@/components/execution/ExecutionStatus";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { sampleSmartGoal } from "@/domain/execution/sample-data";

type GoalDetailPageProps = {
  params: Promise<{ goalId: string }>;
};

export default async function GoalDetailPage({ params }: GoalDetailPageProps) {
  const { goalId } = await params;

  return (
    <div className="space-y-6">
      <PageHeader
        action={
          <Link href="/projects/new">
            <Button>Gerar projeto</Button>
          </Link>
        }
        description={`Detalhe revisavel do alvo ${goalId}. Dados reais usam Supabase/RLS quando Auth estiver ativo.`}
        status="Detalhe de alvo"
        title={sampleSmartGoal.title}
      />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <Card as="section" className="space-y-4">
          <ExecutionStatusBadge status={sampleSmartGoal.status} />
          <dl className="grid gap-4 md:grid-cols-2">
            <Detail title="Especifico" value={sampleSmartGoal.specific} />
            <Detail title="Mensuravel" value={sampleSmartGoal.measurable} />
            <Detail title="Atingivel" value={sampleSmartGoal.achievable} />
            <Detail title="Relevante" value={sampleSmartGoal.relevant} />
            <Detail title="Temporal" value={sampleSmartGoal.timebound} />
            <Detail title="Alinhamento" value={sampleSmartGoal.calling_alignment.explanation} />
          </dl>
        </Card>
        <aside className="space-y-4">
          <Card className="border-purpose-100 bg-purpose-50">
            <p className="text-xs font-semibold uppercase tracking-wide text-purpose-700">Proxima acao</p>
            <p className="mt-2 text-base font-bold text-purpose-900">{sampleSmartGoal.first_action}</p>
          </Card>
          <Card>
            <h2 className="font-bold text-ink-900">Analise ecologica</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {sampleSmartGoal.ecological_analysis.protected_areas.map((area) => (
                <Tag key={area}>{area}</Tag>
              ))}
            </div>
            <p className="mt-3 text-sm leading-6 text-ink-600">
              {sampleSmartGoal.ecological_analysis.adjustments.join(" ")}
            </p>
          </Card>
        </aside>
      </div>
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
