import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Panel } from "@/components/ui/Panel";
import { getPlaceholderPage } from "@/lib/design/navigation";

export default function AccountabilityPage() {
  const page = getPlaceholderPage("/accountability")!;

  return (
    <PlaceholderPage page={page}>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <Badge intent="warning">Prévia obrigatória</Badge>
          <p className="mt-3 text-sm leading-6 text-ink-600">
            Atalaia será limitado por alvo, escopo e revogação futura.
          </p>
        </Panel>
        <Modal title="Consentimento granular">Componente visual base; nenhum envio real existe.</Modal>
      </div>
    </PlaceholderPage>
  );
}
