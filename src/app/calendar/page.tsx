import { CalendarShell } from "@/components/calendar/CalendarShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { getDailyRoutineData } from "@/lib/supabase/queries/daily";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const dailyData = await getDailyRoutineData();

  return (
    <div className="space-y-6">
      <PageHeader
        description="Transforme próxima ação em tempo real, protegendo descanso, família, espiritualidade e energia."
        status="Prompt 9"
        title="Calendário de execução"
      />
      <CalendarShell
        canUseSampleData={dailyData.canUseSampleData}
        dataMessage={dailyData.message}
        dataSource={dailyData.source}
        initialBlocks={dailyData.calendarBlocks}
        recentInboxItems={dailyData.recentInboxItems}
        weekStart={dailyData.weekStart}
      />
    </div>
  );
}
