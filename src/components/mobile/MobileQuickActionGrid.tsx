import Link from "next/link";
import { Brain, Gauge, Inbox, Leaf, ListRestart, SunMedium, TimerReset, Zap } from "lucide-react";

const actions = [
  {
    href: "/mobile/capture",
    label: "Capturar",
    description: "ideia, tarefa ou preocupação",
    icon: Inbox
  },
  {
    href: "/mobile/habits",
    label: "Hábitos",
    description: "mínimo, retomada ou pausa",
    icon: Leaf
  },
  {
    href: "/mobile/scoreboard",
    label: "Placar",
    description: "feito, parcial ou retomado",
    icon: Gauge
  },
  {
    href: "/mobile/focus",
    label: "Foco 5 min",
    description: "começar pequeno",
    icon: TimerReset
  },
  {
    href: "/mobile/unblock",
    label: "Destravar",
    description: "primeiro passo",
    icon: ListRestart
  },
  {
    href: "/mobile/metacognition",
    label: "Clarear",
    description: "fato x interpretação",
    icon: Brain
  },
  {
    href: "/mobile/energy",
    label: "Energia",
    description: "baixa, média ou alta",
    icon: Zap
  },
  {
    href: "/mobile/today",
    label: "Hoje",
    description: "atalhos do momento",
    icon: SunMedium
  }
];

export function MobileQuickActionGrid() {
  return (
    <section className="grid grid-cols-2 gap-3" aria-label="Ações rápidas disponíveis">
      {actions.map((action) => {
        const Icon = action.icon;

        return (
          <Link
            className="min-h-32 rounded-card border border-ink-100 bg-white p-4 shadow-sm transition hover:border-purpose-300 hover:bg-purpose-50"
            href={action.href}
            key={action.href}
          >
            <Icon aria-hidden className="h-5 w-5 text-purpose-700" />
            <p className="mt-3 font-bold text-ink-900">{action.label}</p>
            <p className="mt-1 text-xs leading-5 text-ink-600">{action.description}</p>
          </Link>
        );
      })}
    </section>
  );
}
