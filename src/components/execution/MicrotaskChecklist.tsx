"use client";

import { useMemo, useState, useTransition } from "react";

import { updateMicrotaskStatus } from "@/app/tasks/actions";
import { Checkbox } from "@/components/ui/Checkbox";
import { Tag } from "@/components/ui/Tag";
import type { TaskBreakdownOutput } from "@/ai/schemas";

type MicrotaskChecklistProps = {
  taskId?: string;
  breakdown: TaskBreakdownOutput;
};

export function MicrotaskChecklist({ taskId, breakdown }: MicrotaskChecklistProps) {
  const [completed, setCompleted] = useState<Record<number, boolean>>({});
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const nextMicrotask = useMemo(
    () => breakdown.microtasks.find((microtask) => !completed[microtask.order]),
    [breakdown.microtasks, completed]
  );

  function toggle(order: number, checked: boolean) {
    setCompleted((current) => ({ ...current, [order]: checked }));
    setMessage("Microtarefa atualizada nesta sessao.");

    if (taskId) {
      startTransition(async () => {
        const result = await updateMicrotaskStatus({
          microtaskId: `${taskId}-${order}`,
          status: checked ? "completed" : "pending"
        });
        setMessage(result.message);
      });
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-card border border-purpose-100 bg-purpose-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-purpose-700">Proxima microacao</p>
        <p className="mt-2 text-base font-bold text-purpose-900">
          {nextMicrotask?.title ?? "Registrar a conclusao e escolher o proximo passo."}
        </p>
      </div>
      <ol className="space-y-3">
        {breakdown.microtasks.map((microtask) => (
          <li
            className="rounded-card border border-ink-100 bg-white p-3"
            key={`${microtask.order}-${microtask.title}`}
          >
            <Checkbox
              checked={Boolean(completed[microtask.order])}
              disabled={isPending}
              label={`${microtask.order}. ${microtask.title}`}
              onChange={(event) => toggle(microtask.order, event.currentTarget.checked)}
            />
            <div className="mt-2 flex flex-wrap gap-2 pl-7">
              <Tag>{microtask.estimated_minutes} min</Tag>
              <Tag>microtarefa</Tag>
            </div>
          </li>
        ))}
      </ol>
      {message ? <p className="text-sm leading-6 text-ink-600">{message}</p> : null}
    </div>
  );
}
