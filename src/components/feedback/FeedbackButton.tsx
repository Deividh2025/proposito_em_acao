"use client";

import { MessageSquare, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import type { BetaFeedbackInput } from "@/domain/feedback";

import { FeedbackForm } from "./FeedbackForm";

type FeedbackButtonProps = {
  defaultModule?: BetaFeedbackInput["module"];
  compact?: boolean;
};

const betaFeedbackUrl = process.env.NEXT_PUBLIC_BETA_FEEDBACK_URL;

export function FeedbackButton({ compact = false, defaultModule = "dashboard" }: FeedbackButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section
      aria-labelledby={compact ? "mobile-beta-feedback-heading" : "beta-feedback-heading"}
      className={compact ? "rounded-card border border-ink-100 bg-white p-4" : "space-y-3"}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2
            className="text-sm font-bold text-ink-900"
            id={compact ? "mobile-beta-feedback-heading" : "beta-feedback-heading"}
          >
            Feedback beta
          </h2>
          <p className="mt-1 text-xs leading-5 text-ink-600">
            Ajude a encontrar atrito sem enviar conteudo privado.
          </p>
        </div>
        {isOpen ? (
          <IconButton icon={<X aria-hidden className="h-4 w-4" />} label="Fechar feedback beta" onClick={() => setIsOpen(false)} />
        ) : null}
      </div>

      {isOpen ? (
        <div className="mt-3">
          <FeedbackForm defaultModule={defaultModule} externalUrl={betaFeedbackUrl} />
        </div>
      ) : (
        <Button
          className="mt-3 w-full"
          intent="neutral"
          onClick={() => setIsOpen(true)}
          type="button"
          variant="outline"
        >
          <MessageSquare aria-hidden className="h-4 w-4" />
          Enviar feedback
        </Button>
      )}
    </section>
  );
}
