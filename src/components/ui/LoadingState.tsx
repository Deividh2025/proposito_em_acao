type LoadingStateProps = {
  label: string;
};

export function LoadingState({ label }: LoadingStateProps) {
  return (
    <section className="rounded-card border border-ink-100 bg-white p-5 text-sm font-semibold text-ink-700" role="status">
      {label}
    </section>
  );
}
