import Link from "next/link";

import { AccountabilityGrantCard } from "@/components/accountability/AccountabilityGrantCard";
import { PartnerLimitedPanel } from "@/components/accountability/PartnerLimitedPanel";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { buildAccountabilityInviteDraft } from "@/domain/accountability";

const sampleGrant = buildAccountabilityInviteDraft({
  completedMilestones: ["Primeiro marco confirmado"],
  customMessage: "Apoio claro e respeitoso.",
  firstAction: "Executar o primeiro passo combinado.",
  goalDeadline: "2026-07-31",
  goalId: "goal-exemplo",
  goalStatus: "ativo",
  goalTitle: "Concluir primeiro marco do alvo",
  level: "balanced",
  notificationFrequency: "weekly",
  partnerEmail: "atalia@example.com",
  partnerName: "Pessoa de confianca",
  permissions: ["goal_name", "status", "progress_percentage", "completed_milestones", "help_request", "completion"],
  progressPercentage: 32
}).grant;

export default function AccountabilityPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        action={
          <div className="flex flex-wrap gap-2">
            <Link href="/accountability/new">
              <Button>Novo Atalaia</Button>
            </Link>
            <Link href="/commitments">
              <Button variant="soft">Documento de compromisso</Button>
            </Link>
          </div>
        }
        description="Convide uma pessoa para acompanhar apenas um alvo, com permissoes claras, previa e revogacao."
        status="Prompt 13"
        title="Atalaia"
      />
      <Card as="section" className="space-y-2">
        <h2 className="text-lg font-bold text-ink-900">Proxima acao</h2>
        <p className="max-w-2xl text-sm leading-6 text-ink-600">
          Comece criando um convite para um unico alvo. Depois revise a previa, confirme os campos visiveis e registre o
          convite preparado.
        </p>
        <Link href="/accountability/new">
          <Button variant="soft">Criar convite com previa</Button>
        </Link>
      </Card>
      <div className="grid gap-5 xl:grid-cols-2">
        <AccountabilityGrantCard grant={sampleGrant} />
        <PartnerLimitedPanel grant={{ ...sampleGrant, status: "active" }} />
      </div>
    </div>
  );
}
