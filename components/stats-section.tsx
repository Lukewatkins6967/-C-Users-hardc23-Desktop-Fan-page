import { motion } from "framer-motion";

import { StatsBlock, StatKey } from "@/lib/site-data";
import { STAT_VOTE_OPTIONS, getConnectionModeLabel } from "@/lib/social";

import { SectionHeading } from "./section-heading";
import { CompactBadge } from "./ui-bits";

const statDescriptions: Record<StatKey, string> = {
  charisma: "Pulls attention without chasing it. Elite room-temperature control.",
  athleticism: "Explosive enough to make ordinary movement look storyboarded.",
  intelligence: "Reads the moment early and somehow makes good timing look casual.",
  aura: "The signature metric. Opponents call it unguardable. Scientists call it complicated.",
  clutch: "When the moment tightens, Lawson tends to look suspiciously comfortable."
};

export function StatsSection({
  stats,
  overallRating,
  mode,
  voteSummary,
  communityGoatScore,
  onVote,
  disabled
}: {
  stats: StatsBlock;
  overallRating: number;
  mode: "live" | "polling" | "demo";
  voteSummary: Record<StatKey, { average: number; count: number; boost: number }>;
  communityGoatScore: number;
  onVote: (statName: StatKey, vote: number) => void;
  disabled: boolean;
}) {
  return (
    <section className="glass-panel section-shell rounded-[2rem] px-6 py-8 sm:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading eyebrow="Scouting dashboard" title="Officially unofficial metrics from the Lawson evaluation lab." />
        <div className="rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm text-gold">
          {getConnectionModeLabel(mode)} with vote-driven GOAT pressure layered on top.
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[1.9rem] border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-secondary)]">Draft projection</p>
          <p className="mt-4 font-display text-7xl uppercase leading-none text-white">{overallRating}</p>
          <p className="mt-3 max-w-sm text-base leading-7 text-[var(--text-secondary)]">
            Evaluators continue to label Lawson a generational prospect with premium instincts, low drama, and extremely reproducible composure.
          </p>
          <div className="mt-6 grid gap-3">
            <CompactBadge text={`Community GOAT score ${communityGoatScore}`} />
            <CompactBadge text="Aura pressure bends context" />
            <CompactBadge text="Clutch timing looks hereditary" />
          </div>
        </div>

        <div className="grid gap-4">
          {Object.entries(stats).map(([label, value], index) => {
            const voteData = voteSummary[label as StatKey];
            return (
              <motion.div
                key={label}
                className="group rounded-[1.8rem] border border-white/10 bg-slate-950/25 p-5"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-display text-3xl uppercase tracking-[0.08em] text-white">{label}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{statDescriptions[label as StatKey]}</p>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xl text-white">{value}</div>
                </div>

                <div className="relative mt-5">
                  <div className="stat-track h-3 rounded-full" />
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-sky-300 via-cyan-300 to-gold shadow-glow"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: index * 0.06 }}
                  />
                  <div className="pointer-events-none absolute -top-12 right-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <div className="rounded-xl border border-white/10 bg-slate-950/85 px-3 py-2 text-xs text-[var(--text-primary)]">
                      Verified by vibes, tape, hearsay, and public voting.
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-secondary)]">
                    {voteData.count > 0
                      ? `${voteData.count} public votes • average ${voteData.average.toFixed(1)} • boost +${voteData.boost}`
                      : "No public votes yet"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {STAT_VOTE_OPTIONS.map((option) => (
                      <button
                        key={`${label}-${option.value}`}
                        type="button"
                        disabled={disabled}
                        onClick={() => onVote(label as StatKey, option.value)}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-[var(--text-secondary)] transition-colors hover:border-cyan-200/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
