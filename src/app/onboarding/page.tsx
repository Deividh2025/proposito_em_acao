import { PageHeader } from "@/components/layout/PageHeader";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

export const dynamic = "force-dynamic";

export default function OnboardingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        description="Perfil essencial, Mapa da Vida e Chamado Pessoal em discernimento, com mock seguro e salvamento preparado para Supabase/Auth."
        status="Prompt 6"
        title="Onboarding e direÃ§Ã£o"
      />
      <OnboardingFlow />
    </div>
  );
}
