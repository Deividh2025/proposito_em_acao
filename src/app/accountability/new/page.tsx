import { AccountabilityPartnerForm } from "@/components/accountability/AccountabilityPartnerForm";
import { PageHeader } from "@/components/layout/PageHeader";

export const dynamic = "force-dynamic";

export default function NewAccountabilityPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        description="Comece pelo alvo e mantenha o menor escopo possivel para apoio externo saudavel."
        status="Prompt 13"
        title="Novo Atalaia"
      />
      <AccountabilityPartnerForm />
    </div>
  );
}
