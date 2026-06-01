import { Badge } from "@/components/ui/Badge";

export function RestartCountBadge({ count = 2 }: { count?: number }) {
  return <Badge intent="restart">{count} retomadas valorizadas</Badge>;
}
