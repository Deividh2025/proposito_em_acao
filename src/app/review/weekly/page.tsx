import { PageHeader } from "@/components/layout/PageHeader";
import { WeeklyReviewForm } from "@/components/review/WeeklyReviewForm";

export const dynamic = "force-dynamic";

export default function WeeklyReviewPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        description="Feche a semana com honestidade, detecte padroes e escolha a primeira acao da proxima semana."
        status="Prompt 12"
        title="Revisao semanal"
      />
      <WeeklyReviewForm />
    </div>
  );
}
