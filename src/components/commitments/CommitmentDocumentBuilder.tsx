"use client";

import { FileText, Save } from "lucide-react";
import { useState, useTransition } from "react";

import { generateCommitmentDocumentDraft, persistCommitmentDocument } from "@/app/commitments/actions";
import { CommitmentDocumentPreview } from "@/components/commitments/CommitmentDocumentPreview";
import { CommitmentLeverForm } from "@/components/commitments/CommitmentLeverForm";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { SensitiveDataNotice } from "@/components/ui/SensitiveDataNotice";
import { Textarea } from "@/components/ui/Textarea";
import type { AccountabilitySharedField } from "@/ai/schemas";
import { accountabilityPermissionLabels } from "@/domain/accountability";
import type { CommitmentDocumentDraft } from "@/domain/commitments";

type CommitmentFormState = {
  userName: string;
  goalId: string;
  goalTitle: string;
  deadline: string;
  callingSummary: string;
  callingSummaryAuthorized: boolean;
  linkedProjects: string;
  supportingHabits: string;
  scoreboardItems: string;
  partnerName: string;
  partnerEmail: string;
  reward: string;
  restorativeConsequence: string;
  firstAction: string;
  sharingPermissions: AccountabilitySharedField[];
};

const initialState: CommitmentFormState = {
  callingSummary: "",
  callingSummaryAuthorized: false,
  deadline: "2026-07-31",
  firstAction: "Executar o primeiro passo combinado.",
  goalId: "goal-exemplo",
  goalTitle: "Concluir primeiro marco do alvo",
  linkedProjects: "Preparar ambiente\nExecutar primeiro passo",
  partnerEmail: "atalia@example.com",
  partnerName: "Pessoa de confianca",
  restorativeConsequence: "Se eu travar, farei uma revisao curta e reduzirei o escopo.",
  reward: "Pausa curta planejada ao concluir o primeiro marco.",
  scoreboardItems: "Primeiro passo concluido\nRetomada registrada",
  sharingPermissions: ["goal_name", "deadline", "status", "commitment_document"],
  supportingHabits: "Revisao de 10 minutos",
  userName: "Usuario"
};

const shareOptions: AccountabilitySharedField[] = [
  "goal_name",
  "deadline",
  "status",
  "progress_percentage",
  "completed_milestones",
  "limited_scoreboard",
  "commitment_document"
];

export function CommitmentDocumentBuilder() {
  const [input, setInput] = useState(initialState);
  const [draft, setDraft] = useState<CommitmentDocumentDraft | null>(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function update<K extends keyof CommitmentFormState>(key: K, value: CommitmentFormState[K]) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  function lines(value: string) {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function togglePermission(permission: AccountabilitySharedField, checked: boolean) {
    const next = new Set(input.sharingPermissions);
    if (checked) {
      next.add(permission);
    } else {
      next.delete(permission);
    }
    update("sharingPermissions", Array.from(next));
  }

  function payload() {
    return {
      ...input,
      linkedProjects: lines(input.linkedProjects),
      scoreboardItems: lines(input.scoreboardItems),
      supportingHabits: lines(input.supportingHabits)
    };
  }

  function generate() {
    startTransition(async () => {
      const result = await generateCommitmentDocumentDraft(payload());
      setDraft(result.draft ?? null);
      setMessage(result.message);
    });
  }

  function save() {
    if (!draft) return;

    startTransition(async () => {
      const result = await persistCommitmentDocument({ ...payload(), output: draft.document });
      setMessage(result.message);
    });
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="space-y-5">
        <Card as="section" className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-ink-900">Gerar Documento de Compromisso</h2>
            <p className="mt-1 text-sm leading-6 text-ink-600">
              Monte um compromisso simples, revisavel e seguro antes de qualquer compartilhamento.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-ink-900">
              Nome do usuario
              <Input value={input.userName} onChange={(event) => update("userName", event.target.value)} />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink-900">
              Prazo
              <Input value={input.deadline} onChange={(event) => update("deadline", event.target.value)} />
            </label>
          </div>
          <label className="grid gap-2 text-sm font-semibold text-ink-900">
            Alvo
            <Input value={input.goalTitle} onChange={(event) => update("goalTitle", event.target.value)} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink-900">
            Primeira acao
            <Input value={input.firstAction} onChange={(event) => update("firstAction", event.target.value)} />
          </label>
          <Checkbox
            checked={input.callingSummaryAuthorized}
            label="Incluir resumo curto do Chamado autorizado por mim"
            onChange={(event) => update("callingSummaryAuthorized", event.target.checked)}
          />
          {input.callingSummaryAuthorized ? (
            <label className="grid gap-2 text-sm font-semibold text-ink-900">
              Resumo autorizado do Chamado
              <Textarea value={input.callingSummary} onChange={(event) => update("callingSummary", event.target.value)} />
            </label>
          ) : null}
          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-ink-900">
              Projetos vinculados
              <Textarea value={input.linkedProjects} onChange={(event) => update("linkedProjects", event.target.value)} />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink-900">
              Habitos de suporte
              <Textarea
                value={input.supportingHabits}
                onChange={(event) => update("supportingHabits", event.target.value)}
              />
            </label>
          </div>
          <label className="grid gap-2 text-sm font-semibold text-ink-900">
            Itens de Placar limitados
            <Textarea value={input.scoreboardItems} onChange={(event) => update("scoreboardItems", event.target.value)} />
          </label>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-ink-900">
              Atalaia escolhido
              <Input value={input.partnerName} onChange={(event) => update("partnerName", event.target.value)} />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink-900">
              E-mail
              <Input value={input.partnerEmail} onChange={(event) => update("partnerEmail", event.target.value)} />
            </label>
          </div>
        </Card>

        <CommitmentLeverForm
          consequence={input.restorativeConsequence}
          onConsequenceChange={(value) => update("restorativeConsequence", value)}
          onRewardChange={(value) => update("reward", value)}
          reward={input.reward}
        />

        <Card as="section" className="space-y-3">
          <h2 className="text-lg font-bold text-ink-900">Permissoes do documento</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {shareOptions.map((permission) => (
              <Checkbox
                checked={input.sharingPermissions.includes(permission)}
                key={permission}
                label={accountabilityPermissionLabels[permission]}
                onChange={(event) => togglePermission(permission, event.target.checked)}
              />
            ))}
          </div>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button disabled={isPending} onClick={generate}>
            <FileText aria-hidden className="h-4 w-4" />
            Gerar documento
          </Button>
          <Button disabled={!draft || isPending} onClick={save} variant="soft">
            <Save aria-hidden className="h-4 w-4" />
            Salvar rascunho
          </Button>
        </div>
        {message ? <p className="text-sm leading-6 text-ink-600">{message}</p> : null}

        {draft ? <CommitmentDocumentPreview draft={draft} /> : null}
      </div>

      <aside className="space-y-4">
        <SensitiveDataNotice title="Revisao antes de compartilhar">
          O documento nasce privado. Compartilhar com Atalaia exige grant ativo, permissao de documento e nova previa.
        </SensitiveDataNotice>
      </aside>
    </div>
  );
}
