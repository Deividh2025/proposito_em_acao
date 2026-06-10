import { MetacognitionForm } from "@/components/metacognition/MetacognitionForm";
import { PageHeader } from "@/components/layout/PageHeader";

export const dynamic = "force-dynamic";

export default function MetacognitionPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        description="Separe fato, interpretaÃ§Ã£o, sentimento e impulso; confronte sem humilhaÃ§Ã£o e volte para uma rota segura."
        status="Prompt 10"
        title="MetacogniÃ§Ã£o"
      />
      <MetacognitionForm />
    </div>
  );
}
