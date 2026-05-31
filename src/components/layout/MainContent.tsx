import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type MainContentProps = {
  children: ReactNode;
};

export function MainContent({ children }: MainContentProps) {
  return (
    <main
      className={cn(
        "min-w-0 flex-1 px-4 pb-8 pt-4",
        "lg:rounded-panel lg:border lg:border-ink-100 lg:bg-white/72 lg:p-6 lg:shadow-soft"
      )}
      id="conteudo-principal"
    >
      {children}
    </main>
  );
}
