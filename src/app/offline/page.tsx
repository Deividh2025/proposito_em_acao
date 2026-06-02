export default function OfflinePage() {
  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <section className="rounded-card border border-ink-100 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-purpose-700">PWA</p>
        <h1 className="mt-2 text-2xl font-bold text-ink-900">Sem conexão agora</h1>
        <p className="mt-3 text-sm leading-6 text-ink-600">
          Por segurança, dados sensíveis não ficam em fila offline nesta etapa. Volte quando a conexão
          retornar para registrar capturas, Metacognição, Placar ou energia.
        </p>
      </section>
    </main>
  );
}
