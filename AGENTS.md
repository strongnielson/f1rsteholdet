# Agent Context

Read this before changing product, architecture, naming, security, or UI.

## Product

F1rsteholdet is a private Danish member/document hub for a group/bestyrelse.

- Danish UI.
- Private by default.
- MVP simplicity over architecture.
- One authenticated surface for now: `D1shboard`.
- Login page is the landing page.
- Do not reintroduce public signup.

## Direction

Current app:

- `/` login for existing users.
- `/dashboard` authenticated D1shboard.
- Sidebar with profile, password change, logout.
- Widgets: files, members, countdown to 6. maj 2027.
- Tables: `Filer`, `Medlemmer`.
- `+ Tilføj fil` opens the item form.

Near-term only when requested:

- user invite/create flow
- item edit/view
- version history
- password reset email flow
- permission tests

## Domain Naming

The domain object is `item`.

Uploads are part of creating/editing an item; they are not the main concept.

Prefer:

- `ItemForm`
- `ItemView`
- `createItem`
- `items`
- `item_versions`

Avoid:

- `UploadModal`
- `uploadDocument`
- upload-first component names

UI can still say `Uploadet af` and `Uploadet dato` for file history.

## Roles

- `super_admin`: full access. Currently only `strongniels@gmail.com`.
- `admin`: create/edit items, view members, no user editing yet.
- `member`: view-only for allowed content.

Do not build user creation UI until explicitly requested.

## Data

Supabase project ref: `qqftsrdkbnvyhvjkplsh`.

Core tables:

- `profiles`
- `items`
- `item_versions`

Storage:

- private bucket `documents`

Security rules:

- RLS must enforce access.
- Never commit or expose service role keys.
- Users must not update their own `role` or `email`.
- Document reads must respect item access.
- Supabase Auth signup should stay disabled at platform level.

## Component Guideline

Components should be minimal, boring, and named after product concepts.

- Keep components small and single-purpose.
- Prefer server components unless interactivity is required.
- Use client components only for local UI state, browser APIs, or Supabase session calls.
- Keep layout density tight; avoid decorative wrappers.
- Cards use `8px` radius.
- Do not nest cards inside cards.
- Do not show missing-profile placeholder text in the sidebar.
- Use DM Sans for all text; use medium weight for headings.
- Keep visible copy Danish.
- Tables must stay horizontally usable on mobile.
- Modals must stack cleanly on mobile.

## Markdown Policy

- `README.md`: run/setup/checks only.
- `CHANGELOG.md`: dated change history only.
- `AGENTS.md`: durable agent context and decision rules.

Update this file when a decision would otherwise be lost between sessions.
