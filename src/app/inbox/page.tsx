import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { Input } from "@/components/ui/Input";
import { SuccessState } from "@/components/ui/SuccessState";
import { Textarea } from "@/components/ui/Textarea";
import { getPlaceholderPage } from "@/lib/design/navigation";

export default function InboxPage() {
  const page = getPlaceholderPage("/inbox")!;

  return (
    <PlaceholderPage page={page}>
      <div className="grid gap-4">
        <Input disabled placeholder="Captura rápida futura" />
        <Textarea disabled placeholder="Nada será salvo nesta etapa." />
        <SuccessState
          description="Estado visual para confirmação breve e não invasiva."
          title="Captura preparada"
        />
      </div>
    </PlaceholderPage>
  );
}
