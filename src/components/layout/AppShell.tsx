import type { ReactNode } from "react";

import { MainContent } from "./MainContent";
import { MobileShell } from "./MobileShell";
import { RightPanel } from "./RightPanel";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen text-ink-900" data-testid="app-shell">
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-action-700 focus:shadow-focus"
        href="#conteudo-principal"
      >
        Pular para o conteúdo principal
      </a>

      <MobileShell />

      <div className="mx-auto min-h-screen w-full max-w-[1560px] px-0 py-0 lg:grid lg:grid-cols-[18rem_minmax(0,1fr)_20rem] lg:px-4 lg:py-4">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <div className="flex min-w-0 flex-col">
          <div className="hidden lg:block">
            <Topbar />
          </div>
          <MainContent>{children}</MainContent>
        </div>
        <div className="hidden lg:block">
          <RightPanel />
        </div>
      </div>
    </div>
  );
}
