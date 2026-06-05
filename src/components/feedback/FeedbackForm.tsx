"use client";

import { useState } from "react";

import {
  BETA_FEEDBACK_CONSENT_VERSION,
  buildFeedbackDraft,
  prepareBetaFeedbackForPersistence,
  type BetaFeedbackInput,
  betaFeedbackModules,
  type PersistBetaFeedbackAction
} from "@/domain/feedback";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { SensitiveDataNotice } from "@/components/ui/SensitiveDataNotice";
import { SuccessState } from "@/components/ui/SuccessState";

type FeedbackFormProps = {
  defaultModule?: BetaFeedbackInput["module"];
  externalUrl?: string;
  persistFeedback?: PersistBetaFeedbackAction;
};

type FeedbackStatus =
  | {
      kind: "error";
      message: string;
    }
  | {
      kind: "success";
      message: string;
    };

const scoreOptions = [1, 2, 3, 4, 5];

function readFormValue(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function readFeedbackInput(formData: FormData): BetaFeedbackInput {
  return {
    module: readFormValue(formData, "module") as BetaFeedbackInput["module"],
    worked: readFormValue(formData, "worked"),
    confused: readFormValue(formData, "confused"),
    blocked: readFormValue(formData, "blocked"),
    clarityScore: readFormValue(formData, "clarityScore"),
    usefulnessScore: readFormValue(formData, "usefulnessScore"),
    frictionScore: readFormValue(formData, "frictionScore"),
    comment: readFormValue(formData, "comment")
  };
}

function hasAcceptedFeedbackNotice(formData: FormData) {
  return formData.get("feedbackConsent") === "accepted";
}

export function FeedbackForm({
  defaultModule = "dashboard",
  externalUrl,
  persistFeedback
}: FeedbackFormProps) {
  const [status, setStatus] = useState<FeedbackStatus | null>(null);

  async function submitFeedback(formData: FormData) {
    try {
      const input = readFeedbackInput(formData);

      if (persistFeedback) {
        const prepared = prepareBetaFeedbackForPersistence({
          consentGranted: hasAcceptedFeedbackNotice(formData),
          consentVersion: BETA_FEEDBACK_CONSENT_VERSION,
          input,
          noticeAccepted: hasAcceptedFeedbackNotice(formData)
        });

        if (!prepared.ok) {
          setStatus({
            kind: "error",
            message: prepared.message
          });
          return;
        }

        const result = await persistFeedback(prepared.feedback);

        setStatus({
          kind: result.ok ? "success" : "error",
          message: result.message
        });
        return;
      }

      const draft = buildFeedbackDraft(input);

      setStatus({
        kind: "success",
        message: draft.message
      });
    } catch {
      setStatus({
        kind: "error",
        message: "Preencha os campos curtos e use notas de 1 a 5."
      });
    }
  }

  return (
    <form action={submitFeedback} className="space-y-4">
      <SensitiveDataNotice title="Feedback sem dados intimos">
        Use frases curtas. O rascunho fica local/dev; nao envie Chamado, Metacognicao, saude,
        familia, financas, calendario, tokens ou conteudo privado.
      </SensitiveDataNotice>

      <div className="rounded-card border border-ink-100 bg-ink-50 p-3">
        <Checkbox
          label="Revisei o texto, removi dados sensiveis e autorizo salvar este feedback no canal first-party do beta quando a persistencia segura estiver habilitada."
          name="feedbackConsent"
          value="accepted"
        />
        <p className="mt-2 text-xs leading-5 text-ink-600">
          O envio seguro nao dispara analytics e aceita somente os campos visiveis deste formulario.
        </p>
      </div>

      <label className="block text-sm font-semibold text-ink-800">
        Modulo
        <select
          className="mt-2 w-full rounded-control border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900"
          defaultValue={defaultModule}
          name="module"
        >
          {betaFeedbackModules.map((moduleName) => (
            <option key={moduleName} value={moduleName}>
              {moduleName}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-3">
        <label className="block text-sm font-semibold text-ink-800">
          O que funcionou
          <textarea
            className="mt-2 min-h-20 w-full resize-y rounded-control border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900"
            maxLength={500}
            name="worked"
            placeholder="Ex.: ficou claro qual era a proxima acao."
            required
          />
        </label>
        <label className="block text-sm font-semibold text-ink-800">
          O que confundiu
          <textarea
            className="mt-2 min-h-20 w-full resize-y rounded-control border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900"
            maxLength={500}
            name="confused"
            placeholder="Ex.: nao entendi se era rascunho ou dado salvo."
            required
          />
        </label>
        <label className="block text-sm font-semibold text-ink-800">
          Onde travou
          <textarea
            className="mt-2 min-h-20 w-full resize-y rounded-control border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900"
            maxLength={500}
            name="blocked"
            placeholder="Ex.: muitos passos antes de comecar."
            required
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["clarityScore", "Clareza"],
          ["usefulnessScore", "Utilidade"],
          ["frictionScore", "Peso"]
        ].map(([name, label]) => (
          <label className="block text-xs font-semibold uppercase text-ink-600" key={name}>
            {label}
            <select
              className="mt-2 w-full rounded-control border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900"
              defaultValue={name === "frictionScore" ? 2 : 4}
              name={name}
            >
              {scoreOptions.map((score) => (
                <option key={score} value={score}>
                  {score}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <label className="block text-sm font-semibold text-ink-800">
        Comentario opcional
        <textarea
          className="mt-2 min-h-20 w-full resize-y rounded-control border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900"
          maxLength={800}
          name="comment"
          placeholder="Uma frase curta sobre o que simplificaria o beta."
        />
      </label>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button className="w-full sm:w-auto" intent="action" type="submit">
          {persistFeedback ? "Enviar feedback seguro" : "Preparar rascunho local"}
        </Button>
        {externalUrl ? (
          <a
            className="inline-flex min-h-11 items-center justify-center rounded-control border border-ink-200 px-4 text-sm font-semibold text-ink-800 hover:bg-ink-50"
            href={externalUrl}
            rel="noreferrer"
            target="_blank"
          >
            Abrir formulario
          </a>
        ) : null}
      </div>

      <div aria-live="polite">
        {status?.kind === "success" ? (
          <SuccessState description={status.message} title="Rascunho local pronto" />
        ) : null}
        {status?.kind === "error" ? (
          <p className="rounded-card border border-warmth-100 bg-warmth-50 p-3 text-sm font-semibold text-warmth-900">
            {status.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
