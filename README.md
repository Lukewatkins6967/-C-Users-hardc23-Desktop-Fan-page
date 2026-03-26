# Lawson Fan Page

A premium, semi-interactive Lawson fan site built with Next.js App Router, Tailwind CSS, Framer Motion, and Supabase-backed social features.

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and add your Supabase values if you want the shared live features enabled.

3. Start the dev server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000).

Without Supabase env vars, the site still runs in local demo mode so you can preview the UI and interactions.

## Dynamic content

Edit `public/data.json` to update the hero copy, seeded facts, timeline, testimonials, and gallery cards.

- The frontend fetches `/data.json` on load and auto-refreshes every 45 seconds.
- Stats get a slight per-visit variance for a live scouting-card feel.
- Community sections use Supabase realtime when configured, with polling backup and a local demo fallback.

## Supabase setup

1. Create a Supabase project.
2. Run the SQL in `supabase/schema.sql`.
3. Add these environment variables in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

4. Make sure the tables are included in the `supabase_realtime` publication.

Tables created:

- `comments`
- `facts`
- `encounters`
- `gallery_reactions`
- `timeline_entries`
- `stats_votes`

All tables are configured for public `select` and public `insert` with no login required.

## Deploy to Vercel

1. Push this project to GitHub.
2. Import the repo into Vercel.
3. Add the same Supabase env vars in the Vercel project settings.
4. Click deploy.

Vercel will detect Next.js automatically.
