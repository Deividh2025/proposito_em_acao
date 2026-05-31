import { ReflectionCard } from "@/components/faith/FaithComponents";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { Stepper } from "@/components/ui/Stepper";
import { getPlaceholderPage } from "@/lib/design/navigation";

export default function OnboardingPage() {
  const page = getPlaceholderPage("/onboarding")!;

  return (
    <PlaceholderPage page={page}>
      <Stepper
        steps={[
          { label: "Perfil essencial", status: "upcoming" },
          { label: "Mapa da Vida", status: "upcoming" },
          { label: "Chamado em discernimento", status: "upcoming" }
        ]}
      />
      <ReflectionCard />
    </PlaceholderPage>
  );
}
