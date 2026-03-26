import { AnimatePresence, motion } from "framer-motion";
import { FormEvent } from "react";

import { FactRow, EncounterRow, getConnectionModeLabel } from "@/lib/social";
import { formatTimestamp } from "@/lib/site-data";

import { CommunityComposer } from "./community-composer";
import { LiveList } from "./live-list";
import { SectionHeading } from "./section-heading";
import { InteractiveCard } from "./ui-bits";

export function InteractiveSection({
  factOfMoment,
  encounterResult,
  onGenerateFact,
  onSimulateEncounter,
  secretUnlocked,
  onUnlockSecret,
  facts,
  encounters,
  factName,
  factText,
  encounterName,
  encounterText,
  onFactNameChange,
  onFactTextChange,
  onEncounterNameChange,
  onEncounterTextChange,
  onFactSubmit,
  onEncounterSubmit,
  mode,
  factDisabled,
  encounterDisabled
}: {
  factOfMoment: string;
  encounterResult: string;
  onGenerateFact: () => void;
  onSimulateEncounter: () => void;
  secretUnlocked: boolean;
  onUnlockSecret: () => void;
  facts: FactRow[];
  encounters: EncounterRow[];
  factName: string;
  factText: string;
  encounterName: string;
  encounterText: string;
  onFactNameChange: (value: string) => void;
  onFactTextChange: (value: string) => void;
  onEncounterNameChange: (value: string) => void;
  onEncounterTextChange: (value: string) => void;
  onFactSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onEncounterSubmit: (event: FormEvent<HTMLFormElement>) => void;
  mode: "live" | "polling" | "demo";
  factDisabled: boolean;
  encounterDisabled: boolean;
}) {
  return (
    <section className="glass-panel section-shell rounded-[2rem] px-6 py-8 sm:px-8">
      <div className="flex items-start justify-between gap-4">
        <SectionHeading eyebrow="Interactive" title="Hands-on access to the Lawson myth engine." />
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-[var(--text-secondary)]">
            {getConnectionModeLabel(mode)}
          </span>
          <button
            type="button"
            onClick={onUnlockSecret}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.3em] text-[var(--text-secondary)] transition-colors hover:border-cyan-200/50 hover:text-white"
            aria-label="Toggle hidden easter egg"
          >
            ?
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <InteractiveCard
          eyebrow="Random Lawson fact"
          text={factOfMoment}
          buttonLabel="Generate fact"
          onClick={onGenerateFact}
        />
        <InteractiveCard
          eyebrow="Encounter simulator"
          text={encounterResult}
          buttonLabel="Simulate encounter"
          onClick={onSimulateEncounter}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="grid gap-4">
          <CommunityComposer
            title="Submit a new Lawson fact"
            description="Feed the canon. As soon as a fact lands, it joins the shared pool and can be surfaced by the generator."
            messageLabel="Fact"
            messagePlaceholder="Lawson allegedly made a normal corridor feel nationally televised."
            submitLabel="Submit fact"
            nameValue={factName}
            messageValue={factText}
            onNameChange={onFactNameChange}
            onMessageChange={onFactTextChange}
            onSubmit={onFactSubmit}
            disabled={factDisabled}
            helperText="Newest facts appear below and enter rotation for everyone."
          />
          <LiveList
            items={facts}
            getKey={(item) => item.id}
            emptyState="The canon is ready for crowd-sourced facts."
            renderItem={(item) => (
              <article className="rounded-[1.6rem] border border-white/10 bg-slate-950/25 p-5">
                <p className="text-sm leading-7 text-white">&ldquo;{item.text}&rdquo;</p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.24em] text-[var(--text-secondary)]">
                  <span>{item.submitted_by}</span>
                  <span>{formatTimestamp(new Date(item.created_at))}</span>
                </div>
              </article>
            )}
          />
        </div>

        <div className="grid gap-4">
          <CommunityComposer
            title="Add an encounter scenario"
            description="Write the kind of mini-scenario a scouting department would be forced to file after seeing Lawson in standard conditions."
            messageLabel="Scenario"
            messagePlaceholder="Lawson said one sentence and the whole lunch table reset its energy."
            submitLabel="Submit scenario"
            nameValue={encounterName}
            messageValue={encounterText}
            onNameChange={onEncounterNameChange}
            onMessageChange={onEncounterTextChange}
            onSubmit={onEncounterSubmit}
            disabled={encounterDisabled}
            helperText="Fresh encounter sims appear instantly for the whole room."
          />
          <LiveList
            items={encounters}
            getKey={(item) => item.id}
            emptyState="No encounter sims filed yet. The film room is waiting."
            renderItem={(item) => (
              <article className="rounded-[1.6rem] border border-white/10 bg-slate-950/25 p-5">
                <p className="text-sm leading-7 text-white">&ldquo;{item.scenario}&rdquo;</p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.24em] text-[var(--text-secondary)]">
                  <span>{item.submitted_by}</span>
                  <span>{formatTimestamp(new Date(item.created_at))}</span>
                </div>
              </article>
            )}
          />
        </div>
      </div>

      <AnimatePresence>
        {secretUnlocked ? (
          <motion.div
            className="mt-4 rounded-[1.8rem] border border-fuchsia-200/20 bg-gradient-to-r from-fuchsia-400/15 via-sky-400/10 to-gold/15 p-5"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.35 }}
          >
            <p className="text-xs uppercase tracking-[0.32em] text-fuchsia-100/70">Hidden archive unlocked</p>
            <p className="mt-3 text-lg leading-8 text-white">
              Classified memo: St Bede&apos;s administrators once considered measuring time in &ldquo;before Lawson arrived&rdquo; and &ldquo;after the aura settled.&rdquo;
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
