"use client";

import { FormEvent, useEffect, useState } from "react";

import {
  ENCOUNTER_RESULTS,
  FALLBACK_FACTS,
  FALLBACK_GALLERY,
  LawsonSiteData,
  StatKey,
  buildOverallRating,
  clampStat,
  getDailyQuote,
  getRandomItem,
  varyStats
} from "@/lib/site-data";
import {
  CommentRow,
  EncounterRow,
  FactRow,
  GalleryReactionRow,
  GalleryReactionType,
  StatVoteRow,
  TimelineEntryRow,
  buildCommunityHighlights,
  buildGalleryReactionSummary,
  buildTopFans,
  buildVoteSummary,
  insertSocialRow,
  isSupabaseEnabled
} from "@/lib/social";
import { useLiveTable } from "@/lib/use-live-table";

import { GallerySection } from "./gallery-section";
import { HeroSection } from "./hero-section";
import { InteractiveSection } from "./interactive-section";
import { LiveIntelPanel } from "./live-intel-panel";
import { LoreSection } from "./lore-section";
import { StatsSection } from "./stats-section";
import { TestimonialsSection } from "./testimonials-section";
import { TimelineSection } from "./timeline-section";

const aliasStorageKey = "lawson-fan-alias";

const defaultData: LawsonSiteData = {
  name: "Lawson",
  school: "St Bede's",
  tagline: "A once-in-a-generation presence",
  stats: {
    charisma: 95,
    athleticism: 88,
    intelligence: 92,
    aura: 99,
    clutch: 94
  },
  facts: FALLBACK_FACTS,
  timeline: [
    {
      year: "2023",
      title: "The Murmurs Begin",
      detail: "Quietly becomes the most talked-about individual in class without ever acting like he needed the headline."
    },
    {
      year: "2024",
      title: "Tuesday Peak",
      detail: "Peaks during a random Tuesday and leaves analysts wondering if a ceiling is even a serious concept."
    }
  ],
  testimonials: [
    {
      name: "Anonymous Insider",
      quote: "I've seen composure before. This was composure with production value.",
      label: "Hallway source",
      createdAt: "2026-03-22T08:30:00.000Z"
    }
  ],
  gallery: FALLBACK_GALLERY,
  quotes: []
};

type CooldownKey = "comments" | "facts" | "encounters" | "timeline" | "gallery" | "stats";
type Mode = "live" | "polling" | "demo";

export function FanPage() {
  const [siteData, setSiteData] = useState<LawsonSiteData>(defaultData);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [factOfMoment, setFactOfMoment] = useState(() => getRandomItem(FALLBACK_FACTS));
  const [encounterResult, setEncounterResult] = useState(() => getRandomItem(ENCOUNTER_RESULTS));
  const [selectedGallery, setSelectedGallery] = useState<number | null>(null);
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [visitSeed] = useState(() => Math.random() * 1000);
  const [fanAlias, setFanAlias] = useState("Anonymous Scout");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<CooldownKey, boolean>>({
    comments: false,
    facts: false,
    encounters: false,
    timeline: false,
    gallery: false,
    stats: false
  });

  const [commentName, setCommentName] = useState("");
  const [commentMessage, setCommentMessage] = useState("");
  const [factName, setFactName] = useState("");
  const [factText, setFactText] = useState("");
  const [encounterName, setEncounterName] = useState("");
  const [encounterText, setEncounterText] = useState("");
  const [timelineName, setTimelineName] = useState("");
  const [timelineText, setTimelineText] = useState("");

  const commentsFeed = useLiveTable<CommentRow>({
    table: "comments",
    select: "id,name,message,created_at",
    orderBy: {
      column: "created_at",
      ascending: false
    },
    limit: 24
  });

  const factsFeed = useLiveTable<FactRow>({
    table: "facts",
    select: "id,text,submitted_by,created_at",
    orderBy: {
      column: "created_at",
      ascending: false
    },
    limit: 24
  });

  const encountersFeed = useLiveTable<EncounterRow>({
    table: "encounters",
    select: "id,scenario,submitted_by,created_at",
    orderBy: {
      column: "created_at",
      ascending: false
    },
    limit: 24
  });

  const galleryFeed = useLiveTable<GalleryReactionRow>({
    table: "gallery_reactions",
    select: "id,image_id,reaction_type,submitted_by,created_at",
    orderBy: {
      column: "created_at",
      ascending: false
    },
    limit: 500
  });

  const timelineFeed = useLiveTable<TimelineEntryRow>({
    table: "timeline_entries",
    select: "id,text,submitted_by,created_at",
    orderBy: {
      column: "created_at",
      ascending: false
    },
    limit: 24
  });

  const statsFeed = useLiveTable<StatVoteRow>({
    table: "stats_votes",
    select: "id,stat_name,vote,submitted_by,created_at",
    orderBy: {
      column: "created_at",
      ascending: false
    },
    limit: 500
  });

  useEffect(() => {
    const storedAlias = window.localStorage.getItem(aliasStorageKey);
    if (storedAlias) {
      setFanAlias(storedAlias);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const loadSiteData = async () => {
      try {
        const response = await fetch(`/data.json?ts=${Date.now()}`, {
          cache: "no-store"
        });

        if (!response.ok) {
          return;
        }

        const incoming = (await response.json()) as LawsonSiteData;
        if (!active) {
          return;
        }

        const nextFacts = incoming.facts.length > 0 ? incoming.facts : FALLBACK_FACTS;
        setSiteData(incoming);
        setLastUpdated(new Date());
        setFactOfMoment((current) => (nextFacts.includes(current) ? current : getRandomItem(nextFacts)));
      } catch {
        if (active) {
          setLastUpdated(new Date());
        }
      }
    };

    void loadSiteData();
    const intervalId = window.setInterval(() => {
      void loadSiteData();
    }, 45_000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const factsPool = [...(siteData.facts.length > 0 ? siteData.facts : FALLBACK_FACTS), ...factsFeed.rows.map((item) => item.text)];
  const encounterPool = [...ENCOUNTER_RESULTS, ...encountersFeed.rows.map((item) => item.scenario)];
  const varyingStats = varyStats(siteData.stats, visitSeed);
  const voteSummary = buildVoteSummary(statsFeed.rows);
  const displayStats = {
    charisma: clampStat(varyingStats.charisma + voteSummary.charisma.boost),
    athleticism: clampStat(varyingStats.athleticism + voteSummary.athleticism.boost),
    intelligence: clampStat(varyingStats.intelligence + voteSummary.intelligence.boost),
    aura: clampStat(varyingStats.aura + voteSummary.aura.boost),
    clutch: clampStat(varyingStats.clutch + voteSummary.clutch.boost)
  };
  const overallRating = buildOverallRating(displayStats, visitSeed);
  const communityVoteAverage =
    statsFeed.rows.length > 0
      ? statsFeed.rows.reduce((sum, item) => sum + item.vote, 0) / statsFeed.rows.length
      : 0;
  const communityGoatScore =
    statsFeed.rows.length > 0 ? Math.min(99, Math.round(90 + communityVoteAverage * 3)) : overallRating;
  const dailyQuote = getDailyQuote(siteData.quotes ?? []);
  const galleryItems = siteData.gallery && siteData.gallery.length > 0 ? siteData.gallery : FALLBACK_GALLERY;
  const reactionSummary = buildGalleryReactionSummary(galleryFeed.rows);

  const seededTestimonials = siteData.testimonials.map((item, index) => ({
    id: `seed-${index}-${item.createdAt}`,
    label: item.label,
    name: item.name,
    quote: item.quote,
    createdAt: item.createdAt
  }));
  const liveTestimonials = commentsFeed.rows.map((item) => ({
    id: item.id,
    label: "Live fan reaction",
    name: item.name,
    quote: item.message,
    createdAt: item.created_at
  }));
  const testimonialFeed = [...seededTestimonials, ...liveTestimonials].sort((left, right) => {
    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
  });

  const seededHighlights = siteData.testimonials.map((item, index) => ({
    id: `seed-highlight-${index}`,
    label: item.label,
    submittedBy: item.name,
    text: item.quote
  }));
  const communityHighlights = [
    ...seededHighlights,
    ...buildCommunityHighlights({
      comments: commentsFeed.rows,
      facts: factsFeed.rows,
      encounters: encountersFeed.rows,
      timelineEntries: timelineFeed.rows
    })
  ];
  const topFans = buildTopFans(communityHighlights);
  const highlight =
    communityHighlights.length > 0
      ? communityHighlights[Math.abs(Math.floor(visitSeed * 1000)) % communityHighlights.length]
      : null;

  const socialErrors = [
    commentsFeed.error,
    factsFeed.error,
    encountersFeed.error,
    galleryFeed.error,
    timelineFeed.error,
    statsFeed.error
  ].filter(Boolean);

  const pickMode = (...modes: Mode[]): Mode => {
    if (modes.includes("live")) {
      return "live";
    }

    if (modes.includes("polling")) {
      return "polling";
    }

    return "demo";
  };

  const socialMode = pickMode(
    commentsFeed.mode,
    factsFeed.mode,
    encountersFeed.mode,
    galleryFeed.mode,
    timelineFeed.mode,
    statsFeed.mode
  );
  const interactiveMode = pickMode(factsFeed.mode, encountersFeed.mode);

  useEffect(() => {
    if (factsPool.length === 0) {
      return;
    }

    setFactOfMoment((current) => (factsPool.includes(current) ? current : getRandomItem(factsPool)));
  }, [factsFeed.rows.length, siteData.facts.length]);

  const rememberAlias = (value: string) => {
    const cleaned = value.trim();
    if (!cleaned) {
      return;
    }

    setFanAlias(cleaned);
    window.localStorage.setItem(aliasStorageKey, cleaned);
  };

  const resolveAlias = (value: string) => {
    const cleaned = value.trim();
    if (cleaned) {
      rememberAlias(cleaned);
      return cleaned;
    }

    return fanAlias || "Anonymous Scout";
  };

  const triggerCooldown = (key: CooldownKey, ms: number) => {
    setCooldowns((current) => ({
      ...current,
      [key]: true
    }));

    window.setTimeout(() => {
      setCooldowns((current) => ({
        ...current,
        [key]: false
      }));
    }, ms);
  };

  const handleGenerateFact = () => {
    setFactOfMoment(getRandomItem(factsPool));
  };

  const handleEncounter = () => {
    setEncounterResult(getRandomItem(encounterPool));
  };

  const handleCommentSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (cooldowns.comments) {
      return;
    }

    const message = commentMessage.trim();
    if (!message) {
      return;
    }

    try {
      await insertSocialRow("comments", {
        name: resolveAlias(commentName),
        message
      });
      commentsFeed.refresh();
      setCommentMessage("");
      setStatusMessage(null);
      triggerCooldown("comments", 8_000);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unable to submit the scouting report.");
    }
  };

  const handleFactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (cooldowns.facts) {
      return;
    }

    const text = factText.trim();
    if (!text) {
      return;
    }

    try {
      await insertSocialRow("facts", {
        text,
        submitted_by: resolveAlias(factName)
      });
      factsFeed.refresh();
      setFactText("");
      setStatusMessage(null);
      triggerCooldown("facts", 8_000);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unable to submit the new Lawson fact.");
    }
  };

  const handleEncounterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (cooldowns.encounters) {
      return;
    }

    const scenario = encounterText.trim();
    if (!scenario) {
      return;
    }

    try {
      await insertSocialRow("encounters", {
        scenario,
        submitted_by: resolveAlias(encounterName)
      });
      encountersFeed.refresh();
      setEncounterText("");
      setStatusMessage(null);
      triggerCooldown("encounters", 8_000);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unable to submit the encounter scenario.");
    }
  };

  const handleTimelineSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (cooldowns.timeline) {
      return;
    }

    const text = timelineText.trim();
    if (!text) {
      return;
    }

    try {
      await insertSocialRow("timeline_entries", {
        text,
        submitted_by: resolveAlias(timelineName)
      });
      timelineFeed.refresh();
      setTimelineText("");
      setStatusMessage(null);
      triggerCooldown("timeline", 8_000);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unable to submit the fan milestone.");
    }
  };

  const handleGalleryReaction = async (imageId: string, reactionType: GalleryReactionType) => {
    if (cooldowns.gallery) {
      return;
    }

    try {
      await insertSocialRow("gallery_reactions", {
        image_id: imageId,
        reaction_type: reactionType,
        submitted_by: fanAlias || "Anonymous Scout"
      });
      galleryFeed.refresh();
      setStatusMessage(null);
      triggerCooldown("gallery", 2_500);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unable to register the gallery reaction.");
    }
  };

  const handleStatVote = async (statName: StatKey, vote: number) => {
    if (cooldowns.stats) {
      return;
    }

    try {
      await insertSocialRow("stats_votes", {
        stat_name: statName,
        vote,
        submitted_by: fanAlias || "Anonymous Scout"
      });
      statsFeed.refresh();
      setStatusMessage(null);
      triggerCooldown("stats", 4_000);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unable to cast the stat vote.");
    }
  };

  return (
    <main className="relative overflow-hidden">
      <div className="aurora aurora-left" />
      <div className="aurora aurora-right" />
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <HeroSection
          name={siteData.name}
          school={siteData.school}
          tagline={siteData.tagline}
          dailyQuote={dailyQuote}
          lastUpdated={lastUpdated}
        />

        {!isSupabaseEnabled() ? (
          <section className="glass-panel section-shell rounded-[1.8rem] px-6 py-5 text-sm leading-7 text-[var(--text-secondary)]">
            Community features are in demo mode until `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are set. The UI still works locally, then upgrades to shared realtime once those env vars and tables exist.
          </section>
        ) : null}

        {statusMessage || socialErrors.length > 0 ? (
          <section className="glass-panel section-shell rounded-[1.8rem] border border-amber-200/20 px-6 py-5 text-sm leading-7 text-amber-50">
            {statusMessage ?? socialErrors[0]}
          </section>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <LoreSection />
          <LiveIntelPanel
            overallRating={overallRating}
            factOfMoment={factOfMoment}
            mode={socialMode}
            highlight={highlight}
            topFans={topFans}
          />
        </div>

        <StatsSection
          stats={displayStats}
          overallRating={overallRating}
          mode={statsFeed.mode}
          voteSummary={voteSummary}
          communityGoatScore={communityGoatScore}
          onVote={handleStatVote}
          disabled={cooldowns.stats}
        />

        <InteractiveSection
          factOfMoment={factOfMoment}
          encounterResult={encounterResult}
          onGenerateFact={handleGenerateFact}
          onSimulateEncounter={handleEncounter}
          secretUnlocked={secretUnlocked}
          onUnlockSecret={() => setSecretUnlocked((current) => !current)}
          facts={factsFeed.rows}
          encounters={encountersFeed.rows}
          factName={factName}
          factText={factText}
          encounterName={encounterName}
          encounterText={encounterText}
          onFactNameChange={setFactName}
          onFactTextChange={setFactText}
          onEncounterNameChange={setEncounterName}
          onEncounterTextChange={setEncounterText}
          onFactSubmit={handleFactSubmit}
          onEncounterSubmit={handleEncounterSubmit}
          mode={interactiveMode}
          factDisabled={cooldowns.facts}
          encounterDisabled={cooldowns.encounters}
        />

        <GallerySection
          items={galleryItems}
          selectedGallery={selectedGallery}
          onSelect={setSelectedGallery}
          onClose={() => setSelectedGallery(null)}
          reactionSummary={reactionSummary}
          onReact={handleGalleryReaction}
          mode={galleryFeed.mode}
          disabled={cooldowns.gallery}
        />

        <TimelineSection
          timeline={siteData.timeline}
          liveEntries={timelineFeed.rows}
          nameValue={timelineName}
          textValue={timelineText}
          onNameChange={setTimelineName}
          onTextChange={setTimelineText}
          onSubmit={handleTimelineSubmit}
          mode={timelineFeed.mode}
          disabled={cooldowns.timeline}
        />

        <TestimonialsSection
          nameInput={commentName}
          messageInput={commentMessage}
          onNameChange={setCommentName}
          onMessageChange={setCommentMessage}
          onSubmit={handleCommentSubmit}
          testimonials={testimonialFeed}
          mode={commentsFeed.mode}
          disabled={cooldowns.comments}
        />

        <footer className="glass-panel section-shell noise rounded-[2rem] px-6 py-6 text-sm text-[var(--text-secondary)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p>This page is currently under review by experts, scouts, and at least one suspiciously impressed lunch table.</p>
            <p className="text-[var(--text-primary)]">Projected #1 Overall Pick in the Life Draft.</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
