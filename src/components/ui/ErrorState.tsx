type ErrorStateProps = {
  title: string;
  description: string;
};

export function ErrorState({ description, title }: ErrorStateProps) {
  return (
    <section className="rounded-card border border-gentleDanger-100 bg-gentleDanger-50 p-5 text-gentleDanger-900" role="alert">
      <h2 className="font-bold">{title}</h2>
      <p className="mt-2 text-sm leading-6">{description}</p>
    </section>
  );
}
