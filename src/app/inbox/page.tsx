import { InboxCapture } from "@/components/inbox/InboxCapture";
import { PageHeader } from "@/components/layout/PageHeader";

export default function InboxPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        description="Capture pendências, ideias e preocupações sem sobrecarregar a mente. Classifique depois, com revisão."
        status="Prompt 9"
        title="Caixa de entrada"
      />
      <InboxCapture />
    </div>
  );
}
