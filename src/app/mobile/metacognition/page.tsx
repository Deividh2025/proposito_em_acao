import { MobileMetacognitionQuick } from "@/components/mobile/MobileMetacognitionQuick";
import { MobileShell } from "@/components/mobile/MobileShell";

export const dynamic = "force-dynamic";

export default function MobileMetacognitionPage() {
  return (
    <MobileShell
      subtitle="Privada por padrão. Separar fato e interpretação sem transformar isso em terapia."
      title="Metacognição rápida"
    >
      <MobileMetacognitionQuick />
    </MobileShell>
  );
}
