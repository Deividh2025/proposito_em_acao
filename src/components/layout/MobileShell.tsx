import Link from "next/link";

import { quickActionItems } from "@/lib/design/navigation";

export function MobileShell() {
  return (
    <div className="lg:hidden" data-testid="mobile-shell">
      <header className="sticky top-0 z-30 border-b border-ink-100 bg-white/95 px-4 py-3 backdrop-blur">
        <p className="text-sm font-bold text-ink-900">Propósito em Ação</p>
        <p className="text-xs text-ink-500">Ações rápidas, sem copiar o desktop inteiro.</p>
      </header>
      <nav
        aria-label="Navegação mobile"
        className="grid grid-cols-4 border-b border-ink-100 bg-white/96 px-2 py-2 shadow-soft"
      >
        {quickActionItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              className="flex flex-col items-center gap-1 rounded-control px-2 py-2 text-center text-[0.7rem] font-semibold text-ink-600 hover:bg-purpose-50 hover:text-purpose-900"
              href={item.href}
              key={item.href}
            >
              <Icon aria-hidden className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
