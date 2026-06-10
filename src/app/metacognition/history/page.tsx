import { MetacognitionHistoryList } from "@/components/metacognition/MetacognitionHistoryList";
import { PageHeader } from "@/components/layout/PageHeader";
import { SensitiveDataNotice } from "@/components/ui/SensitiveDataNotice";

export const dynamic = "force-dynamic";

export default function MetacognitionHistoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        description="Revise sessÃµes privadas de forma compacta. ConteÃºdo Ã­ntimo longo nÃ£o Ã© exibido por padrÃ£o."
        status="Prompt 10"
        title="HistÃ³rico privado"
      />
      <SensitiveDataNotice>
        HistÃ³rico de MetacogniÃ§Ã£o Ã© owner-only. NÃ£o hÃ¡ compartilhamento automÃ¡tico com Atalaia.
      </SensitiveDataNotice>
      <MetacognitionHistoryList />
    </div>
  );
}
