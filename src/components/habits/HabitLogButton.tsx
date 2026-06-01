"use client";

import type { HabitLogStatus } from "@/domain/habits";
import { Button } from "@/components/ui/Button";

type HabitLogButtonProps = {
  disabled?: boolean;
  label: string;
  onLog: (status: HabitLogStatus) => void;
  status: HabitLogStatus;
};

export function HabitLogButton({ disabled, label, onLog, status }: HabitLogButtonProps) {
  return (
    <Button disabled={disabled} onClick={() => onLog(status)} size="sm" variant={status === "missed" ? "outline" : "soft"}>
      {label}
    </Button>
  );
}
