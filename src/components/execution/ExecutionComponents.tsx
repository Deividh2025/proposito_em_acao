import { Play, RotateCcw, Zap } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { Tag } from "@/components/ui/Tag";

export function NextActionCard() {
  return (
    <Card className="border-purpose-100 bg-purpose-50">
      <Badge intent="purpose">Próxima ação</Badge>
      <h2 className="mt-3 text-xl font-bold text-purpose-900">Escolher o menor passo fiel de hoje</h2>
      <p className="mt-2 text-sm leading-6 text-purpose-900">
        Placeholder visual para a ação principal do dashboard. Não há dados reais nem decisão
        automática nesta etapa.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Tag>10 min</Tag>
        <Tag>energia baixa compatível</Tag>
      </div>
    </Card>
  );
}

export function EnergySelector() {
  return (
    <Card>
      <h2 className="font-bold text-ink-900">Energia atual</h2>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {["Baixa", "Média", "Alta"].map((item) => (
          <button
            className="rounded-control border border-ink-100 bg-white px-3 py-2 text-sm font-semibold text-ink-700 hover:bg-action-50"
            key={item}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>
    </Card>
  );
}

export function TimeAvailableSelector() {
  return (
    <Card>
      <h2 className="font-bold text-ink-900">Tempo disponível</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {[5, 10, 25, 50].map((minutes) => (
          <Tag key={minutes}>{minutes} min</Tag>
        ))}
      </div>
    </Card>
  );
}

export function MicrotaskList() {
  const tasks = ["Abrir o arquivo certo", "Escolher uma microação", "Registrar o próximo passo"];

  return (
    <Card>
      <h2 className="font-bold text-ink-900">Microtarefas visíveis</h2>
      <ol className="mt-3 space-y-2">
        {tasks.map((task, index) => (
          <li className="flex items-center gap-3 text-sm text-ink-700" key={task}>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purpose-50 text-xs font-bold text-purpose-900">
              {index + 1}
            </span>
            {task}
          </li>
        ))}
      </ol>
    </Card>
  );
}

export function FocusStartButton() {
  return (
    <Button intent="action" size="lg">
      <Play aria-hidden className="h-4 w-4" />
      Iniciar foco curto
    </Button>
  );
}

export function ProgressNudge() {
  return (
    <Card>
      <div className="flex items-center gap-2">
        <Zap aria-hidden className="h-5 w-5 text-warmth-700" />
        <h2 className="font-bold text-ink-900">Avanço saudável</h2>
      </div>
      <p className="mt-2 text-sm leading-6 text-ink-600">
        Reforço breve para progresso real, sem ranking público ou cobrança moral.
      </p>
      <div className="mt-4">
        <Progress label="Base da etapa" value={35} />
      </div>
    </Card>
  );
}

export function RestartPrompt() {
  return (
    <Card className="border-warmth-100 bg-warmth-50">
      <RotateCcw aria-hidden className="h-5 w-5 text-warmth-900" />
      <h2 className="mt-2 font-bold text-warmth-900">Recomeçar sem culpa</h2>
      <p className="mt-2 text-sm leading-6 text-warmth-900">
        Qual é o menor retorno honesto que cabe agora?
      </p>
    </Card>
  );
}

export function LowEnergyPrompt() {
  return (
    <Card className="border-action-100 bg-action-50">
      <h2 className="font-bold text-action-900">Modo baixa energia</h2>
      <p className="mt-2 text-sm leading-6 text-action-900">
        Reduzir para uma versão mínima, curta e objetiva. Descanso legítimo continua permitido.
      </p>
    </Card>
  );
}
