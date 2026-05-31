import {
  CareNeededIndicator,
  GardenAreaTile,
  GardenGrowthIndicator,
  LifeGardenPreview
} from "@/components/garden/GardenComponents";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { getPlaceholderPage } from "@/lib/design/navigation";

export default function GardenPage() {
  const page = getPlaceholderPage("/garden")!;

  return (
    <PlaceholderPage page={page}>
      <div className="grid gap-4 lg:grid-cols-2">
        <LifeGardenPreview />
        <GardenAreaTile />
        <GardenGrowthIndicator />
        <CareNeededIndicator />
      </div>
    </PlaceholderPage>
  );
}
