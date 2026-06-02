import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronLeft, ShieldCheck } from "lucide-react";

import { MobileQuickNav } from "./MobileQuickNav";

type MobileShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  showBack?: boolean;
};

export function MobileShell({ children, showBack = true, subtitle, title }: MobileShellProps) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-xl flex-col gap-4 pb-24">
      <header className="space-y-3">
        {showBack ? (
          <Link
            className="inline-flex items-center gap-1 text-sm font-semibold text-purpose-900"
            href="/mobile"
          >
            <ChevronLeft aria-hidden className="h-4 w-4" />
            Voltar
          </Link>
        ) : null}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-purpose-700">Prompt 14</p>
          <h1 className="mt-1 text-2xl font-bold text-ink-900">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-ink-600">{subtitle}</p>
        </div>
        <section className="rounded-card border border-action-100 bg-action-50 p-3 text-sm leading-6 text-action-900">
          <div className="flex items-start gap-2">
            <ShieldCheck aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
            <p>Dados sensíveis ficam privados por padrão. Nada é compartilhado com Atalaia no mobile.</p>
          </div>
        </section>
      </header>
      <main className="space-y-4">{children}</main>
      <MobileQuickNav />
    </div>
  );
}
