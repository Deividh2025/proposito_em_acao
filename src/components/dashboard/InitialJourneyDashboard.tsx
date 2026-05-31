import Link from "next/link";
import { ArrowRight, LockKeyhole, Route } from "lucide-react";

import { getProgressiveUnlockState } from "@/domain/onboarding";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { SensitiveDataNotice } from "@/components/ui/SensitiveDataNotice";

export function InitialJourneyDashboard() {
  const unlockState = getProgressiveUnlockState({ hasCallingHypothesis: false });

  return (
    <div className="space-y-5" data-testid="initial-journey-dashboard">
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Card as="section" className="border-purpose-100 bg-purpose-50">
          <div className="flex items-start gap-3">
            <Route aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-purpose-700" />
            <div>
              <h2 className="text-xl font-bold text-ink-900">Direção antes de agenda</h2>
              <p className="mt-2 text-sm leading-6 text-ink-700">
                Sua jornada começa pelo onboarding: perfil essencial, Mapa da Vida e uma
                hipótese provisória de Chamado. Depois disso, alvos e planejamento ganham filtro.
              </p>
              <Link
                className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-control bg-purpose-700 px-4 text-sm font-semibold text-white transition duration-200 hover:bg-purpose-900"
                href="/onboarding"
              >
                Continuar onboarding
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Card>
        <Card as="aside">
          <h2 className="font-bold text-ink-900">Status da jornada</h2>
          <div className="mt-4">
            <Progress label="Direção inicial" value={25} />
          </div>
          <p className="mt-3 text-sm leading-6 text-ink-600">
            Chamado provisório pendente. A próxima microação é iniciar ou retomar o fluxo.
          </p>
        </Card>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card as="section">
          <h2 className="font-bold text-ink-900">Resumo do Mapa da Vida</h2>
          <p className="mt-2 text-sm leading-6 text-ink-600">
            Ainda não há leitura salva nesta sessão. Após preencher o Mapa, esta área destacará
            forças, cuidados e áreas que não devem ser sacrificadas.
          </p>
        </Card>
        <Card as="section">
          <div className="flex items-start gap-3">
            <LockKeyhole aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-ink-500" />
            <div>
              <h2 className="font-bold text-ink-900">Módulos limitados por enquanto</h2>
              <p className="mt-2 text-sm leading-6 text-ink-600">{unlockState.message}</p>
              <p className="mt-3 text-sm leading-6 text-ink-700">
                Limitado: {unlockState.limitedModules.join(", ")}.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <SensitiveDataNotice>
        Este dashboard inicial não mostra Chamado completo, Metacognição, Atalaia ou dados
        íntimos. Integração real com Supabase depende de Auth/RLS aplicados e testados.
      </SensitiveDataNotice>
    </div>
  );
}
