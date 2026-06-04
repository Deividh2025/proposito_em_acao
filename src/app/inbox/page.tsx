import { InboxCapture } from "@/components/inbox/InboxCapture";
import { PageHeader } from "@/components/layout/PageHeader";
import { getDailyRoutineData } from "@/lib/supabase/queries/daily";

export default async function InboxPage() {
  const dailyData = await getDailyRoutineData();

  return (
    <div className="space-y-6">
      <PageHeader
        description="Capture pendências, ideias e preocupações sem sobrecarregar a mente. Classifique depois, com revisão."
        status={dailyData.canUseSampleData ? "Amostra local-demo" : "Dados autenticados"}
        title="Caixa de entrada"
      />
      <InboxCapture
        canUseSampleData={dailyData.canUseSampleData}
        dataMessage={dailyData.message}
        initialItems={dailyData.recentInboxItems}
      />
    </div>
  );
}
