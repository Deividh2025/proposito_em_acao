"use client";

import { useState, useTransition } from "react";

import { markScoreboardItem } from "@/app/scoreboard/actions";
import { Button } from "@/components/ui/Button";
import type { ScoreboardEntryStatus } from "@/domain/scoreboard";

const item = {
  scoreboardId: "local-mobile-scoreboard",
  itemId: "local-mobile-scoreboard-focus",
  title: "Sessão de foco honesta",
  minimum: "5 minutos com distrações capturadas"
};

export function MobileScoreboardCheck() {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function mark(status: ScoreboardEntryStatus) {
    startTransition(async () => {
      const result = await markScoreboardItem({
        itemId: item.itemId,
        scoreboardId: item.scoreboardId,
        status
      });
      setMessage(`Placar atualizado. ${result.message}`);
    });
  }

  return (
    <section className="space-y-4 rounded-card border border-ink-100 bg-white p-4 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-purpose-700">Placar de hoje</p>
        <h2 className="mt-1 text-xl font-bold text-ink-900">{item.title}</h2>
        <p className="mt-2 text-sm leading-6 text-ink-600">{item.minimum}</p>
      </div>
      <div className="grid gap-2">
        <Button disabled={isPending} onClick={() => mark("done")}>
          Feito
        </Button>
        <Button disabled={isPending} onClick={() => mark("partial")} variant="soft">
          Parcial
        </Button>
        <Button disabled={isPending} onClick={() => mark("restarted")} variant="soft">
          Retomado
        </Button>
      </div>
      {message ? <p className="text-sm leading-6 text-ink-600">{message}</p> : null}
    </section>
  );
}
