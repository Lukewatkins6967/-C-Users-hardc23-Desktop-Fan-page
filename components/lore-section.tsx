import { motion } from "framer-motion";

import { SectionHeading } from "./section-heading";

const loreCards = [
  {
    heading: "Origins",
    body: "Legend says Lawson emerged from the St Bede's ecosystem already carrying senior-year poise and the timing of a closer."
  },
  {
    heading: "Rise",
    body: "At some point the regular school day stopped being regular. Lawson made routine presence feel like scheduled programming."
  },
  {
    heading: "Peak Era",
    body: "Seen locking in during lunch like it's Game 7. Observers described the atmosphere as calm, inevitable, and slightly expensive."
  },
  {
    heading: "Unknown Mysteries",
    body: "No one knows the full source of the aura. Some blame genetics. Others suspect elite playlist curation."
  }
];

export function LoreSection() {
  return (
    <section id="lore" className="glass-panel section-shell rounded-[2rem] px-6 py-8 sm:px-8">
      <SectionHeading eyebrow="Lore file" title="The Lawson canon, preserved for future scholars." />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {loreCards.map((card, index) => (
          <motion.article
            key={card.heading}
            className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: index * 0.08, duration: 0.55 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-secondary)]">{card.heading}</p>
            <p className="mt-3 text-lg leading-8 text-white">{card.body}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
