export type StatKey = "charisma" | "athleticism" | "intelligence" | "aura" | "clutch";

export type StatsBlock = Record<StatKey, number>;

export type TimelineEntry = {
  year: string;
  title: string;
  detail: string;
};

export type Testimonial = {
  id?: string;
  name: string;
  quote: string;
  label: string;
  createdAt: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  caption: string;
  tag: string;
  palette: [string, string, string];
};

export type LawsonSiteData = {
  name: string;
  school: string;
  tagline: string;
  stats: StatsBlock;
  facts: string[];
  timeline: TimelineEntry[];
  testimonials: Testimonial[];
  gallery?: GalleryItem[];
  quotes?: string[];
};

export const DEFAULT_QUOTES = [
  "Scouts still disagree on whether Lawson is a player, a movement, or a weather event.",
  "Somewhere between lunch break and final bell, Lawson became an institution.",
  "Every era needs a headline talent. St Bede's got Lawson and called it a wrap.",
  "Experts say the aura is real. The experts were not prepared for the rest."
];

export const ENCOUNTER_RESULTS = [
  "You make eye contact. For one brief second, every school hallway feels like a finals tunnel.",
  "Lawson nods once. Your internal confidence rating jumps by 12 points immediately.",
  "He says 'all good?' and the phrase echoes with impossible calm for the rest of the day.",
  "A nearby whiteboard starts looking more organized the moment Lawson enters the room.",
  "The encounter is low-key, efficient, and somehow statistically historic."
];

export const FALLBACK_FACTS = [
  "Teachers reportedly adjusted grading scales after witnessing Lawson lock in.",
  "Seen turning a regular Tuesday into appointment viewing.",
  "Allegedly capable of making a school blazer look like championship attire.",
  "Rumor says one Lawson head nod can settle an entire lunch-table debate."
];

export const FALLBACK_GALLERY: GalleryItem[] = [
  {
    id: "arrival-energy",
    title: "Arrival Energy",
    caption: "A dramatic reconstruction of Lawson entering the scene like the opening shot of an A24 sports documentary.",
    tag: "Entrance footage",
    palette: ["#1e90ff", "#0f172a", "#6dfec4"]
  },
  {
    id: "lunch-break-lock-in",
    title: "Lunch Break Lock-In",
    caption: "Multiple witnesses confirmed the focus level looked somewhere between exam prep and Game 7 tape study.",
    tag: "Peak aura",
    palette: ["#ffb347", "#5b247a", "#ff8eb7"]
  },
  {
    id: "hallway-gravitas",
    title: "Hallway Gravitas",
    caption: "Architectural lines, premium lighting, and one generational presence doing casual things with excessive significance.",
    tag: "Museum quality",
    palette: ["#67e8f9", "#0f766e", "#0f172a"]
  }
];

export function clampStat(value: number) {
  return Math.max(70, Math.min(99, Math.round(value)));
}

export function varyStats(baseStats: StatsBlock, seed: number): StatsBlock {
  const entries = Object.entries(baseStats).map(([key, value], index) => {
    const wave = Math.sin(seed * 13 + index * 1.7) * 2.8;
    const drift = Math.cos(seed * 7 + index * 1.1) * 1.7;
    return [key, clampStat(value + wave + drift)];
  });

  return Object.fromEntries(entries) as StatsBlock;
}

export function buildOverallRating(stats: StatsBlock, seed: number) {
  const values = Object.values(stats);
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const auraBonus = Math.sin(seed * 19) * 1.6;
  return clampStat(mean + auraBonus + 2);
}

export function getDailyQuote(quotes: string[], date = new Date()) {
  const safeQuotes = quotes.length > 0 ? quotes : DEFAULT_QUOTES;
  const dayIndex = Math.floor(date.getTime() / 86_400_000);
  return safeQuotes[Math.abs(dayIndex) % safeQuotes.length];
}

export function getRandomItem<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

export function formatTimestamp(value: Date) {
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(value);
}
