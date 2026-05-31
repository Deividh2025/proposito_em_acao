import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectSummary } from "@/components/projects/ProjectSummary";
import { Button } from "@/components/ui/Button";
import { sampleExecutionLinks, sampleProjectPlan } from "@/domain/execution/sample-data";

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        action={
          <Link href="/projects/new">
            <Button>Criar projeto</Button>
          </Link>
        }
        description="Projetos conectam alvos aprovados a fases, marcos, riscos, recursos e tarefas iniciais."
        status="Prompt 8"
        title="Projetos"
      />
      <ProjectSummary plan={sampleProjectPlan} projectId={sampleExecutionLinks.projectId} />
    </div>
  );
}
