import { FocusStartButton, TimeAvailableSelector } from "@/components/execution/ExecutionComponents";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { Progress } from "@/components/ui/Progress";
import { getPlaceholderPage } from "@/lib/design/navigation";

export default function FocusPage() {
  const page = getPlaceholderPage("/focus")!;

  return (
    <PlaceholderPage page={page}>
      <div className="grid gap-4 lg:grid-cols-2">
        <TimeAvailableSelector />
        <Progress label="Preparação do modo foco" value={20} />
        <div>
          <FocusStartButton />
        </div>
      </div>
    </PlaceholderPage>
  );
}
