import { PageHeader } from "@/components/layout/PageHeader";
import { ScoreboardCard } from "@/components/scoreboard/ScoreboardCard";

export default function ScoreboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        description="Marque comportamentos-chave, habitos, foco e retomadas de forma leve, privada e sem vergonha."
        status="Prompt 11"
        title="Placar da Disciplina"
      />
      <ScoreboardCard />
    </div>
  );
}
