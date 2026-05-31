import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description: string;
  status?: string;
  action?: ReactNode;
};

export function PageHeader({ title, description, status, action }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-ink-100 pb-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="max-w-3xl">
        {status ? (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-purpose-700">
            Status: {status}
          </p>
        ) : null}
        <h1 className="text-3xl font-bold tracking-normal text-ink-900 md:text-4xl">{title}</h1>
        <p className="mt-3 text-base leading-7 text-ink-600">{description}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
