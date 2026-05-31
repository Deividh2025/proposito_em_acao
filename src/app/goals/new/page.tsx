import { PageHeader } from "@/components/layout/PageHeader";
import { GoalForm } from "@/components/goals/GoalForm";

export default function NewGoalPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        description="Crie manualmente ou use o mock seguro para formular um alvo SMART-E antes de salvar."
        status="IA mock segura"
        title="Novo alvo"
      />
      <GoalForm />
    </div>
  );
}
