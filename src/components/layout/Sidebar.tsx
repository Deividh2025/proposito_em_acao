import Link from "next/link";

import { navigationItems } from "@/lib/design/navigation";

export function Sidebar() {
  return (
    <aside className="sticky top-4 mr-4 flex h-[calc(100vh-2rem)] flex-col rounded-panel border border-ink-100 bg-white/92 p-4 shadow-soft">
      <Link aria-label="Ir para a página inicial" className="rounded-card p-2" href="/">
        <span className="block text-lg font-bold text-ink-900">Propósito em Ação</span>
        <span className="mt-1 block text-xs font-semibold uppercase tracking-wide text-purpose-700">
          Chamado antes de agenda
        </span>
      </Link>

      <nav aria-label="Navegação principal" className="mt-5 flex-1 space-y-1 overflow-y-auto pr-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              className="group flex items-start gap-3 rounded-card px-3 py-2.5 text-sm text-ink-700 transition duration-200 hover:bg-purpose-50 hover:text-purpose-900 focus-visible:bg-action-50"
              href={item.href}
              key={item.href}
            >
              <Icon aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-purpose-700" />
              <span>
                <span className="block font-semibold">{item.label}</span>
                <span className="mt-0.5 block text-xs leading-5 text-ink-500">{item.description}</span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 rounded-card border border-action-100 bg-action-50 p-3 text-xs leading-5 text-action-900">
        Design system inicial em preparação. Nenhum fluxo final está ativo nesta etapa.
      </div>
    </aside>
  );
}
