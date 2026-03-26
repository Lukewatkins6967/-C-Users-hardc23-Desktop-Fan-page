import { AnimatePresence, motion } from "framer-motion";

import {
  GALLERY_REACTIONS,
  GalleryReactionType,
  getConnectionModeLabel
} from "@/lib/social";
import { FALLBACK_GALLERY, GalleryItem } from "@/lib/site-data";

import { SectionHeading } from "./section-heading";

type ReactionSummary = Record<string, Partial<Record<GalleryReactionType, number>>>;

export function GallerySection({
  items,
  selectedGallery,
  onSelect,
  onClose,
  reactionSummary,
  onReact,
  mode,
  disabled
}: {
  items: GalleryItem[];
  selectedGallery: number | null;
  onSelect: (index: number | null) => void;
  onClose: () => void;
  reactionSummary: ReactionSummary;
  onReact: (imageId: string, reactionType: GalleryReactionType) => void;
  mode: "live" | "polling" | "demo";
  disabled: boolean;
}) {
  const safeItems = items.length > 0 ? items : FALLBACK_GALLERY;
  const activeItem = selectedGallery !== null ? safeItems[selectedGallery] : null;

  return (
    <section className="glass-panel section-shell rounded-[2rem] px-6 py-8 sm:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <SectionHeading eyebrow="Gallery" title="Museum-grade Lawson sightings and cinematic reconstructions." />
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-[var(--text-secondary)]">
          {getConnectionModeLabel(mode)}
        </span>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {safeItems.map((item, index) => {
          const counts = reactionSummary[item.id] ?? {};

          return (
            <motion.article
              key={item.id}
              className="relative overflow-hidden rounded-[1.8rem] border border-white/10 p-5"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              style={{
                background: `linear-gradient(145deg, ${item.palette[0]}, ${item.palette[1]} 58%, ${item.palette[2]})`
              }}
            >
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative flex h-full min-h-[320px] flex-col justify-between gap-5">
                <button type="button" onClick={() => onSelect(index)} className="text-left">
                  <div className="inline-flex w-fit rounded-full border border-white/25 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.28em] text-white/85">
                    {item.tag}
                  </div>
                  <div className="mt-24">
                    <p className="font-display text-5xl uppercase leading-none text-white">{item.title}</p>
                    <p className="mt-3 max-w-sm text-sm leading-7 text-white/80">{item.caption}</p>
                  </div>
                </button>

                <div className="flex flex-wrap gap-2">
                  {GALLERY_REACTIONS.map((reaction) => (
                    <button
                      key={`${item.id}-${reaction.value}`}
                      type="button"
                      disabled={disabled}
                      onClick={() => onReact(item.id, reaction.value)}
                      className="rounded-full border border-white/20 bg-black/20 px-3 py-2 text-xs uppercase tracking-[0.24em] text-white/85 transition-colors hover:bg-black/35 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {reaction.label} {counts[reaction.value] ?? 0}
                    </button>
                  ))}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      <AnimatePresence>
        {activeItem ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/88 px-4 py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/10"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.35 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div
                className="min-h-[480px] px-8 py-8"
                style={{
                  background: `linear-gradient(135deg, ${activeItem.palette[0]}, ${activeItem.palette[1]} 56%, ${activeItem.palette[2]})`
                }}
              >
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full border border-white/20 bg-black/20 px-4 py-2 text-xs uppercase tracking-[0.26em] text-white/85"
                  >
                    Close
                  </button>
                </div>
                <div className="mt-12 max-w-2xl space-y-5">
                  <p className="text-xs uppercase tracking-[0.32em] text-white/75">{activeItem.tag}</p>
                  <p className="font-display text-7xl uppercase leading-none text-white">{activeItem.title}</p>
                  <p className="text-lg leading-8 text-white/85">{activeItem.caption}</p>
                  <p className="rounded-[1.4rem] border border-white/20 bg-black/20 px-4 py-4 text-sm leading-7 text-white/82">
                    Dramatic caption: analysts paused the tape here and agreed the image carried unreasonable franchise-player energy.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {GALLERY_REACTIONS.map((reaction) => (
                      <button
                        key={`${activeItem.id}-${reaction.value}-modal`}
                        type="button"
                        disabled={disabled}
                        onClick={() => onReact(activeItem.id, reaction.value)}
                        className="rounded-full border border-white/20 bg-black/20 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/85 transition-colors hover:bg-black/35 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {reaction.label} {reactionSummary[activeItem.id]?.[reaction.value] ?? 0}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
