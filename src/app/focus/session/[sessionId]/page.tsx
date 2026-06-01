import { FocusSessionShell } from "@/components/focus/FocusSessionShell";
import { PageHeader } from "@/components/layout/PageHeader";

type FocusSessionPageProps = {
  params: Promise<{ sessionId: string }>;
};

export default async function FocusSessionPage({ params }: FocusSessionPageProps) {
  const { sessionId } = await params;

  return (
    <div className="space-y-6">
      <PageHeader
        description="Sessao de foco em andamento, com ambiente limpo e captura rapida de distracoes."
        status="Prompt 11"
        title="Sessao de foco"
      />
      <FocusSessionShell initialSessionId={sessionId} />
    </div>
  );
}
