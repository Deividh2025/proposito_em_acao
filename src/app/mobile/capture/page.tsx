import { MobileCaptureForm } from "@/components/mobile/MobileCaptureForm";
import { MobileShell } from "@/components/mobile/MobileShell";

export const dynamic = "force-dynamic";

export default function MobileCapturePage() {
  return (
    <MobileShell
      subtitle="Tire o ruído da cabeça. A classificação e o processamento ficam para depois."
      title="Captura rápida"
    >
      <MobileCaptureForm />
    </MobileShell>
  );
}
