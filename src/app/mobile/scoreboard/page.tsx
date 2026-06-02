import Link from "next/link";

import { MobileScoreboardCheck } from "@/components/mobile/MobileScoreboardCheck";
import { MobileShell } from "@/components/mobile/MobileShell";

export default function MobileScoreboardPage() {
  return (
    <MobileShell
      subtitle="Marcação leve. Retomada conta como progresso real."
      title="Placar rápido"
    >
      <MobileScoreboardCheck />
      <Link className="text-sm font-semibold text-purpose-900" href="/scoreboard">
        Abrir Placar completo
      </Link>
    </MobileShell>
  );
}
