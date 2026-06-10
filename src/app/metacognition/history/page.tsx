import { MetacognitionHistoryList } from "@/components/metacognition/MetacognitionHistoryList";
import { PageHeader } from "@/components/layout/PageHeader";
import { SensitiveDataNotice } from "@/components/ui/SensitiveDataNotice";

export const dynamic = "force-dynamic";

export default function MetacognitionHistoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        description="Revise sessões privadas de forma compacta. Conteúdo íntimo longo não é exibido por padrão."
        status="Prompt 10"
        title="Histórico privado"
      />
      <SensitiveDataNotice>
        Histórico de Metacognição é owner-only. Não há compartilhamento automático com Atalaia.
      </SensitiveDataNotice>
      <MetacognitionHistoryList />
    </div>
  );
}
