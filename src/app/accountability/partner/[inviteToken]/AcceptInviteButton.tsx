"use client";

import { CheckCircle } from "lucide-react";
import { useState, useTransition } from "react";

import { acceptAccountabilityInvite } from "@/app/accountability/actions";
import { Button } from "@/components/ui/Button";

type AcceptInviteButtonProps = {
  inviteToken: string;
};

export function AcceptInviteButton({ inviteToken }: AcceptInviteButtonProps) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function accept() {
    startTransition(async () => {
      const result = await acceptAccountabilityInvite({ inviteToken });
      setMessage(result.message);
    });
  }

  return (
    <div className="space-y-3">
      <Button disabled={isPending} onClick={accept}>
        <CheckCircle aria-hidden className="h-4 w-4" />
        Aceitar convite limitado
      </Button>
      {message ? <p className="text-sm leading-6 text-ink-600">{message}</p> : null}
    </div>
  );
}
