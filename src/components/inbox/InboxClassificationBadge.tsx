import { Badge } from "@/components/ui/Badge";
import type { InboxClassificationOutput } from "@/ai/schemas";

type InboxClassificationBadgeProps = {
  classification?: InboxClassificationOutput["classification"];
};

export function InboxClassificationBadge({ classification }: InboxClassificationBadgeProps) {
  if (!classification) {
    return <Badge intent="neutral">não processado</Badge>;
  }

  const intent = classification === "concern" ? "warning" : classification === "discard" ? "danger" : "purpose";

  return <Badge intent={intent}>{classification}</Badge>;
}
