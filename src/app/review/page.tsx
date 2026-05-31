import { ProgressNudge, RestartPrompt } from "@/components/execution/ExecutionComponents";
import { GratitudePrompt } from "@/components/faith/FaithComponents";
import { LifeGardenPreview } from "@/components/garden/GardenComponents";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { getPlaceholderPage } from "@/lib/design/navigation";

export default function ReviewPage() {
  const page = getPlaceholderPage("/review")!;

  return (
    <PlaceholderPage page={page}>
      <div className="grid gap-4 lg:grid-cols-2">
        <RestartPrompt />
        <ProgressNudge />
        <LifeGardenPreview />
        <GratitudePrompt />
      </div>
    </PlaceholderPage>
  );
}
