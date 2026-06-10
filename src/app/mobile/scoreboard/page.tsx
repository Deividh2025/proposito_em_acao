import Link from "next/link";

export const dynamic = "force-dynamic";

import { MobileScoreboardCheck } from "@/components/mobile/MobileScoreboardCheck";
import { MobileShell } from "@/components/mobile/MobileShell";

export default function MobileScoreboardPage() {
  return (
    <MobileShell
      subtitle="MarcaÃ§Ã£o leve. Retomada conta como progresso real."
      title="Placar rÃ¡pido"
    >
      <MobileScoreboardCheck />
      <Link className="text-sm font-semibold text-purpose-900" href="/scoreboard">
        Abrir Placar completo
      </Link>
    </MobileShell>
  );
}
