# F1rsteholdet Web

F1rsteholdet is a private Danish webapp for the group. The first page is the login page; authenticated members continue into one central dashboard, `D1shboard`, for files and member overview.

## Current Shape

- Next.js App Router app deployed on Vercel
- Supabase Auth, database, and document storage
- Single public entry page at `/`
- Supabase callback route at `/auth/callback`
- Protected dashboard under `/dashboard`
- No public signup or self-registration UI
- Profiles with email, full name, phone, address, and role
- Logged-in users can edit their own profile basics and change their own password
- Generic documents through `items` and `item_versions`
- Items can include files stored in the private `documents` storage bucket
- Blue visual palette

## Roles

- `super_admin`: full access, including future user administration
- `admin`: can create and edit items, including file uploads, and view members
- `member`: can view allowed documents and members only

The first super admin is `strongniels@gmail.com`. User creation UI is intentionally not part of this MVP.

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

The app removes public signup from the UI. Supabase Auth signup should also remain disabled in the Supabase dashboard for production hardening.

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

- `/` is the login page.
- `/auth` is intentionally not a page.
- `/auth/callback` is reserved for Supabase session exchange.
- `/dashboard` is the only authenticated product surface for now.
- The app is Danish-first.
- New visible product copy should be written in Danish unless there is a clear reason not to.
- `D1shboard` currently contains file stats, member stats, the 6. maj 2027 trip countdown, a files table, a members table, and the item form.
