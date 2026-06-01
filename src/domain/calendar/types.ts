export type CalendarBlockType =
  | "task"
  | "focus"
  | "habit_placeholder"
  | "recurring_work"
  | "rest"
  | "family"
  | "spirituality"
  | "health"
  | "learning"
  | "service"
  | "appointment"
  | "buffer";

export type CalendarBlockStatus = "scheduled" | "completed" | "missed" | "cancelled";

export type CalendarEnergyLevel = "low" | "medium" | "high";

export type CalendarBlock = {
  id: string;
  title: string;
  type: CalendarBlockType;
  status: CalendarBlockStatus;
  startTime: string;
  endTime: string;
  energyLevel?: CalendarEnergyLevel;
  taskId?: string;
  projectId?: string;
  goalId?: string;
  recurrenceRule?: string;
  notes?: string;
};

export type CalendarDayModel = {
  date: string;
  label: string;
  blocks: CalendarBlock[];
  totalScheduledMinutes: number;
  highEnergyBlockCount: number;
  protectedBlockCount: number;
};

export type CalendarWeekModel = {
  weekStart: string;
  days: CalendarDayModel[];
};

export type RescheduleCalendarBlockInput = {
  startTime: string;
  endTime: string;
};
