import { MobileMetacognitionQuick } from "@/components/mobile/MobileMetacognitionQuick";
import { MobileShell } from "@/components/mobile/MobileShell";

export const dynamic = "force-dynamic";

export default function MobileMetacognitionPage() {
  return (
    <MobileShell
      subtitle="Privada por padrÃ£o. Separar fato e interpretaÃ§Ã£o sem transformar isso em terapia."
      title="MetacogniÃ§Ã£o rÃ¡pida"
    >
      <MobileMetacognitionQuick />
    </MobileShell>
  );
}
