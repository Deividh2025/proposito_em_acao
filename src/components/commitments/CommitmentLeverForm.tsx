"use client";

import { ShieldAlert } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { validateCommitmentLever, type CommitmentLeverType } from "@/domain/commitments";

type CommitmentLeverFormProps = {
  reward: string;
  consequence: string;
  onRewardChange: (value: string) => void;
  onConsequenceChange: (value: string) => void;
};

export function CommitmentLeverForm({
  consequence,
  onConsequenceChange,
  onRewardChange,
  reward
}: CommitmentLeverFormProps) {
  const levers = [
    validateCommitmentLever("progress_reward" satisfies CommitmentLeverType, reward),
    validateCommitmentLever("restorative_consequence" satisfies CommitmentLeverType, consequence)
  ].filter(Boolean);

  return (
    <Card as="section" className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-ink-900">Alavancas de compromisso</h2>
        <p className="mt-1 text-sm leading-6 text-ink-600">
          Recompensas e consequências devem fortalecer responsabilidade sem vergonha, abuso ou sabotagem.
        </p>
      </div>
      <label className="grid gap-2 text-sm font-semibold text-ink-900">
        Recompensa saudavel
        <Textarea value={reward} onChange={(event) => onRewardChange(event.target.value)} />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-ink-900">
        Consequencia restaurativa
        <Textarea value={consequence} onChange={(event) => onConsequenceChange(event.target.value)} />
      </label>
      <div className="grid gap-2">
        {levers.map((lever) =>
          lever ? (
            <div className="rounded-card border border-ink-100 bg-ink-50 p-3" key={`${lever.type}-${lever.description}`}>
              <div className="flex items-center gap-2">
                <ShieldAlert aria-hidden className="h-4 w-4 text-warmth-700" />
                <Badge intent={lever.safety === "blocked" ? "danger" : lever.safety === "needs_review" ? "warning" : "success"}>
                  {lever.safety}
                </Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-ink-700">{lever.notes.join(" ")}</p>
            </div>
          ) : null
        )}
      </div>
    </Card>
  );
}
