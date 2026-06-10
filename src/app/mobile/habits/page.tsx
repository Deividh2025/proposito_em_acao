import Link from "next/link";

export const dynamic = "force-dynamic";

import { MobileHabitCheck } from "@/components/mobile/MobileHabitCheck";
import { MobileShell } from "@/components/mobile/MobileShell";

export default function MobileHabitsPage() {
  return (
    <MobileShell
      subtitle="Marque o que aconteceu hoje. Criar ou editar hÃ¡bito fica no desktop."
      title="HÃ¡bitos rÃ¡pidos"
    >
      <MobileHabitCheck />
      <Link className="text-sm font-semibold text-purpose-900" href="/habits">
        Abrir hÃ¡bitos completos
      </Link>
    </MobileShell>
  );
}
