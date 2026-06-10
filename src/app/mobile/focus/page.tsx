import { MobileFocusQuickStart } from "@/components/mobile/MobileFocusQuickStart";
import { MobileShell } from "@/components/mobile/MobileShell";

export const dynamic = "force-dynamic";

type MobileFocusPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MobileFocusPage({ searchParams }: MobileFocusPageProps) {
  const params = (await searchParams) ?? {};
  const minutesParam = Array.isArray(params.minutes) ? params.minutes[0] : params.minutes;
  const parsedMinutes = Number(minutesParam);
  const initialDurationMinutes = Number.isFinite(parsedMinutes) && parsedMinutes > 0 ? parsedMinutes : 5;

  return (
    <MobileShell
      subtitle="Foco curto com captura de distração. Sem modo foco mobile completo nesta etapa."
      title="Foco curto"
    >
      <MobileFocusQuickStart initialDurationMinutes={initialDurationMinutes} />
    </MobileShell>
  );
}
