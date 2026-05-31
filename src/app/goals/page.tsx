import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { GoalSummary } from "@/components/goals/GoalSummary";
import { Button } from "@/components/ui/Button";
import { sampleExecutionLinks, sampleSmartGoal } from "@/domain/execution/sample-data";

export default function GoalsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        action={
          <Link href="/goals/new">
            <Button>Criar alvo</Button>
          </Link>
        }
        description="Transforme desejos vagos em alvos SMART-E com ecologia, Chamado e primeira acao revisavel."
        status="Prompt 8"
        title="Alvos SMART-E"
      />
      <GoalSummary goal={sampleSmartGoal} goalId={sampleExecutionLinks.goalId} />
    </div>
  );
}
