"use client";

import { InboxIcon, Sparkles } from "lucide-react";
import { useState, useTransition } from "react";

import { captureInboxItem, classifyInboxItem, processInboxItem } from "@/app/inbox/actions";
import type { InboxClassificationOutput } from "@/ai/schemas";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { SensitiveDataNotice } from "@/components/ui/SensitiveDataNotice";
import { SuccessState } from "@/components/ui/SuccessState";
import { Textarea } from "@/components/ui/Textarea";
import { sampleInboxItems } from "@/domain/inbox";
import type { InboxItem, InboxDestinationType } from "@/domain/inbox";
import { InboxItemCard } from "./InboxItemCard";
import { InboxList } from "./InboxList";
import { InboxProcessPanel } from "./InboxProcessPanel";

export function InboxCapture() {
  const [content, setContent] = useState("Agendar revisão financeira sexta às 9h por 25 minutos");
  const [contentType, setContentType] = useState("text");
  const [items, setItems] = useState<InboxItem[]>(sampleInboxItems);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [classification, setClassification] = useState<InboxClassificationOutput | null>(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const activeItem = items.find((item) => item.id === activeItemId) ?? null;

  function capture() {
    const id = `local-inbox-${Date.now()}`;
    const item: InboxItem = {
      id,
      content,
      contentType: contentType as InboxItem["contentType"],
      status: "captured",
      createdAt: new Date().toISOString()
    };

    startTransition(async () => {
      const result = await captureInboxItem({ content, contentType });
      setItems((current) => [{ ...item, id: result.id ?? id }, ...current]);
      setActiveItemId(result.id ?? id);
      setClassification(null);
      setMessage(result.message);
    });
  }

  function classify() {
    const target = activeItem ?? items[0];

    if (!target) {
      return;
    }

    startTransition(async () => {
      const result = await classifyInboxItem({ itemId: target.id, content: target.content });
      if (result.classification) {
        setClassification(result.classification);
        setItems((current) =>
          current.map((item) =>
            item.id === target.id
              ? { ...item, classification: result.classification, status: "triaged" }
              : item
          )
        );
      }
      setActiveItemId(target.id);
      setMessage(result.message);
    });
  }

  function convert(destinationType: InboxDestinationType) {
    const target = activeItem ?? items[0];

    if (!target) {
      return;
    }

    startTransition(async () => {
      const result = await processInboxItem({
        itemId: target.id,
        content: target.content,
        classification: classification ?? target.classification,
        destinationType,
        note: "Processado em lote curto pelo Prompt 9."
      });
      setItems((current) =>
        current.map((item) =>
          item.id === target.id
            ? {
                ...item,
                destinationType,
                destinationId: result.id,
                status:
                  destinationType === "calendar_event" || destinationType === "task" || destinationType === "project"
                    ? "converted"
                    : destinationType === "discard"
                      ? "discarded"
                      : "archived"
              }
            : item
        )
      );
      setMessage(result.message);
    });
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="space-y-5">
        <Card as="section" className="space-y-4">
          <div className="flex items-start gap-3">
            <InboxIcon aria-hidden className="mt-1 h-5 w-5 text-purpose-700" />
            <div>
              <h2 className="text-xl font-bold text-ink-900">Capturar sem decidir agora</h2>
              <p className="mt-1 text-sm leading-6 text-ink-600">
                Tire o ruído da cabeça primeiro. A classificação vem depois e sempre é revisável.
              </p>
            </div>
          </div>
          <label className="grid gap-2 text-sm font-semibold text-ink-900">
            Captura rápida
            <Textarea value={content} onChange={(event) => setContent(event.target.value)} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink-900">
            Tipo de captura
            <Select value={contentType} onChange={(event) => setContentType(event.target.value)}>
              <option value="text">texto</option>
              <option value="link">link</option>
              <option value="voice_note">áudio futuro</option>
              <option value="image_placeholder">imagem futura</option>
            </Select>
          </label>
          <div className="flex flex-wrap gap-3">
            <Button disabled={isPending} onClick={capture}>
              Capturar
            </Button>
            <Button disabled={isPending || items.length === 0} onClick={classify} variant="soft">
              <Sparkles aria-hidden className="h-4 w-4" />
              Classificar captura
            </Button>
          </div>
        </Card>

        {message ? <SuccessState description={message} title="Atualização local/dev" /> : null}

        <InboxList items={items} onSelect={(item) => setActiveItemId(item.id)} selectedItemId={activeItemId} />
      </div>

      <aside className="space-y-4">
        <SensitiveDataNotice>
          Inbox bruta pode conter fé, família, saúde, finanças, emoções ou preocupações. Nada vai ao Atalaia.
        </SensitiveDataNotice>
        {activeItem ? <InboxItemCard item={activeItem} /> : null}
        <InboxProcessPanel
          classification={classification ?? activeItem?.classification}
          key={classification?.suggested_title ?? activeItem?.classification?.suggested_title ?? activeItem?.id ?? "empty"}
          onConvert={convert}
        />
      </aside>
    </div>
  );
}
