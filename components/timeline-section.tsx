import { FormEvent } from "react";
import { motion } from "framer-motion";

import { TimelineEntry } from "@/lib/site-data";
import { TimelineEntryRow, getConnectionModeLabel } from "@/lib/social";
import { formatTimestamp } from "@/lib/site-data";

import { CommunityComposer } from "./community-composer";
import { LiveList } from "./live-list";
import { SectionHeading } from "./section-heading";

export function TimelineSection({
  timeline,
  liveEntries,
  nameValue,
  textValue,
  onNameChange,
  onTextChange,
  onSubmit,
  mode,
  disabled
}: {
  timeline: TimelineEntry[];
  liveEntries: TimelineEntryRow[];
  nameValue: string;
  textValue: string;
  onNameChange: (value: string) => void;
  onTextChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  mode: "live" | "polling" | "demo";
  disabled: boolean;
}) {
  return (
    <section className="glass-panel section-shell rounded-[2rem] px-6 py-8 sm:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <SectionHeading eyebrow="Timeline" title="A chronology of increasingly difficult-to-ignore greatness." />
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-[var(--text-secondary)]">
          {getConnectionModeLabel(mode)}
        </span>
      </div>

      <div className="mt-8 grid gap-4">
        {timeline.map((entry, index) => (
          <motion.article
            key={`${entry.year}-${entry.title}`}
            className="grid gap-4 rounded-[1.8rem] border border-white/10 bg-white/5 p-5 md:grid-cols-[120px_12px_1fr] md:items-start"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: index * 0.06, duration: 0.45 }}
          >
            <div>
              <p className="font-display text-4xl uppercase leading-none text-white">{entry.year}</p>
            </div>
            <div className="hidden md:flex md:justify-center">
              <div className="timeline-line mt-1 h-full w-[2px]" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--text-secondary)]">Recorded event</p>
              <p className="mt-2 text-2xl leading-tight text-white">{entry.title}</p>
              <p className="mt-3 max-w-3xl text-base leading-8 text-[var(--text-secondary)]">{entry.detail}</p>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <CommunityComposer
          title="Add a fan milestone"
          description="Drop a new milestone for the living Lawson timeline. Ridiculous but believable is the right zone."
          messageLabel="Milestone"
          messagePlaceholder="2026: turns a casual entrance into a documented moment."
          submitLabel="Add milestone"
          nameValue={nameValue}
          messageValue={textValue}
          onNameChange={onNameChange}
          onMessageChange={onTextChange}
          onSubmit={onSubmit}
          disabled={disabled}
          helperText="These appear in the shared fan annex instantly."
        />

        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--text-secondary)]">Fan annex</p>
          <div className="mt-4">
            <LiveList
              items={liveEntries}
              getKey={(item) => item.id}
              emptyState="No fan milestones yet. The annex has room for fresh mythology."
              renderItem={(item) => (
                <article className="rounded-[1.7rem] border border-white/10 bg-slate-950/25 p-5">
                  <p className="text-base leading-8 text-white">{item.text}</p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.24em] text-[var(--text-secondary)]">
                    <span>{item.submitted_by}</span>
                    <span>{formatTimestamp(new Date(item.created_at))}</span>
                  </div>
                </article>
              )}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
