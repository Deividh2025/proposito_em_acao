import { describe, expect, it } from "vitest";

import { buildAccountabilityInviteDraft, normalizePermissions } from "@/domain/accountability";
import { buildCommitmentDocumentDraft, validateCommitmentLever } from "@/domain/commitments";

describe("Prompt 13 accountability domain", () => {
  it("keeps the owner's reviewed permissions without reintroducing level defaults", () => {
    const permissions = normalizePermissions("firm", ["goal_name"]);

    expect(permissions).toEqual(["goal_name"]);
  });

  it("persists exactly the reviewed permission set in invite drafts", () => {
    const draft = buildAccountabilityInviteDraft({
      completedMilestones: ["Marco revisado"],
      firstAction: "Executar uma microacao.",
      goalDeadline: "2026-07-31",
      goalId: "goal-1",
      goalStatus: "ativo",
      goalTitle: "Alvo autorizado",
      level: "firm",
      notificationFrequency: "important_events",
      partnerEmail: "atalia@example.com",
      partnerName: "Atalaia",
      permissions: ["goal_name", "status"],
      progressPercentage: 30
    });

    expect(draft.grant.permissions).toEqual(["goal_name", "status"]);
    expect(draft.preview.shared_fields).toEqual(["goal_name", "status"]);
  });

  it("builds invite preview without private accountability categories", () => {
    const draft = buildAccountabilityInviteDraft({
      completedMilestones: ["Marco revisado"],
      firstAction: "Executar uma microacao.",
      goalDeadline: "2026-07-31",
      goalId: "goal-1",
      goalStatus: "ativo",
      goalTitle: "Alvo autorizado",
      level: "balanced",
      notificationFrequency: "weekly",
      partnerEmail: "atalia@example.com",
      partnerName: "Atalaia",
      permissions: ["goal_name", "status"],
      progressPercentage: 30
    });

    expect(draft.preview.privacy_check).toMatchObject({
      contains_private_metacognition: false,
      contains_full_calling: false,
      contains_sensitive_health_data: false,
      contains_family_finance_emotion_data: false,
      safe_to_send: true
    });
    expect(draft.excludedPrivateCategories).toEqual(expect.arrayContaining(["Metacognicao", "Chamado completo"]));
  });

  it("blocks invite draft generation when reviewed text contains prohibited private categories", () => {
    expect(() =>
      buildAccountabilityInviteDraft({
        completedMilestones: ["Marco revisado"],
        customMessage: "Resumo inclui metacognicao, chamado completo, saude, familia, financas e emocoes.",
        firstAction: "Executar uma microacao.",
        goalDeadline: "2026-07-31",
        goalId: "goal-1",
        goalStatus: "ativo",
        goalTitle: "Alvo autorizado",
        level: "balanced",
        notificationFrequency: "weekly",
        partnerEmail: "atalia@example.com",
        partnerName: "Atalaia",
        permissions: ["goal_name", "custom_message"],
        progressPercentage: 30
      })
    ).toThrow(/dado privado fora do escopo/i);
  });
});

describe("Prompt 13 commitment levers", () => {
  it("blocks abusive restorative consequences", () => {
    const lever = validateCommitmentLever("restorative_consequence", "fazer humilhacao publica se eu falhar");

    expect(lever?.safety).toBe("blocked");
  });

  it("keeps commitment document private and reviewable", () => {
    const draft = buildCommitmentDocumentDraft({
      callingSummary: "Chamado resumido",
      callingSummaryAuthorized: false,
      deadline: "2026-07-31",
      firstAction: "Abrir o plano.",
      goalId: "goal-1",
      goalTitle: "Alvo autorizado",
      linkedProjects: ["Projeto"],
      partnerEmail: "atalia@example.com",
      partnerName: "Atalaia",
      restorativeConsequence: "Fazer revisao curta e reduzir escopo.",
      reward: "Descanso planejado",
      scoreboardItems: ["Retomada"],
      sharingPermissions: ["goal_name", "commitment_document"],
      supportingHabits: ["Habito minimo"],
      userName: "Usuario"
    });

    expect(draft.document.calling_summary).toBeNull();
    expect(draft.document.user_review_required).toBe(true);
    expect(draft.levers.every((lever) => lever.safety !== "blocked")).toBe(true);
  });
});
