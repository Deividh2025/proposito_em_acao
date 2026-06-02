import Link from "next/link";
import { Inbox, Leaf, ListRestart, TimerReset, Zap } from "lucide-react";

import { MobileShell } from "@/components/mobile/MobileShell";

const todayActions = [
  { href: "/mobile/capture", label: "Capturar agora", icon: Inbox },
  { href: "/mobile/energy", label: "Registrar energia", icon: Zap },
  { href: "/mobile/focus", label: "Foco 5 min", icon: TimerReset },
  { href: "/mobile/habits", label: "Marcar hábito", icon: Leaf },
  { href: "/mobile/unblock", label: "Destravar tarefa", icon: ListRestart }
];

export default function MobileTodayPage() {
  return (
    <MobileShell
      subtitle="Uma lista curta para voltar ao movimento sem abrir a plataforma inteira."
      title="Hoje"
    >
      <section className="space-y-3">
        {todayActions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              className="flex min-h-16 items-center gap-3 rounded-card border border-ink-100 bg-white p-4 font-semibold text-ink-900 shadow-sm"
              href={action.href}
              key={action.href}
            >
              <Icon aria-hidden className="h-5 w-5 text-purpose-700" />
              {action.label}
            </Link>
          );
        })}
      </section>
    </MobileShell>
  );
}
