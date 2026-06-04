"use client";

import { ShieldX } from "lucide-react";
import { useState, useTransition } from "react";

import { revokeAccountabilityGrant } from "@/app/accountability/actions";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import {
  accountabilityLevelLabels,
  accountabilityNotificationFrequencyLabels,
  accountabilityPermissionLabels,
  type AccountabilityGrantPreview
} from "@/domain/accountability";

type AccountabilityGrantCardProps = {
  grant: AccountabilityGrantPreview;
};

export function AccountabilityGrantCard({ grant }: AccountabilityGrantCardProps) {
  const [reason, setReason] = useState("Quero encerrar este acompanhamento por enquanto.");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function revoke() {
    startTransition(async () => {
      const result = await revokeAccountabilityGrant({ grantId: grant.id, reason });
      setMessage(result.message);
    });
  }

  return (
    <Card as="section" className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-purpose-700">Grant por alvo</p>
          <h2 className="mt-1 text-lg font-bold text-ink-900">{grant.goalTitle}</h2>
        </div>
        <Badge intent={grant.status === "revoked" ? "danger" : "purpose"}>{grant.status}</Badge>
      </div>
      <div className="grid gap-2 text-sm text-ink-700">
        <p>Nivel: {accountabilityLevelLabels[grant.level]}</p>
        <p>Frequencia: {accountabilityNotificationFrequencyLabels[grant.notificationFrequency]}</p>
        <p>Permissoes: {grant.permissions.map((permission) => accountabilityPermissionLabels[permission]).join(", ")}</p>
      </div>
      <label className="grid gap-2 text-sm font-semibold text-ink-900">
        Motivo da revogacao
        <Textarea value={reason} onChange={(event) => setReason(event.target.value)} />
      </label>
      <Button disabled={isPending} intent="danger" onClick={revoke} variant="soft">
        <ShieldX aria-hidden className="h-4 w-4" />
        Revogar acesso
      </Button>
      {message ? <p className="text-sm leading-6 text-ink-600">{message}</p> : null}
    </Card>
  );
}
