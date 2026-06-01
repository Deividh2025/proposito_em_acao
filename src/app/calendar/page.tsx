import { CalendarShell } from "@/components/calendar/CalendarShell";
import { PageHeader } from "@/components/layout/PageHeader";

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        description="Transforme próxima ação em tempo real, protegendo descanso, família, espiritualidade e energia."
        status="Prompt 9"
        title="Calendário de execução"
      />
      <CalendarShell />
    </div>
  );
}
