# SyncSpace

SyncSpace is a local-first collaborative knowledge workspace MVP built as an interview submission.

## MVP Architecture

- Next.js 16 App Router for the web application.
- PostgreSQL and Prisma for persistent server data.
- Auth.js Credentials Provider for authentication.
- Tiptap for document editing.
- Dexie for browser-side offline document storage.
- Zustand for local UI/editor state.
- TanStack Query for server-state fetching and mutation.
- HTTP sync endpoints for background synchronization:
  - `POST /api/sync/push`
  - `POST /api/sync/pull`

Realtime sockets, Redis, presence, cursor tracking, a separate sync gateway, audit logs, and advanced testing are intentionally out of scope for the MVP.

## Project Structure

```txt
syncspace/
  prisma/
  public/
  src/
    app/
    components/
    hooks/
    lib/
    stores/
    types/
  package.json
  tsconfig.json
  next.config.ts
```

## Commands

Install dependencies:

```bash
npm install
```

Run the web app:

```bash
npm run dev
```

Generate Prisma Client:

```bash
npm run prisma:generate
```

Run the initial database migration:

```bash
npm run prisma:migrate
```

## Continuous Integration

`.github/workflows/ci.yml` runs on every push to `main` and on every pull
request. It installs dependencies on Ubuntu with the Node.js version required
by `package.json` (`engines.node >= 22`), generates the Prisma Client, then
runs `npm run typecheck` and `npm run build`.

The workflow sets placeholder values for `DATABASE_URL`, `AUTH_SECRET`,
`AUTH_URL`, and `NEXTAUTH_URL` directly in the workflow file. These are not
real secrets — none of the app's routes are statically generated, so the
build never opens a database connection or needs a real signing key. If a
future change introduces a build step that genuinely requires real
credentials, store them as GitHub Actions Secrets and reference them with
`${{ secrets.NAME }}` instead of hardcoding values.

Deployment is handled separately by Vercel and is not part of this workflow.
