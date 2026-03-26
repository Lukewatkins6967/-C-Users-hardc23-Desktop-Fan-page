"use client";

import { StatKey } from "@/lib/site-data";

import { getSupabaseBrowserClient, hasSupabaseConfig } from "./supabase-browser";

export const POLL_INTERVAL_MS = 45_000;
export const SOCIAL_SYNC_EVENT = "lawson-demo-sync";
const DEMO_STORAGE_PREFIX = "lawson-social";

export type SocialTable =
  | "comments"
  | "facts"
  | "encounters"
  | "gallery_reactions"
  | "timeline_entries"
  | "stats_votes";

export type CommentRow = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};

export type FactRow = {
  id: string;
  text: string;
  submitted_by: string;
  created_at: string;
};

export type EncounterRow = {
  id: string;
  scenario: string;
  submitted_by: string;
  created_at: string;
};

export type GalleryReactionType = "applause" | "crown" | "mythic";

export type GalleryReactionRow = {
  id: string;
  image_id: string;
  reaction_type: GalleryReactionType;
  submitted_by: string;
  created_at?: string;
};

export type TimelineEntryRow = {
  id: string;
  text: string;
  submitted_by: string;
  created_at: string;
};

export type StatVoteRow = {
  id: string;
  stat_name: StatKey;
  vote: number;
  submitted_by: string;
  created_at?: string;
};

export type CommunityHighlight = {
  id: string;
  label: string;
  submittedBy: string;
  text: string;
};

export const GALLERY_REACTIONS: Array<{
  value: GalleryReactionType;
  label: string;
}> = [
  { value: "applause", label: "Applause" },
  { value: "crown", label: "Crown" },
  { value: "mythic", label: "Mythic" }
];

export const STAT_VOTE_OPTIONS = [
  { label: "Solid", value: 1 },
  { label: "Elite", value: 2 },
  { label: "Generational", value: 3 }
] as const;

export function getStorageKey(table: SocialTable) {
  return `${DEMO_STORAGE_PREFIX}:${table}`;
}

export function readDemoRows<T>(table: SocialTable) {
  if (typeof window === "undefined") {
    return [] as T[];
  }

  const raw = window.localStorage.getItem(getStorageKey(table));
  if (!raw) {
    return [] as T[];
  }

  try {
    return JSON.parse(raw) as T[];
  } catch {
    window.localStorage.removeItem(getStorageKey(table));
    return [] as T[];
  }
}

export function writeDemoRows<T>(table: SocialTable, rows: T[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(getStorageKey(table), JSON.stringify(rows));
}

export function emitDemoSync(table: SocialTable) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(SOCIAL_SYNC_EVENT, { detail: { table } }));
}

function createDemoId(prefix: SocialTable) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function insertSocialRow<T extends Record<string, unknown>>(
  table: SocialTable,
  values: T
) {
  const now = new Date().toISOString();
  const client = getSupabaseBrowserClient();

  if (client) {
    const { data, error } = await client
      .from(table)
      .insert({
        ...values,
        created_at: now
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as T & { id: string; created_at: string };
  }

  const nextRow = {
    id: createDemoId(table),
    created_at: now,
    ...values
  };

  const current = readDemoRows<Record<string, unknown>>(table);
  writeDemoRows(table, [nextRow, ...current]);
  emitDemoSync(table);
  return nextRow as T & { id: string; created_at: string };
}

export function getConnectionModeLabel(mode: "live" | "polling" | "demo") {
  if (mode === "live") {
    return "Realtime synced";
  }

  if (mode === "polling") {
    return "Polling backup";
  }

  return "Demo mode";
}

export function buildCommunityHighlights({
  comments,
  facts,
  encounters,
  timelineEntries
}: {
  comments: CommentRow[];
  facts: FactRow[];
  encounters: EncounterRow[];
  timelineEntries: TimelineEntryRow[];
}) {
  const highlights: CommunityHighlight[] = [
    ...comments.map((item) => ({
      id: `comment-${item.id}`,
      label: "Fan reaction",
      submittedBy: item.name,
      text: item.message
    })),
    ...facts.map((item) => ({
      id: `fact-${item.id}`,
      label: "Crowd-sourced fact",
      submittedBy: item.submitted_by,
      text: item.text
    })),
    ...encounters.map((item) => ({
      id: `encounter-${item.id}`,
      label: "Encounter sim",
      submittedBy: item.submitted_by,
      text: item.scenario
    })),
    ...timelineEntries.map((item) => ({
      id: `timeline-${item.id}`,
      label: "Fan milestone",
      submittedBy: item.submitted_by,
      text: item.text
    }))
  ];

  return highlights;
}

export function buildTopFans(highlights: CommunityHighlight[]) {
  const scores = new Map<string, number>();

  highlights.forEach((item) => {
    const name = item.submittedBy.trim() || "Anonymous Scout";
    scores.set(name, (scores.get(name) ?? 0) + 1);
  });

  return [...scores.entries()]
    .map(([name, total]) => ({ name, total }))
    .sort((left, right) => right.total - left.total)
    .slice(0, 3);
}

export function buildGalleryReactionSummary(rows: GalleryReactionRow[]) {
  return rows.reduce<Record<string, Partial<Record<GalleryReactionType, number>>>>((summary, row) => {
    const imageSummary = summary[row.image_id] ?? {};
    imageSummary[row.reaction_type] = (imageSummary[row.reaction_type] ?? 0) + 1;
    summary[row.image_id] = imageSummary;
    return summary;
  }, {});
}

export function buildVoteSummary(rows: StatVoteRow[]) {
  const initial = {
    charisma: { average: 0, count: 0, boost: 0 },
    athleticism: { average: 0, count: 0, boost: 0 },
    intelligence: { average: 0, count: 0, boost: 0 },
    aura: { average: 0, count: 0, boost: 0 },
    clutch: { average: 0, count: 0, boost: 0 }
  } satisfies Record<StatKey, { average: number; count: number; boost: number }>;

  const buckets = rows.reduce<Record<StatKey, number[]>>(
    (accumulator, row) => {
      accumulator[row.stat_name].push(row.vote);
      return accumulator;
    },
    {
      charisma: [],
      athleticism: [],
      intelligence: [],
      aura: [],
      clutch: []
    }
  );

  (Object.keys(buckets) as StatKey[]).forEach((key) => {
    const votes = buckets[key];
    const average = votes.length > 0 ? votes.reduce((sum, value) => sum + value, 0) / votes.length : 0;
    initial[key] = {
      average,
      count: votes.length,
      boost: votes.length > 0 ? Math.min(4, Math.round(average)) : 0
    };
  });

  return initial;
}

export function isSupabaseEnabled() {
  return hasSupabaseConfig();
}
