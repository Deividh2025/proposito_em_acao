import type { ReactNode } from "react";

type ToastProps = {
  children: ReactNode;
  title: string;
};

export function Toast({ children, title }: ToastProps) {
  return (
    <section className="rounded-card border border-purpose-100 bg-purpose-50 p-4 text-purpose-900" role="status">
      <p className="font-bold">{title}</p>
      <div className="mt-1 text-sm leading-6">{children}</div>
    </section>
  );
}
