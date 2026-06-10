import { MobileShell } from "@/components/mobile/MobileShell";
import { MobileUnblockerQuick } from "@/components/mobile/MobileUnblockerQuick";

export const dynamic = "force-dynamic";

export default function MobileUnblockPage() {
  return (
    <MobileShell
      subtitle="Poucos campos, um primeiro passo e rota segura para foco ou Metacognição."
      title="Desbloqueador rápido"
    >
      <MobileUnblockerQuick />
    </MobileShell>
  );
}
