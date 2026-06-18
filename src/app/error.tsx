"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/ErrorState";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Global Error Boundary caught an error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 gap-4 text-center">
      <div className="max-w-md w-full">
        <ErrorState
          title="Algo deu errado"
          description="Ocorreu um erro inesperado ao carregar esta página. Nenhuma informação técnica ou sensível foi exposta."
        />
      </div>
      <button
        onClick={reset}
        className="rounded-control bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink-700 transition-colors shadow-soft focus:shadow-focus outline-none"
      >
        Tentar novamente
      </button>
    </div>
  );
}
