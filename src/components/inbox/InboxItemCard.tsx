import type { InboxItem } from "@/domain/inbox";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { InboxClassificationBadge } from "./InboxClassificationBadge";

type InboxItemCardProps = {
  item: InboxItem;
};

export function InboxItemCard({ item }: InboxItemCardProps) {
  return (
    <Card as="section">
      <InboxClassificationBadge classification={item.classification?.classification} />
      <h2 className="mt-3 font-bold text-ink-900">Item selecionado</h2>
      <p className="mt-2 text-sm leading-6 text-ink-700">{item.content}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Tag>{item.status}</Tag>
        <Tag>{item.contentType}</Tag>
      </div>
    </Card>
  );
}
