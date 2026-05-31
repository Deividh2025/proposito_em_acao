import { NextActionCard, ProgressNudge } from "@/components/execution/ExecutionComponents";
import { LifeGardenPreview } from "@/components/garden/GardenComponents";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { ScoreboardCard } from "@/components/scoreboard/ScoreboardComponents";
import { getPlaceholderPage } from "@/lib/design/navigation";

export default function DashboardPage() {
  const page = getPlaceholderPage("/dashboard")!;

  return (
    <PlaceholderPage page={page}>
      <div className="grid gap-4 lg:grid-cols-2">
        <NextActionCard />
        <ProgressNudge />
        <ScoreboardCard />
        <LifeGardenPreview />
      </div>
    </PlaceholderPage>
  );
}
