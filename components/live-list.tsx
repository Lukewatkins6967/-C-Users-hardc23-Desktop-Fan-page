import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

export function LiveList<T>({
  items,
  getKey,
  renderItem,
  emptyState,
  className = "grid gap-4"
}: {
  items: T[];
  getKey: (item: T, index: number) => string;
  renderItem: (item: T, index: number) => ReactNode;
  emptyState: ReactNode;
  className?: string;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-[1.6rem] border border-dashed border-white/12 bg-white/[0.03] px-5 py-6 text-sm leading-7 text-[var(--text-secondary)]">
        {emptyState}
      </div>
    );
  }

  return (
    <div className={className}>
      <AnimatePresence initial={false}>
        {items.map((item, index) => (
          <motion.div
            key={getKey(item, index)}
            layout
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, delay: index * 0.03 }}
          >
            {renderItem(item, index)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
