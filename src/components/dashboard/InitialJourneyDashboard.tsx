import Link from "next/link";
import { ArrowRight, ListChecks, LockKeyhole, Route } from "lucide-react";

import { getProgressiveUnlockState } from "@/domain/onboarding";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { SensitiveDataNotice } from "@/components/ui/SensitiveDataNotice";
import type { ExecutionOverviewData } from "@/lib/supabase/queries/execution";

export function InitialJourneyDashboard({ executionData }: { executionData: ExecutionOverviewData }) {
  const hasExecutionData =
    executionData.counts.goals > 0 || executionData.counts.projects > 0 || executionData.counts.tasks > 0;
  const unlockState = getProgressiveUnlockState({ hasCallingHypothesis: hasExecutionData });
  const progressValue = hasExecutionData ? 55 : 25;
  const nextAction =
    executionData.tasks[0]?.nextAction ??
    executionData.projects[0]?.nextAction ??
    executionData.goals[0]?.firstAction ??
    "Iniciar ou retomar o onboarding.";

  return (
    <div className="space-y-5" data-testid="initial-journey-dashboard">
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Card as="section" className="border-purpose-100 bg-purpose-50">
          <div className="flex items-start gap-3">
            <Route aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-purpose-700" />
            <div>
              <h2 className="text-xl font-bold text-ink-900">Direção antes de agenda</h2>
              <p className="mt-2 text-sm leading-6 text-ink-700">
                {hasExecutionData
                  ? "Seus dados de execucao aparecem aqui como proxima acao revisavel, sem expor Chamado completo ou conteudo intimo."
                  : "Sua jornada começa pelo onboarding: perfil essencial, Mapa da Vida e uma hipótese provisória de Chamado. Depois disso, alvos e planejamento ganham filtro."}
              </p>
              <Link
                className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-control bg-purpose-700 px-4 text-sm font-semibold text-white transition duration-200 hover:bg-purpose-900"
                href={hasExecutionData ? "/tasks" : "/onboarding"}
              >
                {hasExecutionData ? "Ver tarefas" : "Continuar onboarding"}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Card>
        <Card as="aside">
          <h2 className="font-bold text-ink-900">Status da jornada</h2>
          <div className="mt-4">
            <Progress label="Direção inicial" value={progressValue} />
          </div>
          <p className="mt-3 text-sm leading-6 text-ink-600">
            {executionData.message}
          </p>
          {executionData.isSample ? (
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-ink-500">
              Dados demonstrativos apenas neste ambiente.
            </p>
          ) : null}
        </Card>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card as="section">
          <div className="flex items-start gap-3">
            <ListChecks aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-action-700" />
            <div>
              <h2 className="font-bold text-ink-900">Proxima acao</h2>
              <p className="mt-2 text-sm leading-6 text-ink-600">{nextAction}</p>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                <Metric label="Alvos" value={executionData.counts.goals} />
                <Metric label="Projetos" value={executionData.counts.projects} />
                <Metric label="Tarefas" value={executionData.counts.tasks} />
              </div>
            </div>
          </div>
        </Card>
        <Card as="section">
          <div className="flex items-start gap-3">
            <LockKeyhole aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-ink-500" />
            <div>
              <h2 className="font-bold text-ink-900">
                {hasExecutionData ? "Execucao carregada com escopo minimo" : "Módulos limitados por enquanto"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink-600">{unlockState.message}</p>
              <p className="mt-3 text-sm leading-6 text-ink-700">
                Limitado: {unlockState.limitedModules.join(", ")}.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <SensitiveDataNotice>
        Este dashboard não mostra Chamado completo, Metacognição, Atalaia ou dados íntimos. Fora de
        local-demo, dados demonstrativos não substituem Supabase/Auth/RLS.
      </SensitiveDataNotice>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-card border border-ink-100 bg-white p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-ink-900">{value}</p>
    </div>
  );
}
