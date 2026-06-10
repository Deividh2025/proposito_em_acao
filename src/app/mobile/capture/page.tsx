import { MobileCaptureForm } from "@/components/mobile/MobileCaptureForm";
import { MobileShell } from "@/components/mobile/MobileShell";

export const dynamic = "force-dynamic";

export default function MobileCapturePage() {
  return (
    <MobileShell
      subtitle="Tire o ruÃ­do da cabeÃ§a. A classificaÃ§Ã£o e o processamento ficam para depois."
      title="Captura rÃ¡pida"
    >
      <MobileCaptureForm />
    </MobileShell>
  );
}
