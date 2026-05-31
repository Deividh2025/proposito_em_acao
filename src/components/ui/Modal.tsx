import type { ReactNode } from "react";

type ModalProps = {
  title: string;
  children: ReactNode;
  open?: boolean;
};

export function Modal({ children, open = true, title }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <section aria-label={title} className="rounded-panel border border-ink-100 bg-white p-5 shadow-soft">
      <h2 className="text-lg font-bold text-ink-900">{title}</h2>
      <div className="mt-3 text-sm leading-6 text-ink-700">{children}</div>
    </section>
  );
}
