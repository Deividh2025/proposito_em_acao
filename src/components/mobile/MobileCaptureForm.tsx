"use client";

import { useState, useTransition } from "react";
import { Save } from "lucide-react";

import { captureInboxItem } from "@/app/inbox/actions";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";

export function MobileCaptureForm() {
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit() {
    if (content.trim().length < 2) return;

    startTransition(async () => {
      const result = await captureInboxItem({ content, contentType: "text" });
      setMessage(`Item capturado. ${result.message}`);
      setContent("");
    });
  }

  return (
    <section className="space-y-4 rounded-card border border-ink-100 bg-white p-4 shadow-sm">
      <label className="grid gap-2 text-sm font-semibold text-ink-900">
        Captura rápida
        <Textarea
          autoFocus
          maxLength={2000}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Escreva e salve sem decidir agora."
          rows={5}
          value={content}
        />
      </label>
      <Button className="w-full" disabled={isPending || content.trim().length < 2} onClick={submit}>
        <Save aria-hidden className="h-4 w-4" />
        Salvar captura
      </Button>
      {message ? <p className="text-sm leading-6 text-ink-600">{message}</p> : null}
    </section>
  );
}
