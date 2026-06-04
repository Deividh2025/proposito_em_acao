import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { GoalSummary } from "@/components/goals/GoalSummary";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { loadGoalList, type ExecutionDataMode } from "@/lib/supabase/queries/execution";

export default async function GoalsPage() {
  const goalsData = await loadGoalList();

  return (
    <div className="space-y-6">
      <PageHeader
        action={
          <Link href="/goals/new">
            <Button>Criar alvo</Button>
          </Link>
        }
        description="Transforme desejos vagos em alvos SMART-E com ecologia, Chamado e primeira acao revisavel."
        status={goalsData.mode === "local-demo" ? "Amostra local-demo" : "Dados autenticados"}
        title="Alvos SMART-E"
      />
      <DataStateNotice mode={goalsData.mode} message={goalsData.message} />
      {goalsData.items.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {goalsData.items.map((goal) => (
            <GoalSummary goal={goal} key={goal.id} />
          ))}
        </div>
      ) : (
        <EmptyGoalsState mode={goalsData.mode} />
      )}
    </div>
  );
}

function DataStateNotice({ message, mode }: { message: string; mode: ExecutionDataMode }) {
  return (
    <Card as="section" className={mode === "local-demo" ? "border-purpose-100 bg-purpose-50" : ""}>
      <p className="text-sm leading-6 text-ink-700">{message}</p>
    </Card>
  );
}

function EmptyGoalsState({ mode }: { mode: ExecutionDataMode }) {
  const needsAuth = mode === "auth-required" || mode === "blocked";

  return (
    <Card as="section">
      <h2 className="font-bold text-ink-900">
        {needsAuth ? "Nenhum alvo real carregado" : "Nenhum alvo salvo ainda"}
      </h2>
      <p className="mt-2 text-sm leading-6 text-ink-600">
        {needsAuth
          ? "Entre com uma conta e um ambiente Supabase validado para ver dados reais protegidos por RLS."
          : "Crie o primeiro alvo revisavel; ele aparecera aqui somente depois de salvo para o usuario autenticado."}
      </p>
      <Link className="mt-4 inline-flex" href="/goals/new">
        <Button>Criar alvo</Button>
      </Link>
    </Card>
  );
}
