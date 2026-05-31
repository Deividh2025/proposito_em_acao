type SuccessStateProps = {
  title: string;
  description: string;
};

export function SuccessState({ description, title }: SuccessStateProps) {
  return (
    <section className="rounded-card border border-purpose-100 bg-purpose-50 p-5 text-purpose-900" role="status">
      <h2 className="font-bold">{title}</h2>
      <p className="mt-2 text-sm leading-6">{description}</p>
    </section>
  );
}
