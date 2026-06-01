import { Progress } from "@/components/ui/Progress";

export function StreakSoftIndicator({ value = 60 }: { value?: number }) {
  return <Progress label="Ritmo suave" value={value} />;
}
