# Agent Context

This file is for future Codex/agent sessions. Read it before making product, architecture, naming, security, or UX decisions.

## Product Direction

F1rsteholdet is a private Danish member and document hub for a group/bestyrelse.

The app should stay simple, maintainable, and private by default. Prefer one clear MVP surface over adding navigation layers early.

The UI language is Danish. Code can stay English, but user-visible labels and messages should be Danish unless there is a clear reason.

## Current Product Shape

- `/` is the landing page and login page.
- Public signup/self-registration is removed from the UI.
- `/dashboard` is the only authenticated product surface for now.
- Dashboard name is `D1shboard`.
- The visual expression is clean, restrained, and blue.
- Desktop and mobile responsiveness matter from the beginning.

## Core Domain Model

The central domain object is an `item`.

An item can have a file upload, but upload is only part of creating or editing an item. Avoid naming components, actions, or concepts as if upload is the main object.

Use names like:

- `ItemForm`
- `ItemView`
- `createItem`
- `items`
- `item_versions`

Avoid names like:

- `UploadModal`
- `uploadDocument`
- upload-first component names

UI labels can still say things like `Uploadet af` or `Uploadet dato` when describing file history.

## Roles And Permissions

Roles are prepared as:

- `super_admin`: full access. For now this is only `strongniels@gmail.com`.
- `admin`: can create/edit items and view members. Admins should not edit users yet.
- `member`: view-only access for allowed content.

Do not build user creation UI until explicitly requested.

Do not reintroduce public signup.

## Current MVP Features

- Login for existing users.
- D1shboard sidebar with profile details and logout.
- `Rediger profil` supports full name, address, phone, and password change.
- Top widgets:
  - `Antal filer`
  - `Antal medlemmer`
  - `Næste tur om: X dage`
- Trip date is 6. maj 2027 and countdown should stay dynamic.
- `Filer` spreadsheet section.
- `Medlemmer` spreadsheet section.
- `+ Tilføj fil` opens the item form.
- Item creation creates:
  - one `items` row
  - one `item_versions` row
  - one file in the private `documents` bucket

## Database And Storage

Supabase is the source of truth.

Important tables:

- `profiles`
- `items`
- `item_versions`

Important storage bucket:

- `documents`

Security posture:

- RLS should enforce access.
- Service role keys must never be committed or exposed.
- Profile self-update must not allow users to change their own `role` or `email`.
- Document storage reads should respect item access level.
- App-side public signup is removed; Supabase Auth signup should also remain disabled in the Supabase dashboard for production hardening.

## Infrastructure

- GitHub repo: `https://github.com/strongnielson/f1rsteholdet`
- Production URL: `https://f1rsteholdet.vercel.app`
- Supabase project ref: `qqftsrdkbnvyhvjkplsh`
- Vercel project name/url should use `f1rsteholdet`.

## Documentation Policy

Keep markdown useful and non-redundant:

- `README.md`: human setup, architecture, commands, deployment notes.
- `CHANGELOG.md`: dated history of what changed.
- `AGENTS.md`: durable agent context, product direction, naming rules, and decision boundaries.

Update `AGENTS.md` when a future decision would otherwise be lost between sessions.

## Near-Term Direction

Likely next steps, only when requested:

- Disable Supabase Auth signup at platform level if not already done.
- Add user invitation/creation flow for `admin` and `member`.
- Add item edit flow.
- Add item detail/view.
- Add version history UI.
- Add safer password reset flow and email templates later.
- Add tests around permissions and item creation when complexity grows.
