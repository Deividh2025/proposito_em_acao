import { CalendarShell } from "@/components/calendar/CalendarShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { getDailyRoutineData } from "@/lib/supabase/queries/daily";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const dailyData = await getDailyRoutineData();

  return (
    <div className="space-y-6">
      <PageHeader
        description="Transforme prÃ³xima aÃ§Ã£o em tempo real, protegendo descanso, famÃ­lia, espiritualidade e energia."
        status="Prompt 9"
        title="CalendÃ¡rio de execuÃ§Ã£o"
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
