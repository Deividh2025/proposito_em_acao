import { Clock3 } from "lucide-react";

import { unscheduledTaskSummaries } from "@/domain/calendar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";

export function UnscheduledTasksPanel() {
  return (
    <Card as="section">
      <div className="flex items-center gap-2">
        <Clock3 aria-hidden className="h-4 w-4 text-action-700" />
        <h2 className="font-bold text-ink-900">Tarefas não agendadas</h2>
      </div>
      <div className="mt-4 space-y-3">
        {unscheduledTaskSummaries.map((task) => (
          <article className="rounded-card border border-ink-100 bg-ink-50 p-3" key={task.id}>
            <h3 className="text-sm font-bold text-ink-900">{task.title}</h3>
            <p className="mt-1 text-xs leading-5 text-ink-600">{task.nextAction}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Tag>{task.estimatedMinutes} min</Tag>
              <Tag>energia {task.energyLevel}</Tag>
            </div>
            <Button className="mt-3 w-full" size="sm" variant="outline">
              Agendar tarefa
            </Button>
          </article>
        ))}
      </div>
    </Card>
  );
}
