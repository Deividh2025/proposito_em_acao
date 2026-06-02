import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ReviewHistoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        description="Historico privado das revisoes semanais salvas no Supabase quando houver sessao ativa."
        status="Prompt 12"
        title="Historico de revisoes"
      />
      <EmptyState
        description="Sem uma sessao Supabase aplicada, as revisoes ficam em modo local/dev e nao aparecem como historico persistido."
        title="Historico privado em preparacao"
      />
    </div>
  );
}
