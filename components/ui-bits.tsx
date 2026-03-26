export function Badge({ label }: { label: string }) {
  return <span className="rounded-full border border-white/12 bg-white/5 px-4 py-2">{label}</span>;
}

export function MetricCard({
  value,
  label
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-secondary)]">{label}</p>
      <p className="mt-3 text-lg text-white">{value}</p>
    </div>
  );
}

export function CompactBadge({ text }: { text: string }) {
  return (
    <div className="rounded-full border border-white/10 bg-slate-950/25 px-4 py-2 text-sm text-[var(--text-secondary)]">
      {text}
    </div>
  );
}

export function InteractiveCard({
  eyebrow,
  text,
  buttonLabel,
  onClick
}: {
  eyebrow: string;
  text: string;
  buttonLabel: string;
  onClick: () => void;
}) {
  return (
    <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
      <p className="text-xs uppercase tracking-[0.28em] text-[var(--text-secondary)]">{eyebrow}</p>
      <p className="mt-4 min-h-[112px] text-lg leading-8 text-white">{text}</p>
      <button
        type="button"
        onClick={onClick}
        className="button-glow mt-5 rounded-full border border-white/10 bg-slate-950/35 px-5 py-3 text-sm uppercase tracking-[0.24em] text-white transition-colors hover:border-cyan-200/40"
      >
        {buttonLabel}
      </button>
    </div>
  );
}
