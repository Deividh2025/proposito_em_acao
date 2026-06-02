import Link from "next/link";

import { MobileHabitCheck } from "@/components/mobile/MobileHabitCheck";
import { MobileShell } from "@/components/mobile/MobileShell";

export default function MobileHabitsPage() {
  return (
    <MobileShell
      subtitle="Marque o que aconteceu hoje. Criar ou editar hábito fica no desktop."
      title="Hábitos rápidos"
    >
      <MobileHabitCheck />
      <Link className="text-sm font-semibold text-purpose-900" href="/habits">
        Abrir hábitos completos
      </Link>
    </MobileShell>
  );
}
