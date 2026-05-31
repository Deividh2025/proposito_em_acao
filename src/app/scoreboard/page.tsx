import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import {
  RestartCountBadge,
  ScoreboardCard,
  ScoreboardItem,
  ScoreboardMarker,
  StreakSoftIndicator
} from "@/components/scoreboard/ScoreboardComponents";
import { getPlaceholderPage } from "@/lib/design/navigation";

export default function ScoreboardPage() {
  const page = getPlaceholderPage("/scoreboard")!;

  return (
    <PlaceholderPage page={page}>
      <div className="grid gap-4 lg:grid-cols-2">
        <ScoreboardCard />
        <ScoreboardItem />
        <ScoreboardMarker />
        <RestartCountBadge />
        <StreakSoftIndicator />
      </div>
    </PlaceholderPage>
  );
}
