# F1rsteholdet

Private Danish member and document hub.

## Stack

- Next.js App Router
- Supabase Auth, Postgres, Storage
- Vercel production: `https://f1rsteholdet.vercel.app`

## Run

```bash
npm install
npm run dev
```

Required env:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## Checks

```bash
npm run lint
npm run build
```

## Notes

- `/` is login.
- `/dashboard` is authenticated.
- UI is Danish.
- Public signup must stay off.
- Read `AGENTS.md` before product or architecture changes.
