import Link from "next/link";
import { Brain, Gauge, Home, Inbox, Leaf, TimerReset, Zap } from "lucide-react";

const items = [
  { href: "/mobile", label: "Início", icon: Home },
  { href: "/mobile/capture", label: "Capturar", icon: Inbox },
  { href: "/mobile/focus", label: "Foco", icon: TimerReset },
  { href: "/mobile/habits", label: "Hábitos", icon: Leaf },
  { href: "/mobile/energy", label: "Energia", icon: Zap },
  { href: "/mobile/scoreboard", label: "Placar", icon: Gauge },
  { href: "/mobile/metacognition", label: "Clarear", icon: Brain }
];

export function MobileQuickNav() {
  return (
    <nav
      aria-label="Ações rápidas mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-100 bg-white/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 shadow-soft backdrop-blur lg:hidden"
    >
      <div className="mx-auto grid max-w-xl grid-cols-7 gap-1">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              aria-label={item.label}
              className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-control px-1 text-center text-[0.65rem] font-semibold text-ink-600 hover:bg-purpose-50 hover:text-purpose-900"
              href={item.href}
              key={item.href}
            >
              <Icon aria-hidden className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
