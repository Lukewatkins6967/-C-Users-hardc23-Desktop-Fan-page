import { motion } from "framer-motion";

import { formatTimestamp } from "@/lib/site-data";

import { Badge, MetricCard } from "./ui-bits";

export function HeroSection({
  name,
  school,
  tagline,
  dailyQuote,
  lastUpdated
}: {
  name: string;
  school: string;
  tagline: string;
  dailyQuote: string;
  lastUpdated: Date | null;
}) {
  return (
    <section className="glass-panel section-shell noise relative min-h-[82vh] rounded-[2.5rem] border border-white/10 px-6 py-8 sm:px-10 sm:py-10">
      <div className="pointer-events-none absolute inset-0 bg-hero-grid bg-[size:60px_60px] opacity-[0.06]" />
      <motion.div
        className="relative flex min-h-[70vh] flex-col justify-between gap-8"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-[0.28em] text-[var(--text-secondary)]">
          <div className="flex flex-wrap items-center gap-3">
            <Badge label="Legendary profile" />
            <Badge label="Scouting report" />
            <Badge label="High-end nonsense" />
          </div>
          <div className="flex items-center gap-3 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-4 py-2 text-[11px] text-emerald-100">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
            LIVE: Currently dominating somewhere
          </div>
        </div>

        <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.5em] text-[var(--text-secondary)]">St Bede&apos;s Finest</p>
              <motion.h1
                className="font-display text-[6.2rem] uppercase leading-[0.85] text-white sm:text-[8rem] lg:text-[11rem]"
                initial={{ opacity: 0, y: 40, letterSpacing: "0.35em" }}
                animate={{ opacity: 1, y: 0, letterSpacing: "0.04em" }}
                transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                {name}
              </motion.h1>
            </div>

            <p className="max-w-2xl text-balance text-lg leading-8 text-[var(--text-secondary)] sm:text-xl">
              {tagline}. Equal parts admired, overanalyzed, and mythologized with suspiciously strong production values.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#lore"
                className="button-glow inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-slate-950 transition-transform duration-200 hover:-translate-y-0.5"
              >
                Enter the Lore
              </a>
              <p className="text-sm uppercase tracking-[0.3em] text-[var(--text-secondary)]">{school}</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="glass-panel rounded-[2rem] p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--text-secondary)]">Daily rotating quote</p>
              <p className="mt-4 text-2xl leading-9 text-white">&ldquo;{dailyQuote}&rdquo;</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <MetricCard value="6-star" label="Aura category" />
              <MetricCard
                value={lastUpdated ? formatTimestamp(lastUpdated) : "Syncing..."}
                label="Last updated"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
