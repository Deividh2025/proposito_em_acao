import Link from "next/link";

import { NextActionCard, ProgressNudge, RestartPrompt } from "@/components/execution/ExecutionComponents";
import { LifeGardenPreview } from "@/components/garden/GardenComponents";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { placeholderPages } from "@/lib/design/navigation";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        description="Fundação visual desktop-first para transformar direção em próxima ação, com baixa fricção, retomada sem culpa e componentes preparados para as próximas etapas."
        status="base visual"
        title="Propósito em Ação"
      />

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <NextActionCard />
        <div className="grid gap-4">
          <RestartPrompt />
          <ProgressNudge />
        </div>
      </section>

      <section aria-labelledby="areas-heading" className="space-y-4">
        <SectionHeader
          description="Rotas placeholder criadas para validar a arquitetura visual sem implementar fluxos finais."
          id="areas-heading"
          title="Áreas em preparação"
        />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {placeholderPages.map((page) => (
            <Link
              className="rounded-card border border-ink-100 bg-white p-4 shadow-sm transition duration-200 hover:border-purpose-300 hover:bg-purpose-50"
              href={page.href}
              key={page.href}
            >
              <Badge intent="neutral">Status: {page.status}</Badge>
              <h2 className="mt-3 font-bold text-ink-900">{page.title}</h2>
              <p className="mt-2 text-sm leading-6 text-ink-600">{page.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <LifeGardenPreview />

      <Card as="aside" className="border-action-100 bg-action-50">
        Esta página é uma base navegável do design system. Nenhuma chamada real a Supabase,
        OpenAI, Auth, Atalaia ou fluxo final de produto foi criada.
      </Card>
    </div>
  );
}
