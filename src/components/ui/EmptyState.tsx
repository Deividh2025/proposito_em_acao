type StateProps = {
  title: string;
  description: string;
};

export function EmptyState({ description, title }: StateProps) {
  return (
    <section className="rounded-card border border-dashed border-ink-300 bg-ink-50 p-5 text-center">
      <h2 className="text-lg font-bold text-ink-900">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-ink-600">{description}</p>
    </section>
  );
}
