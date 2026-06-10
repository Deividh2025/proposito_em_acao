import { MetacognitionForm } from "@/components/metacognition/MetacognitionForm";
import { PageHeader } from "@/components/layout/PageHeader";

export const dynamic = "force-dynamic";

export default function MetacognitionPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        description="Separe fato, interpretação, sentimento e impulso; confronte sem humilhação e volte para uma rota segura."
        status="Prompt 10"
        title="Metacognição"
      />
      <MetacognitionForm />
    </div>
  );
}
