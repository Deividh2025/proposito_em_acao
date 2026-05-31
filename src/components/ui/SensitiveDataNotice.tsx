import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";

type SensitiveDataNoticeProps = {
  title?: string;
  children: ReactNode;
};

export function SensitiveDataNotice({
  children,
  title = "Dados sensiveis e privados"
}: SensitiveDataNoticeProps) {
  return (
    <section
      className="rounded-card border border-action-100 bg-action-50 p-4 text-action-900"
      role="note"
    >
      <div className="flex items-start gap-3">
        <ShieldCheck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="font-bold">{title}</p>
          <div className="mt-1 text-sm leading-6">{children}</div>
        </div>
      </div>
    </section>
  );
}
