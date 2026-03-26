export function SectionHeading({
  eyebrow,
  title
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs uppercase tracking-[0.32em] text-[var(--text-secondary)]">{eyebrow}</p>
      <h2 className="mt-3 font-display text-5xl uppercase leading-none text-white sm:text-6xl">{title}</h2>
    </div>
  );
}
