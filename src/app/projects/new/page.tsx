import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectPlanner } from "@/components/projects/ProjectPlanner";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        description="Use um alvo revisado para gerar projeto, tarefa inicial e plano de retomada."
        status="Planejador mock"
        title="Novo projeto"
      />
      <ProjectPlanner />
    </div>
  );
}
