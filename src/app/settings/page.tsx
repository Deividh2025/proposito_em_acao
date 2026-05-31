import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { getPlaceholderPage } from "@/lib/design/navigation";

export default function SettingsPage() {
  const page = getPlaceholderPage("/settings")!;

  return (
    <PlaceholderPage page={page}>
      <div className="grid gap-4">
        <Switch
          description="Preparado para modo baixa energia futuro."
          disabled
          label="Reduzir estímulos visuais"
        />
        <RadioGroup
          disabled
          legend="Camada cristã futura"
          name="faith-mode-placeholder"
          options={[
            { label: "Discreta", value: "subtle" },
            { label: "Equilibrada", value: "balanced" },
            { label: "Intensa", value: "intense" }
          ]}
        />
        <Select disabled>
          <option>Preferência futura de tom da IA</option>
        </Select>
      </div>
    </PlaceholderPage>
  );
}
