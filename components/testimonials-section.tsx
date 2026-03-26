import { FormEvent } from "react";

import { formatTimestamp } from "@/lib/site-data";
import { getConnectionModeLabel } from "@/lib/social";

import { CommunityComposer } from "./community-composer";
import { LiveList } from "./live-list";
import { SectionHeading } from "./section-heading";

type TestimonialCard = {
  id: string;
  name: string;
  quote: string;
  label: string;
  createdAt: string;
};

export function TestimonialsSection({
  nameInput,
  messageInput,
  onNameChange,
  onMessageChange,
  onSubmit,
  testimonials,
  mode,
  disabled
}: {
  nameInput: string;
  messageInput: string;
  onNameChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  testimonials: TestimonialCard[];
  mode: "live" | "polling" | "demo";
  disabled: boolean;
}) {
  return (
    <section className="glass-panel section-shell rounded-[2rem] px-6 py-8 sm:px-8">
      <div className="grid gap-8 xl:grid-cols-[0.8fr_1.2fr]">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <SectionHeading eyebrow="Fan testimonials" title="No login. No gatekeeping. Just scouting reports from the public." />
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-[var(--text-secondary)]">
              {getConnectionModeLabel(mode)}
            </span>
          </div>
          <div className="mt-8">
            <CommunityComposer
              title="Add your scouting report"
              description="Post a Lawson scouting note and let the whole fan room see it. New reports rise to the top immediately."
              messageLabel="Comment"
              messagePlaceholder="Provide your scouting report on Lawson."
              submitLabel="Submit scouting report"
              nameValue={nameInput}
              messageValue={messageInput}
              onNameChange={onNameChange}
              onMessageChange={onMessageChange}
              onSubmit={onSubmit}
              disabled={disabled}
              helperText={
                disabled
                  ? "A short client-side cooldown is active so the public feed doesn't become a stress test."
                  : "Public insert and public read. Anonymous scouts are welcome."
              }
            />
          </div>
        </div>

        <LiveList
          items={testimonials}
          getKey={(item) => item.id}
          emptyState="No scouting reports yet. First one on the board gets instant historian status."
          renderItem={(item) => (
            <article className="rounded-[1.7rem] border border-white/10 bg-white/5 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[var(--text-secondary)]">{item.label}</p>
                  <p className="mt-2 text-2xl text-white">{item.name}</p>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">{formatTimestamp(new Date(item.createdAt))}</p>
              </div>
              <p className="mt-4 text-base leading-8 text-[var(--text-primary)]">&ldquo;{item.quote}&rdquo;</p>
            </article>
          )}
        />
      </div>
    </section>
  );
}
