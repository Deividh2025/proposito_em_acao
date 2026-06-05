import { PageHeader } from "@/components/layout/PageHeader";
import { SettingsCenter } from "@/components/settings/SettingsCenter";
import { loadSettingsSnapshot } from "@/lib/supabase/queries/privacy-settings";

type SettingsPageProps = {
  searchParams?: Promise<{ status?: string }> | { status?: string };
};

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const [snapshot, resolvedSearchParams] = await Promise.all([
    loadSettingsSnapshot(),
    Promise.resolve(searchParams)
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        description="Preferencias, consentimentos, analytics opt-in, feedback beta, exportacao e exclusao com privacidade por padrao."
        status={snapshot.mode === "local-demo" ? "Local-demo sem persistencia real" : "Sessao autenticada"}
        title="Configuracoes e privacidade"
      />
      <SettingsCenter snapshot={snapshot} status={resolvedSearchParams?.status} />
    </div>
  );
}
