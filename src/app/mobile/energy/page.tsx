import { MobileEnergyCheckIn } from "@/components/mobile/MobileEnergyCheckIn";
import { MobileShell } from "@/components/mobile/MobileShell";

export default function MobileEnergyPage() {
  return (
    <MobileShell
      subtitle="Registre energia em um toque e ajuste a próxima ação ao corpo de hoje."
      title="Energia"
    >
      <MobileEnergyCheckIn />
    </MobileShell>
  );
}
