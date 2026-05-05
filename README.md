# F1rsteholdet Web

`F1rsteholdet` is set up here as a Vercel-native Next.js app backed by Supabase for auth, database, and avatar storage.

## What is included

- App Router Next.js foundation in `src/`
- Supabase SSR auth with protected dashboard routes
- Profile records with username, full name, bio, and profile picture upload
- Flexible "modules" with item collections for trips, meetings, and memories
- Supabase SQL migration in `supabase/migrations/`
- GitHub + Vercel + Supabase setup guide below

## Local setup

1. Install Node.js 20 or newer.
2. From `F1rsteholdet/`, run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Add your Supabase project URL and anon key.
5. Run the SQL migration in Supabase:

```sql
-- paste the file from supabase/migrations/202605050001_initial_schema.sql
```

6. Start the app:

```bash
npm run dev
```

## Supabase setup

1. Create a new Supabase project.
2. In `Authentication > URL Configuration`, add:
   - Site URL: your eventual Vercel URL
   - Redirect URL: `https://your-domain.com/auth/callback`
   - For local dev also add `http://localhost:3000/auth/callback`
3. Run the migration SQL from `supabase/migrations/202605050001_initial_schema.sql`.
4. Copy the project URL and anon key into `F1rsteholdet/.env.local`.

## GitHub and Vercel flow

1. Initialize git at the repo root if it is not already a git repository:

```bash
git init
git add .
git commit -m "Add F1rsteholdet web app foundation"
```

2. Create a GitHub repository and push:

```bash
git remote add origin <your-github-repo-url>
git push -u origin main
```

3. In Vercel:
   - Import the GitHub repository
   - Set the root directory to `F1rsteholdet`
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Deploy

Every push to GitHub will then trigger a Vercel deployment.

## Product shape

- Public landing page that explains the group and invites members in
- Auth page for sign in and account creation
- Protected dashboard with module overview
- Module detail pages with item creation for plans, trips, meetings, and shared moments
- Profile page with editable username, name, bio, and avatar

## Important assumption

Auth is implemented as email + password with a required username profile. That keeps the integration clean with Supabase Auth while still giving every member a visible username.
