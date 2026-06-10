import Link from "next/link";

export const dynamic = "force-dynamic";

import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectSummary } from "@/components/projects/ProjectSummary";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { loadProjectList, type ExecutionDataMode } from "@/lib/supabase/queries/execution";

export default async function ProjectsPage() {
  const projectsData = await loadProjectList();

  return (
    <div className="space-y-6">
      <PageHeader
        action={
          <Link href="/projects/new">
            <Button>Criar projeto</Button>
          </Link>
        }
        description="Projetos conectam alvos aprovados a fases, marcos, riscos, recursos e tarefas iniciais."
        status={projectsData.mode === "local-demo" ? "Amostra local-demo" : "Dados autenticados"}
        title="Projetos"
      />
      <DataStateNotice mode={projectsData.mode} message={projectsData.message} />
      {projectsData.items.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {projectsData.items.map((project) => (
            <ProjectSummary key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <EmptyProjectsState mode={projectsData.mode} />
      )}
    </div>
  );
}

function DataStateNotice({ message, mode }: { message: string; mode: ExecutionDataMode }) {
  return (
    <Card as="section" className={mode === "local-demo" ? "border-action-100 bg-action-50" : ""}>
      <p className="text-sm leading-6 text-ink-700">{message}</p>
    </Card>
  );
}

function EmptyProjectsState({ mode }: { mode: ExecutionDataMode }) {
  const needsAuth = mode === "auth-required" || mode === "blocked";

  return (
    <Card as="section">
      <h2 className="font-bold text-ink-900">
        {needsAuth ? "Nenhum projeto real carregado" : "Nenhum projeto salvo ainda"}
      </h2>
      <p className="mt-2 text-sm leading-6 text-ink-600">
        {needsAuth
          ? "Projetos reais aparecem somente com usuario autenticado e Supabase/RLS disponivel."
          : "Gere ou crie um projeto a partir de um alvo salvo para transformar direcao em tarefas pequenas."}
      </p>
      <Link className="mt-4 inline-flex" href="/projects/new">
        <Button>Criar projeto</Button>
      </Link>
    </Card>
  );
}
