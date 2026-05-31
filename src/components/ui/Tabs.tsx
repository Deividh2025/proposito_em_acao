type TabItem = {
  label: string;
  content: string;
};

type TabsProps = {
  items: TabItem[];
  label: string;
};

export function Tabs({ items, label }: TabsProps) {
  return (
    <section aria-label={label} className="space-y-3">
      <div className="flex flex-wrap gap-2" aria-label={`${label}: opções`}>
        {items.map((item) => (
          <button
            className="rounded-control border border-ink-100 bg-white px-3 py-2 text-sm font-semibold text-ink-700 first:bg-purpose-50 first:text-purpose-900"
            key={item.label}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="rounded-card border border-ink-100 bg-white p-4 text-sm leading-6 text-ink-700">
        {items[0]?.content}
      </div>
    </section>
  );
}
