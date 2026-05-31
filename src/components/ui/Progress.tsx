type ProgressProps = {
  value: number;
  label: string;
};

export function Progress({ label, value }: ProgressProps) {
  const normalized = Math.max(0, Math.min(100, value));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-ink-900">{label}</span>
        <span className="text-ink-500">{normalized}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-ink-100" role="progressbar" aria-label={label} aria-valuemax={100} aria-valuemin={0} aria-valuenow={normalized}>
        <div className="h-full rounded-full bg-purpose-700" style={{ width: `${normalized}%` }} />
      </div>
    </div>
  );
}
