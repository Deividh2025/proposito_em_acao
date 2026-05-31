import {
  LowEnergyPrompt,
  MicrotaskList,
  TimeAvailableSelector
} from "@/components/execution/ExecutionComponents";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { getPlaceholderPage } from "@/lib/design/navigation";

export default function CalendarPage() {
  const page = getPlaceholderPage("/calendar")!;

  return (
    <PlaceholderPage page={page}>
      <div className="grid gap-4 lg:grid-cols-2">
        <TimeAvailableSelector />
        <LowEnergyPrompt />
        <MicrotaskList />
      </div>
    </PlaceholderPage>
  );
}
