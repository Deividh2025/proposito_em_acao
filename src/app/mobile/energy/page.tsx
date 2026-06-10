import { MobileEnergyCheckIn } from "@/components/mobile/MobileEnergyCheckIn";
import { MobileShell } from "@/components/mobile/MobileShell";

export const dynamic = "force-dynamic";

export default function MobileEnergyPage() {
  return (
    <MobileShell
      subtitle="Registre energia em um toque e ajuste a prÃ³xima aÃ§Ã£o ao corpo de hoje."
      title="Energia"
    >
      <MobileEnergyCheckIn />
    </MobileShell>
  );
}
