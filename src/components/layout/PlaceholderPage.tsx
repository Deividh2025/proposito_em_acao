import type { ReactNode } from "react";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Tag } from "@/components/ui/Tag";
import type { PlaceholderPageDefinition } from "@/types/design";

import { PageHeader } from "./PageHeader";
import { SectionHeader } from "./SectionHeader";

type PlaceholderPageProps = {
  page: PlaceholderPageDefinition;
  children?: ReactNode;
};

export function PlaceholderPage({ children, page }: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <PageHeader description={page.description} status={page.status} title={page.title} />

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-4">
          <SectionHeader
            description="Componentes previstos para esta área. Eles ainda são base visual, não fluxo final."
            title="Componentes que serão usados"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {page.components.map((component) => (
              <Card as="div" key={component}>
                <h2 className="font-bold text-ink-900">{component}</h2>
                <p className="mt-2 text-sm leading-6 text-ink-600">
                  Status: base visual fundacional.
                </p>
              </Card>
            ))}
          </div>
          {children}
        </div>

        <aside className="space-y-4">
          <Card as="section" className="border-purpose-100 bg-purpose-50">
            <Badge intent="purpose">Limite de escopo</Badge>
            <p className="mt-3 text-sm leading-6 text-purpose-900">
              Nenhuma funcionalidade final foi implementada aqui. Esta rota existe para validar
              shell, navegação, componentes e responsividade.
            </p>
          </Card>
          <Card as="section">
            <h2 className="font-bold text-ink-900">Próximo passo</h2>
            <p className="mt-2 text-sm leading-6 text-ink-600">{page.nextStep}</p>
          </Card>
          {page.privacyNote ? (
            <Card as="section" className="border-action-100 bg-action-50">
              <Tag>privacidade</Tag>
              <p className="mt-3 text-sm leading-6 text-action-900">{page.privacyNote}</p>
            </Card>
          ) : null}
        </aside>
      </section>

      <EmptyState
        description="Conteúdo real, persistência, IA, Supabase, Auth e ações de produto ficam para prompts próprios."
        title="Área em preparação"
      />
    </div>
  );
}
