import { CommunityHighlight, getConnectionModeLabel } from "@/lib/social";

import { SectionHeading } from "./section-heading";

export function LiveIntelPanel({
  overallRating,
  factOfMoment,
  mode,
  highlight,
  topFans
}: {
  overallRating: number;
  factOfMoment: string;
  mode: "live" | "polling" | "demo";
  highlight: CommunityHighlight | null;
  topFans: Array<{ name: string; total: number }>;
}) {
  return (
    <section className="glass-panel section-shell rounded-[2rem] px-6 py-8 sm:px-8">
      <SectionHeading eyebrow="Intel feed" title="The numbers suggest greatness. The crowd keeps filing supporting evidence." />
      <div className="mt-8 grid gap-4">
        <div className="rounded-[1.8rem] border border-cyan-200/15 bg-slate-950/35 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/70">Overall rating</p>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[var(--text-secondary)]">
              {getConnectionModeLabel(mode)}
            </span>
          </div>
          <div className="mt-3 flex items-end gap-3">
            <span className="font-display text-7xl leading-none text-white">{overallRating}</span>
            <span className="pb-3 text-sm uppercase tracking-[0.26em] text-[var(--text-secondary)]">Projected #1 overall pick in life draft</span>
          </div>
        </div>

        <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--text-secondary)]">Broadcast note</p>
          <p className="mt-3 text-lg leading-8 text-white">{factOfMoment}</p>
        </div>

        <div className="rounded-[1.8rem] border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-5">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--text-secondary)]">Random fan contribution</p>
          {highlight ? (
            <>
              <p className="mt-3 text-lg leading-8 text-white">&ldquo;{highlight.text}&rdquo;</p>
              <p className="mt-3 text-sm uppercase tracking-[0.26em] text-[var(--text-secondary)]">
                {highlight.submittedBy} • {highlight.label}
              </p>
            </>
          ) : (
            <p className="mt-3 text-base leading-7 text-[var(--text-secondary)]">
              Fan submissions light up here as soon as the live feed starts filling.
            </p>
          )}
        </div>

        <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--text-secondary)]">Top fans leaderboard</p>
          <div className="mt-4 grid gap-3">
            {topFans.length > 0 ? (
              topFans.map((fan, index) => (
                <div
                  key={fan.name}
                  className="flex items-center justify-between rounded-[1.2rem] border border-white/10 bg-slate-950/25 px-4 py-3"
                >
                  <p className="text-sm uppercase tracking-[0.24em] text-[var(--text-secondary)]">
                    #{index + 1} {fan.name}
                  </p>
                  <p className="text-white">{fan.total} drops</p>
                </div>
              ))
            ) : (
              <p className="text-sm leading-7 text-[var(--text-secondary)]">
                First contributors will be immortalized here. The scouting department is ready.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
