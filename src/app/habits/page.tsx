import { RestartPrompt } from "@/components/execution/ExecutionComponents";
import { WisdomNote } from "@/components/faith/FaithComponents";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { StreakSoftIndicator } from "@/components/scoreboard/ScoreboardComponents";
import { getPlaceholderPage } from "@/lib/design/navigation";

export default function HabitsPage() {
  const page = getPlaceholderPage("/habits")!;

  return (
    <PlaceholderPage page={page}>
      <div className="grid gap-4 lg:grid-cols-2">
        <RestartPrompt />
        <StreakSoftIndicator />
        <WisdomNote />
      </div>
    </PlaceholderPage>
  );
}
