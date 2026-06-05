"use client";

import { useState, useTransition, type FormEvent } from "react";
import {
  Bot,
  Download,
  Languages,
  LockKeyhole,
  RotateCcw,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  Trash2
} from "lucide-react";

import {
  requestAccountDeletionAction,
  saveSettingsPreferencesAction,
  updateAiProviderConsentAction,
  updateBetaFeedbackConsentAction,
  updateProductAnalyticsConsentAction,
  type SettingsActionResult
} from "@/app/settings/actions";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { Select } from "@/components/ui/Select";
import { SensitiveDataNotice } from "@/components/ui/SensitiveDataNotice";
import { Switch } from "@/components/ui/Switch";
import {
  ACCOUNT_DELETION_CONFIRMATION,
  privacyConsentDefinitions,
  type AiProviderPreference,
  type AiTonePreference,
  type ChristianLayerIntensity,
  type PrivacyConsentState,
  type PrivacyConsentType,
  type SettingsSnapshot
} from "@/domain/privacy";

type ConsentProvider = "openai" | "deepseek";
type ConsentDecision = "grant" | "revoke";

type SettingsCenterProps = {
  snapshot: SettingsSnapshot;
  status?: string;
};

type ActionMessage = {
  area: string;
  result: SettingsActionResult;
};

const statusMessages: Record<string, string> = {
  exported: "Exportacao preparada.",
  saved: "Configuracoes atualizadas.",
  updated: "Preferencia revisada."
};

const providerOptions = [
  {
    label: "Automatico",
    value: "automatic",
    description: "Usa a decisao server-side aprovada, sem trocar provider apos falha."
  },
  {
    label: "OpenAI",
    value: "openai",
    description: "Preferencia explicita; chamadas reais exigem consentimento OpenAI ativo."
  },
  {
    label: "DeepSeek",
    value: "deepseek",
    description: "Preferencia explicita; chamadas reais exigem consentimento DeepSeek ativo."
  }
] as const;

const faithOptions = [
  {
    label: "Desligada",
    value: "off",
    description: "Nao inclui linguagem crista fora de textos essenciais do produto."
  },
  {
    label: "Leve",
    value: "light",
    description: "Usa referencias discretas, sem pressupor pratica devocional."
  },
  {
    label: "Equilibrada",
    value: "balanced",
    description: "Integra fe como contexto de discernimento sem peso extra."
  },
  {
    label: "Forte",
    value: "strong",
    description: "Inclui referencias cristas com cuidado, sem culpa ou manipulacao."
  }
] as const;

const providerConsentMap = {
  deepseek: "ai_provider_deepseek",
  openai: "ai_provider_openai"
} as const satisfies Record<ConsentProvider, PrivacyConsentType>;

function isConsentActive(consent: PrivacyConsentState) {
  return consent.status === "granted";
}

function messageClassName(result: SettingsActionResult) {
  if (result.ok) {
    return "border-purpose-100 bg-purpose-50 text-purpose-900";
  }

  if (result.status === "invalid") {
    return "border-gentleDanger-100 bg-gentleDanger-50 text-gentleDanger-900";
  }

  return "border-warmth-100 bg-warmth-50 text-warmth-900";
}

function ActionFeedback({ message }: { message: ActionMessage | null }) {
  if (!message) {
    return null;
  }

  return (
    <div aria-live="polite" className={`rounded-card border p-3 text-sm leading-6 ${messageClassName(message.result)}`}>
      <p className="font-bold">{message.area}</p>
      <p>{message.result.message}</p>
    </div>
  );
}

export function SettingsCenter({ snapshot, status }: SettingsCenterProps) {
  const [aiProviderPreference, setAiProviderPreference] = useState<AiProviderPreference>(
    snapshot.preferences.aiProviderPreference
  );
  const [aiTone, setAiTone] = useState<AiTonePreference>(snapshot.preferences.aiTone);
  const [analyticsConsent, setAnalyticsConsent] = useState(isConsentActive(snapshot.consents.product_analytics));
  const [betaFeedbackConsent, setBetaFeedbackConsent] = useState(isConsentActive(snapshot.consents.beta_feedback));
  const [christianLayerIntensity, setChristianLayerIntensity] = useState<ChristianLayerIntensity>(
    snapshot.preferences.christianLayerIntensity
  );
  const [consents, setConsents] = useState(snapshot.consents);
  const [message, setMessage] = useState<ActionMessage | null>(
    status && statusMessages[status]
      ? {
          area: "Status",
          result: {
            message: statusMessages[status],
            ok: true,
            persisted: false,
            status: "local_draft"
          }
        }
      : null
  );
  const [providerConfirmations, setProviderConfirmations] = useState<Record<ConsentProvider, boolean>>({
    deepseek: false,
    openai: false
  });
  const [isPending, startTransition] = useTransition();

  function submitPreferences(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await saveSettingsPreferencesAction(formData);
      setMessage({ area: "Preferencias", result });

      if (result.ok) {
        setAiProviderPreference(String(formData.get("aiProviderPreference")) as AiProviderPreference);
        setAiTone(String(formData.get("aiTone")) as AiTonePreference);
        setChristianLayerIntensity(String(formData.get("christianLayerIntensity")) as ChristianLayerIntensity);
      }
    });
  }

  function submitProviderConsent(provider: ConsentProvider, decision: ConsentDecision) {
    const formData = new FormData();
    formData.set("provider", provider);
    formData.set("decision", decision);

    if (decision === "grant" && providerConfirmations[provider]) {
      formData.set("confirmProviderConsent", "on");
    }

    startTransition(async () => {
      const result = await updateAiProviderConsentAction(formData);
      const consentType = providerConsentMap[provider];
      const details = privacyConsentDefinitions[consentType];
      setMessage({ area: details.label, result });

      if (result.ok) {
        setConsents((current) => ({
          ...current,
          [consentType]: {
            ...current[consentType],
            acceptedAt: decision === "grant" ? new Date().toISOString() : current[consentType].acceptedAt,
            revokedAt: decision === "revoke" ? new Date().toISOString() : null,
            status: decision === "grant" ? "granted" : "revoked"
          }
        }));
        setProviderConfirmations((current) => ({ ...current, [provider]: false }));
      }
    });
  }

  function submitSimpleConsent(
    consentType: "product_analytics" | "beta_feedback",
    decision: ConsentDecision
  ) {
    const formData = new FormData();
    formData.set("decision", decision);

    if (decision === "grant") {
      formData.set(consentType === "product_analytics" ? "confirmAnalyticsConsent" : "confirmFeedbackConsent", "on");
    }

    const action =
      consentType === "product_analytics"
        ? updateProductAnalyticsConsentAction
        : updateBetaFeedbackConsentAction;

    startTransition(async () => {
      const result = await action(formData);
      const details = privacyConsentDefinitions[consentType];
      setMessage({ area: details.label, result });

      if (result.ok) {
        const active = decision === "grant";
        setConsents((current) => ({
          ...current,
          [consentType]: {
            ...current[consentType],
            acceptedAt: active ? new Date().toISOString() : current[consentType].acceptedAt,
            revokedAt: active ? null : new Date().toISOString(),
            status: active ? "granted" : "revoked"
          }
        }));
        if (consentType === "product_analytics") {
          setAnalyticsConsent(active);
        } else {
          setBetaFeedbackConsent(active);
        }
      }
    });
  }

  function requestDeletion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await requestAccountDeletionAction(formData);
      setMessage({ area: "Exclusao de conta", result });
    });
  }

  const runtimeCards = [
    {
      label: "Runtime",
      value: snapshot.runtime.runtimeMode,
      detail: snapshot.mode === "local-demo" ? "Rascunhos locais permitidos." : "Persistencia exige sessao autenticada."
    },
    {
      label: "IA real",
      value: snapshot.runtime.aiRealEnabled ? "habilitada por env" : "desligada",
      detail: "Provider real ainda exige consentimento e guardrails."
    },
    {
      label: "Analytics",
      value: snapshot.runtime.analyticsRealEnabled ? "preparado com opt-in" : "desligado por env",
      detail: "Eventos dependem de allowlist e consentimento."
    },
    {
      label: "Feedback",
      value: snapshot.runtime.feedbackRealEnabled ? "envio explicito habilitado" : "local/dev",
      detail: "Persistencia depende de consentimento e filtro sensivel."
    }
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="space-y-5">
        <Card as="section" className="space-y-5">
          <SectionHeader description={snapshot.statusMessage} title="Preferencias" />

          <form className="space-y-5" onSubmit={submitPreferences}>
            <input name="analyticsOptIn" type="hidden" value={analyticsConsent ? "true" : "false"} />
            <input name="lowEnergyMode" type="hidden" value={snapshot.preferences.lowEnergyMode ? "true" : "false"} />

            <RadioGroup
              legend="Provider de IA"
              name="aiProviderPreference"
              onChange={(event) => setAiProviderPreference(event.currentTarget.value as AiProviderPreference)}
              options={providerOptions}
              value={aiProviderPreference}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-ink-900">
                Tom da IA
                <Select
                  name="aiTone"
                  onChange={(event) => setAiTone(event.currentTarget.value as AiTonePreference)}
                  value={aiTone}
                >
                  <option value="encouraging">Encorajador</option>
                  <option value="direct">Direto</option>
                  <option value="gentle">Gentil</option>
                  <option value="structured">Estruturado</option>
                </Select>
              </label>

              <label className="grid gap-2 text-sm font-semibold text-ink-900">
                Idioma
                <Select disabled value="pt-BR">
                  <option value="pt-BR">Portugues do Brasil</option>
                </Select>
              </label>
            </div>

            <RadioGroup
              legend="Intensidade crista"
              name="christianLayerIntensity"
              onChange={(event) =>
                setChristianLayerIntensity(event.currentTarget.value as ChristianLayerIntensity)
              }
              options={faithOptions}
              value={christianLayerIntensity}
            />

            <Button disabled={isPending} type="submit">
              <Save aria-hidden className="h-4 w-4" />
              Salvar preferencias
            </Button>
          </form>
        </Card>

        <Card as="section" className="space-y-5">
          <SectionHeader
            description="Consentimentos sao por provider, versao e finalidade. Revogar deve bloquear proximas chamadas reais daquele provider."
            title="IA e consentimentos"
          />

          <SensitiveDataNotice title="Dados excluidos por padrao">
            Chamado completo, Metacognicao, saude, familia, financas, revisoes privadas, inbox bruto, calendario completo e dados de Atalaia nao entram em consentimento generico.
          </SensitiveDataNotice>

          <div className="grid gap-4 lg:grid-cols-2">
            {(Object.keys(providerConsentMap) as ConsentProvider[]).map((provider) => {
              const consentType = providerConsentMap[provider];
              const details = consents[consentType];
              const active = isConsentActive(details);

              return (
                <section className="rounded-card border border-ink-100 bg-white p-4" key={provider}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <Badge intent={active ? "purpose" : "neutral"}>{active ? "ativo" : details.status}</Badge>
                      <h3 className="mt-3 text-lg font-bold text-ink-900">{details.label}</h3>
                      <p className="mt-2 text-sm leading-6 text-ink-600">{details.purpose}</p>
                    </div>
                    <Badge intent="action">{details.version}</Badge>
                  </div>

                  <div className="mt-4 space-y-3">
                    {!active ? (
                      <Checkbox
                        checked={providerConfirmations[provider]}
                        label={`Entendo e autorizo somente ${details.version}.`}
                        onChange={(event) =>
                          setProviderConfirmations((current) => ({
                            ...current,
                            [provider]: event.currentTarget.checked
                          }))
                        }
                      />
                    ) : null}

                    {!active ? (
                      <Button
                        disabled={isPending || !providerConfirmations[provider]}
                        onClick={() => submitProviderConsent(provider, "grant")}
                        variant="soft"
                      >
                        <ShieldCheck aria-hidden className="h-4 w-4" />
                        Autorizar
                      </Button>
                    ) : (
                      <Button
                        disabled={isPending}
                        intent="warning"
                        onClick={() => submitProviderConsent(provider, "revoke")}
                        variant="outline"
                      >
                        <RotateCcw aria-hidden className="h-4 w-4" />
                        Revogar
                      </Button>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        </Card>

        <Card as="section" className="space-y-5">
          <SectionHeader
            description="Opt-in fica desligado por padrao. Eventos continuam dependendo de allowlist e consentimento ativo."
            title="Analytics first-party"
          />

          <Switch
            checked={analyticsConsent}
            description="Somente eventos allowlisted, sem conteudo livre, tokens, URLs sensiveis ou dados intimos."
            disabled={isPending}
            label={`${privacyConsentDefinitions.product_analytics.label} (${privacyConsentDefinitions.product_analytics.version})`}
            onChange={(event) =>
              submitSimpleConsent("product_analytics", event.currentTarget.checked ? "grant" : "revoke")
            }
          />

          <Switch
            checked={betaFeedbackConsent}
            description="Feedback beta so deve ser persistido apos envio explicito e filtro de indicio sensivel."
            disabled={isPending}
            label={`${privacyConsentDefinitions.beta_feedback.label} (${privacyConsentDefinitions.beta_feedback.version})`}
            onChange={(event) =>
              submitSimpleConsent("beta_feedback", event.currentTarget.checked ? "grant" : "revoke")
            }
          />
        </Card>
      </div>

      <aside className="space-y-5">
        <Card as="section" className="space-y-4">
          <SectionHeader description="Sem URL, tokens, chaves ou nomes de secrets." title="Estado de runtime" />
          <div className="grid gap-3">
            {runtimeCards.map((item) => (
              <div className="rounded-card border border-ink-100 bg-ink-50 p-3" key={item.label}>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">{item.label}</p>
                <p className="mt-1 font-bold text-ink-900">{item.value}</p>
                <p className="mt-1 text-xs leading-5 text-ink-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card as="section" className="space-y-4">
          <div className="flex items-start gap-3">
            <Languages aria-hidden className="mt-1 h-5 w-5 text-purpose-700" />
            <div>
              <h2 className="font-bold text-ink-900">Preferencia ativa</h2>
              <p className="mt-1 text-sm leading-6 text-ink-600">
                {aiTone} - {christianLayerIntensity}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Bot aria-hidden className="mt-1 h-5 w-5 text-purpose-700" />
            <div>
              <h2 className="font-bold text-ink-900">IA selecionada</h2>
              <p className="mt-1 text-sm leading-6 text-ink-600">{aiProviderPreference}</p>
            </div>
          </div>
        </Card>

        <Card as="section" className="space-y-4">
          <SectionHeader description="Exportacao autenticada em JSON com Cache-Control no-store." title="Seus dados" />
          <a
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-control border border-ink-300 bg-white px-4 text-sm font-semibold text-ink-900 transition duration-200 hover:bg-ink-50"
            href="/settings/export"
          >
            <Download aria-hidden className="h-4 w-4" />
            Exportar JSON
          </a>
        </Card>

        <Card as="section" className="space-y-4 border-gentleDanger-100 bg-gentleDanger-50">
          <div className="flex items-start gap-3">
            <LockKeyhole aria-hidden className="mt-1 h-5 w-5 text-gentleDanger-900" />
            <div>
              <h2 className="font-bold text-gentleDanger-900">Excluir conta</h2>
              <p className="mt-1 text-sm leading-6 text-gentleDanger-900">
                A etapa atual registra solicitacao segura; remocao Auth/admin depende de isolamento proprio.
              </p>
            </div>
          </div>
          <form className="space-y-3" onSubmit={requestDeletion}>
            <label className="grid gap-2 text-sm font-semibold text-gentleDanger-900">
              Confirmacao
              <Input name="confirmation" placeholder={ACCOUNT_DELETION_CONFIRMATION} />
            </label>
            <Button className="w-full" disabled={isPending} intent="danger" type="submit">
              <Trash2 aria-hidden className="h-4 w-4" />
              Solicitar exclusao
            </Button>
          </form>
        </Card>

        <Card as="section" className="space-y-3">
          <div className="flex items-start gap-3">
            <SlidersHorizontal aria-hidden className="mt-1 h-5 w-5 text-action-700" />
            <div>
              <h2 className="font-bold text-ink-900">Dependencias</h2>
              <p className="mt-1 text-sm leading-6 text-ink-600">
                Exportacao completa, remocao Auth/admin e retention job dependem dos demais subagentes da Etapa 7.
              </p>
            </div>
          </div>
        </Card>

        <ActionFeedback message={message} />
      </aside>
    </div>
  );
}
