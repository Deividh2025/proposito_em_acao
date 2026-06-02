"use client";

import { MailPlus, Save } from "lucide-react";
import { useState, useTransition } from "react";

import { generateAccountabilityInviteDraft, persistAccountabilityInvite } from "@/app/accountability/actions";
import { AccountabilityInvitePreview } from "@/components/accountability/AccountabilityInvitePreview";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SensitiveDataNotice } from "@/components/ui/SensitiveDataNotice";
import { Textarea } from "@/components/ui/Textarea";
import {
  defaultPermissionsByLevel,
  type AccountabilityInviteDraft,
  type AccountabilityLevel,
  type AccountabilityNotificationFrequency,
  type AccountabilityPermission
} from "@/domain/accountability";
import { PermissionSelector } from "./PermissionSelector";

type AccountabilityFormState = {
  goalId: string;
  goalTitle: string;
  goalDeadline: string;
  goalStatus: string;
  progressPercentage: number;
  completedMilestones: string;
  partnerName: string;
  partnerEmail: string;
  level: AccountabilityLevel;
  notificationFrequency: AccountabilityNotificationFrequency;
  permissions: AccountabilityPermission[];
  customMessage: string;
  firstAction: string;
};

const initialState: AccountabilityFormState = {
  completedMilestones: "",
  customMessage: "Quero acompanhamento claro e respeitoso.",
  firstAction: "Executar o primeiro passo combinado.",
  goalDeadline: "2026-07-31",
  goalId: "goal-exemplo",
  goalStatus: "ativo",
  goalTitle: "Concluir primeiro marco do alvo",
  level: "balanced",
  notificationFrequency: "weekly",
  partnerEmail: "atalia@example.com",
  partnerName: "Pessoa de confianca",
  permissions: defaultPermissionsByLevel.balanced,
  progressPercentage: 0
};

export function AccountabilityPartnerForm() {
  const [input, setInput] = useState(initialState);
  const [draft, setDraft] = useState<AccountabilityInviteDraft | null>(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function update<K extends keyof AccountabilityFormState>(key: K, value: AccountabilityFormState[K]) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  function updateLevel(level: AccountabilityLevel) {
    setInput((current) => ({
      ...current,
      level,
      permissions: defaultPermissionsByLevel[level]
    }));
  }

  function payload() {
    return {
      ...input,
      completedMilestones: input.completedMilestones
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
    };
  }

  function generate() {
    startTransition(async () => {
      const result = await generateAccountabilityInviteDraft(payload());
      setDraft(result.draft ?? null);
      setMessage(result.message);
    });
  }

  function save() {
    if (!draft) return;

    startTransition(async () => {
      const result = await persistAccountabilityInvite({ ...payload(), preview: draft.preview });
      setMessage(result.message);
    });
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="space-y-5">
        <Card as="section" className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-ink-900">Adicionar Atalaia a um alvo</h2>
            <p className="mt-1 text-sm leading-6 text-ink-600">
              Escolha um alvo especifico, defina o escopo e revise a previa antes de criar qualquer convite.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-ink-900">
              ID do alvo
              <Input value={input.goalId} onChange={(event) => update("goalId", event.target.value)} />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink-900">
              Prazo
              <Input value={input.goalDeadline} onChange={(event) => update("goalDeadline", event.target.value)} />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-semibold text-ink-900">
            Nome do alvo
            <Input value={input.goalTitle} onChange={(event) => update("goalTitle", event.target.value)} />
          </label>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-ink-900">
              Nome do Atalaia
              <Input value={input.partnerName} onChange={(event) => update("partnerName", event.target.value)} />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink-900">
              E-mail do Atalaia
              <Input value={input.partnerEmail} onChange={(event) => update("partnerEmail", event.target.value)} />
            </label>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <label className="grid gap-2 text-sm font-semibold text-ink-900">
              Nivel
              <Select value={input.level} onChange={(event) => updateLevel(event.target.value as AccountabilityLevel)}>
                <option value="light">Leve</option>
                <option value="balanced">Equilibrado</option>
                <option value="firm">Firme</option>
              </Select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink-900">
              Frequencia
              <Select
                value={input.notificationFrequency}
                onChange={(event) =>
                  update("notificationFrequency", event.target.value as AccountabilityNotificationFrequency)
                }
              >
                <option value="milestones_only">marcos</option>
                <option value="weekly">semanal</option>
                <option value="important_events">eventos importantes</option>
                <option value="paused">pausado</option>
              </Select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink-900">
              Progresso
              <Input
                max={100}
                min={0}
                type="number"
                value={input.progressPercentage}
                onChange={(event) => update("progressPercentage", Number(event.target.value))}
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-semibold text-ink-900">
            Marcos concluidos
            <Textarea
              value={input.completedMilestones}
              onChange={(event) => update("completedMilestones", event.target.value)}
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-ink-900">
            Mensagem personalizada
            <Textarea value={input.customMessage} onChange={(event) => update("customMessage", event.target.value)} />
          </label>

          <PermissionSelector
            level={input.level}
            onChange={(permissions) => update("permissions", permissions)}
            selected={input.permissions}
          />

          <div className="flex flex-wrap gap-3">
            <Button disabled={isPending} onClick={generate}>
              <MailPlus aria-hidden className="h-4 w-4" />
              Gerar previa
            </Button>
            <Button disabled={!draft || isPending} onClick={save} variant="soft">
              <Save aria-hidden className="h-4 w-4" />
              Aprovar convite preparado
            </Button>
          </div>
          <p className="text-xs leading-5 text-ink-500">
            Esta etapa registra a previa e a fila segura. E-mail real continua bloqueado ate existir provider revisado.
          </p>
          {message ? <p className="text-sm leading-6 text-ink-600">{message}</p> : null}
        </Card>

        {draft ? <AccountabilityInvitePreview draft={draft} /> : null}
      </div>

      <aside className="space-y-4">
        <SensitiveDataNotice title="Acesso nunca e a conta inteira">
          Atalaia ve apenas o alvo e os campos autorizados. Metacognicao, Chamado completo, revisao, inbox e agenda
          completa ficam privados por padrao.
        </SensitiveDataNotice>
        <Card as="aside" className="space-y-2 border-warmth-100 bg-warmth-50">
          <h2 className="font-bold text-warmth-900">Baixa energia</h2>
          <p className="text-sm leading-6 text-warmth-900">
            Comece com nivel leve e so nome do alvo/status. Voce pode ampliar depois se fizer sentido.
          </p>
        </Card>
      </aside>
    </div>
  );
}
