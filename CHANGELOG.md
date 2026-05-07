# Changelog

## 2026-05-07

- Built the first authenticated MVP version of `D1shboard`.
- Added one central dashboard with file count, member count, and dynamic countdown to 6. maj 2027.
- Added spreadsheet-style sections for `Filer` and `Medlemmer`.
- Added the item form with Danish fields, access levels, drag/drop file support, and first-version creation.
- Prepared role structure for `super_admin`, `admin`, and `member`.
- Added Supabase schema for profiles, generic `items`, `item_versions`, and private document storage.
- Added password change inside `Rediger profil` for logged-in users.
- Removed public signup from the login UI.
- Removed the old separate module/profile pages from the authenticated MVP surface.
- Made `/` the single public login page.
- Removed the separate `/auth` page.
- Shifted the visual expression to a cleaner blue palette.
- Added a Supabase migration for blue module accent defaults.
- Updated project docs to use only `README.md` and `CHANGELOG.md`.

## 2026-05-05

- Created the initial Next.js and Supabase foundation.
- Added Supabase schema, RLS policies, avatar storage, profiles, modules, and module items.
- Connected GitHub and deployed to Vercel.
- Set up the live production URL at `https://f1rsteholdet.vercel.app`.
