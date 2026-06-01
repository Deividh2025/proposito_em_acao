"use client";

import { useEffect, useState, useTransition } from "react";
import { Trash2 } from "lucide-react";

import { deleteMetacognitionSession, listMetacognitionHistory } from "@/app/metacognition/actions";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

type HistoryItem = {
  id: string;
  stateName: string;
  pattern: string;
  reframe: string;
  nextAction: string;
  crisis: boolean;
  createdAt: string;
};

export function MetacognitionHistoryList() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let active = true;

    startTransition(async () => {
      const result = await listMetacognitionHistory({ limit: 6 });

      if (active) {
        setItems(result.items);
        setMessage(result.message);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  function removeSession(sessionId: string) {
    startTransition(async () => {
      const result = await deleteMetacognitionSession({ sessionId });
      setMessage(result.message);

      if (result.ok) {
        setItems((current) => current.filter((item) => item.id !== sessionId));
      }
    });
  }

  return (
    <section className="space-y-3" aria-label="Histórico privado de Metacognição">
      <div>
        <h2 className="font-bold text-ink-900">Histórico privado</h2>
        <p className="mt-1 text-sm leading-6 text-ink-600">
          Cards compactos. Conteúdo bruto longo fica minimizado por padrão.
        </p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          description="Suas sessões privadas aparecerão aqui após revisão e salvamento explícito."
          title="Sem sessões salvas"
        />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card as="article" key={item.id}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge intent={item.crisis ? "danger" : "lowEnergy"}>
                  {item.crisis ? "segurança" : "privado"}
                </Badge>
                <Button
                  aria-label={`Excluir ${item.stateName}`}
                  disabled={isPending}
                  intent="danger"
                  onClick={() => removeSession(item.id)}
                  size="sm"
                  variant="ghost"
                >
                  <Trash2 aria-hidden className="h-4 w-4" />
                </Button>
              </div>
              <h3 className="mt-3 font-bold text-ink-900">{item.stateName}</h3>
              <p className="mt-2 text-xs font-semibold text-ink-500">{item.pattern}</p>
              <p className="mt-2 text-sm leading-6 text-ink-600">{item.reframe}</p>
              <p className="mt-3 text-sm font-semibold leading-6 text-purpose-900">{item.nextAction}</p>
            </Card>
          ))}
        </div>
      )}

      {message ? <p className="text-sm leading-6 text-ink-600">{message}</p> : null}
    </section>
  );
}
