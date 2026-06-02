import { LifeGarden } from "@/components/garden/GardenComponents";
import { PageHeader } from "@/components/layout/PageHeader";
import { SensitiveDataNotice } from "@/components/ui/SensitiveDataNotice";

export default function GardenPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        description="Veja progresso por areas da vida como cuidado, crescimento e retomada. Area que pede atencao nao morre; ela recebe convite de cuidado."
        status="Prompt 12"
        title="Jardim da Vida"
      />
      <SensitiveDataNotice title="Jardim privado e derivado">
        O Jardim usa snapshots e eventos minimos. Ele nao substitui os dados originais nem e compartilhado com Atalaia.
      </SensitiveDataNotice>
      <LifeGarden />
    </div>
  );
}
