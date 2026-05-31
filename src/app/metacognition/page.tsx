import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import {
  CognitivePatternBadge,
  ConfrontationQuestionCard,
  EmotionIntensityScale,
  FactInterpretationFeelingImpulseGrid,
  MetacognitionEntryCard,
  NextActionAfterReflectionCard,
  ReframeCard,
  ThoughtBreakdownPreview
} from "@/components/metacognition/MetacognitionComponents";
import { getPlaceholderPage } from "@/lib/design/navigation";

export default function MetacognitionPage() {
  const page = getPlaceholderPage("/metacognition")!;

  return (
    <PlaceholderPage page={page}>
      <div className="grid gap-4">
        <MetacognitionEntryCard />
        <EmotionIntensityScale />
        <ThoughtBreakdownPreview />
        <FactInterpretationFeelingImpulseGrid />
        <div className="flex flex-wrap gap-2">
          <CognitivePatternBadge />
        </div>
        <ReframeCard />
        <ConfrontationQuestionCard />
        <NextActionAfterReflectionCard />
      </div>
    </PlaceholderPage>
  );
}
