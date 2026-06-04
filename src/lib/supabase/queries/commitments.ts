import "server-only";

import type { User } from "@supabase/supabase-js";

import { commitmentDocumentOutputSchema } from "@/ai/schemas";
import type { AccountabilityPermission } from "@/domain/accountability";
import type { CommitmentDocumentDraft } from "@/domain/commitments";
import { assertAuthenticatedUser } from "@/lib/supabase/guards";
import { booleanFromRow, nullableStringFromRow, recordFromUnknown, stringFromRow } from "@/lib/supabase/queries/mappers";
import type { TypedSupabaseClient } from "@/lib/supabase/types";

export type CommitmentDocumentDetail = {
  draft: CommitmentDocumentDraft;
  id: string;
  reviewedAt: string | null;
  sharedAt: string | null;
  sharedWithAtalaias: boolean;
  status: string;
  viewerRole: "owner" | "partner";
};

export function mapCommitmentDocumentRow(rowValue: unknown, viewer: User): CommitmentDocumentDetail | null {
  assertAuthenticatedUser(viewer);

  const row = recordFromUnknown(rowValue);
  const id = stringFromRow(row, "id");

  if (!id) {
    return null;
  }

  const parsedDocument = commitmentDocumentOutputSchema.safeParse(row.structured_content);

  if (!parsedDocument.success) {
    return null;
  }

  return {
    draft: {
      document: parsedDocument.data,
      levers: [],
      privacyNotice:
        "Documento carregado da persistencia. Compartilhamento com Atalaia depende de grant ativo e permissao de documento.",
      sharingPermissions: parsedDocument.data.sharing_permissions as AccountabilityPermission[]
    },
    id,
    reviewedAt: nullableStringFromRow(row, "reviewed_at"),
    sharedAt: nullableStringFromRow(row, "shared_at"),
    sharedWithAtalaias: booleanFromRow(row, "shared_with_atalaias", false),
    status: stringFromRow(row, "status", "draft"),
    viewerRole: stringFromRow(row, "user_id") === viewer.id ? "owner" : "partner"
  };
}

export async function getCommitmentDocumentDetail(
  supabase: TypedSupabaseClient,
  user: User,
  documentId: string
): Promise<CommitmentDocumentDetail | null> {
  assertAuthenticatedUser(user);

  const { data, error } = await supabase
    .from("commitment_documents")
    .select(
      "id,user_id,goal_id,title,status,shared_with_atalaias,schema_version,structured_content,sharing_permissions,privacy_check,reviewed_at,shared_at,consent_version"
    )
    .eq("id", documentId)
    .maybeSingle();

  if (error) {
    throw new Error("Could not load commitment document.");
  }

  return mapCommitmentDocumentRow(data, user);
}
