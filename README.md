# F1rsteholdet Web

F1rsteholdet is a private Danish webapp for the group. The first page is the login page; authenticated members continue into a shared dashboard with modules for trips, meetings, moments, and future group needs.

## Current Shape

- Next.js App Router app deployed on Vercel
- Supabase Auth, database, and avatar storage
- Single public entry page at `/`
- Supabase callback route at `/auth/callback`
- Protected dashboard under `/dashboard`
- User profiles with username, full name, bio, and profile picture
- Group modules with item collections
- Blue visual palette

## Docs Structure

Keep docs intentionally small:

- `README.md`: current project setup, architecture, and operating notes
- `CHANGELOG.md`: dated progress history

Do not add extra markdown files unless they have a distinct long-term purpose. If decision history becomes important, add `DECISIONS.md` later and keep it focused on product/architecture choices only.

## Local Setup

1. Install Node.js 20 or newer.
2. Install dependencies:

```bash
npm install
```

3. Create `.env.local` from `.env.example`.
4. Add Supabase project URL and anon key.
5. Start the app:

```bash
npm run dev
```

## Supabase

Run migrations with:

```bash
supabase db push
```

Auth URL settings should include:

- Site URL: `https://f1rsteholdet.vercel.app`
- Redirect URL: `https://f1rsteholdet.vercel.app/auth/callback`
- Local redirect URL: `http://localhost:3000/auth/callback`

Never expose or commit the Supabase service role key.

## Vercel

Production URL:

```text
https://f1rsteholdet.vercel.app
```

Required environment variables:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## Commands

```bash
npm run build
npm run lint
```

## Product Notes

- `/` is the login and account creation page.
- `/auth` is intentionally not a page.
- `/auth/callback` is reserved for Supabase session exchange.
- The app is Danish-first.
- New visible product copy should be written in Danish unless there is a clear reason not to.
