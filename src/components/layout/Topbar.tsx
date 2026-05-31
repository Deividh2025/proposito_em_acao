import Link from "next/link";

export function Topbar() {
  return (
    <header className="mb-4 flex items-center justify-between gap-4 rounded-panel border border-ink-100 bg-white/88 px-5 py-3 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-purpose-700">
          Design system inicial em preparação
        </p>
        <p className="mt-1 text-sm text-ink-500">
          Base desktop-first com retomada, baixa energia e acessibilidade desde o início.
        </p>
      </div>
      <Link
        className="rounded-control bg-purpose-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-purpose-900"
        href="/dashboard"
      >
        Ver próxima ação
      </Link>
    </header>
  );
}
