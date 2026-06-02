"use client";

import { Checkbox } from "@/components/ui/Checkbox";
import {
  accountabilityPermissionLabels,
  defaultPermissionsByLevel,
  type AccountabilityLevel,
  type AccountabilityPermission
} from "@/domain/accountability";

const permissionOrder: AccountabilityPermission[] = [
  "goal_name",
  "deadline",
  "status",
  "progress_percentage",
  "completed_milestones",
  "limited_scoreboard",
  "help_request",
  "delay_alert",
  "completion",
  "custom_message",
  "commitment_document"
];

type PermissionSelectorProps = {
  level: AccountabilityLevel;
  selected: AccountabilityPermission[];
  onChange: (permissions: AccountabilityPermission[]) => void;
};

export function PermissionSelector({ level, onChange, selected }: PermissionSelectorProps) {
  const recommended = new Set(defaultPermissionsByLevel[level]);

  function toggle(permission: AccountabilityPermission, checked: boolean) {
    const next = new Set(selected);
    if (checked) {
      next.add(permission);
    } else {
      next.delete(permission);
    }
    onChange(Array.from(next));
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {permissionOrder.map((permission) => (
        <div className="rounded-card border border-ink-100 bg-white p-3" key={permission}>
          <Checkbox
            checked={selected.includes(permission)}
            label={accountabilityPermissionLabels[permission]}
            onChange={(event) => toggle(permission, event.target.checked)}
          />
          {recommended.has(permission) ? (
            <p className="mt-2 text-xs leading-5 text-purpose-700">Sugerido para este nivel.</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
