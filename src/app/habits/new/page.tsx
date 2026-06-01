import { HabitForm } from "@/components/habits/HabitForm";
import { PageHeader } from "@/components/layout/PageHeader";

export default function NewHabitPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        description="Gere um plano de habito revisavel com IA mockada segura e fallback manual."
        status="Prompt 11"
        title="Novo habito"
      />
      <HabitForm />
    </div>
  );
}
