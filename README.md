# SyncSpace

A local-first collaborative document workspace with offline editing, role-based sharing, and version history.

---

## Overview

SyncSpace is a document workspace built around a simple premise: editing should never block on network connectivity. Users write in the browser, their work is persisted locally as they type, and changes are synchronized to the server in the background whenever a connection is available.

This matters for the common case of writing on an unreliable connection — a train, a flaky office network, a laptop that sleeps mid-edit — where a purely server-backed editor either blocks input or silently loses changes. SyncSpace keeps the document writable at all times and reconciles state once connectivity returns, surfacing a sync status indicator so the user always knows whether their latest edits have reached the server.

Beyond editing, SyncSpace supports multi-user collaboration through document sharing with three permission tiers (Owner, Editor, Viewer), and keeps a manual version history so users can checkpoint and restore earlier states of a document.

The project was built as a focused MVP: a single editor experience, a small but complete authentication and authorization model, and a sync mechanism that solves the offline problem without the operational overhead of realtime infrastructure.

---

## Features

### Authentication

- Email and password registration and login via Auth.js (NextAuth) using a Credentials provider
- Passwords hashed with bcrypt before storage
- JWT-based sessions
- Sign-out flow

### Document Management

- Create, edit, and delete documents
- Each document has a title and plain-text content
- Dashboard listing all documents a user owns or has been given access to, with last-updated timestamps and a content preview

### Offline Editing

- Document drafts are persisted to the browser's IndexedDB (via Dexie) as the user types
- Editing continues to work with no network connection
- On reload, a newer local draft is detected and restored over the server-rendered version

### Synchronization

- Background synchronization of local edits to the server while the user is online
- Debounced local saves and server syncs to avoid excessive writes
- Online/offline detection drives a visible sync status (Saved, Saving, Offline edits, Sync failed)
- Optimistic-concurrency conflict detection: a sync is rejected if the server document was modified since the client last read it

### Sharing & Permissions

- Document owners can invite other registered users by email
- Three roles: Owner, Editor, Viewer
- Owners can update or remove a collaborator's access
- Access checks are enforced server-side on every document action (view, edit, delete, share, manage versions)

### Version History

- Manually save a snapshot of a document's current title and content
- Browse a list of saved versions with timestamp and author
- Preview a version's full content before restoring it
- Restore a document to a previously saved version

### User Experience

- Responsive layout (mobile through desktop) built with Tailwind CSS and HeroUI components
- Skeleton loading states for the dashboard and document views
- Empty states for documents, collaborators, and version history
- Accessible labeling on interactive elements (`aria-label`, `aria-live`, `role="alert"`/`role="status"` on status and error messaging)
- Marketing landing page separate from the authenticated application

---

## Tech Stack

| Category | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI Library | React 19 |
| Component Library | HeroUI |
| Styling | Tailwind CSS |
| Icons | Lucide |
| Animation | Framer Motion (landing page) |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | Auth.js (NextAuth v5), Credentials provider |
| Password Hashing | bcryptjs |
| Validation | Zod |
| Offline Storage | Dexie (IndexedDB) |
| Server Logic | Next.js Server Actions |

---

## Architecture Overview

SyncSpace is a single Next.js application using the App Router. There is no separate backend service.

- **Routing and rendering**: Pages under `src/app` are React Server Components. Protected routes (dashboard, editor, version history) check the current session server-side on every request and redirect to `/login` if unauthenticated.
- **Server Actions**: All mutations — creating, editing, deleting, sharing, and syncing documents, plus saving and restoring versions — are implemented as Next.js Server Actions in `src/app/dashboard/actions.ts`, `src/app/login/actions.ts`, and `src/app/register/actions.ts`. There is no separate REST or API route layer for application data; the only API route in the project is the Auth.js handler at `src/app/api/auth/[...nextauth]/route.ts`.
- **Database**: Prisma talks to PostgreSQL. The schema (`prisma/schema.prisma`) defines `User`, `Document`, `DocumentMember` (the join table that carries a collaborator's role), and `DocumentVersion`.
- **Authentication**: Auth.js is configured with a Credentials provider (`src/auth.ts`). On login, the submitted password is checked against the stored bcrypt hash; on success a JWT session is issued carrying the user's id.
- **Authorization**: Every document-related Server Action independently resolves the caller's role for that document (owner, member role, or none) and rejects the action if the role isn't permitted. There is no shared middleware layer — each Server Action performs its own check.
- **Offline storage**: The editor persists the in-progress title and content to a Dexie-backed IndexedDB store in the browser, keyed by document id, on every edit (debounced).
- **Synchronization flow**: While online, edits are also pushed to the server via a Server Action on a separate, longer debounce. The action compares the document's `updatedAt` timestamp at the time the client last read it against the current server value; if they don't match, the sync is rejected as a conflict instead of overwriting concurrent changes.

---

## Folder Structure

```txt
syncspace/
  prisma/
    schema.prisma          # Database schema (User, Document, DocumentMember, DocumentVersion)
    migrations/             # Prisma migration history
  src/
    app/
      api/auth/[...nextauth]/  # Auth.js route handler
      dashboard/               # Document list, editor, version history pages and Server Actions
      login/                   # Login page and Server Action
      register/                # Registration page and Server Action
      page.tsx                 # Public landing page
      layout.tsx                # Root layout
      error.tsx, not-found.tsx  # Error and 404 boundaries
    components/
      auth/                    # Sign-out UI
      dashboard/               # Document card, empty state, "new document" button
      editor/                  # Editor header, sync status indicator
      landing/                 # Marketing page sections
      local-editor.tsx          # Client-side document editor
      providers/                # HeroUI provider
    hooks/
      use-document-sync.ts      # Local persistence + server sync state machine
      use-online-status.ts      # Browser online/offline detection
    lib/
      db.ts                     # Prisma client singleton
      indexeddb.ts               # Dexie database and local document accessors
      password.ts                # bcrypt hashing helpers
      validation.ts               # Zod schemas for all form/action inputs
    types/
      next-auth.d.ts             # Session/JWT type augmentation
  package.json
  tsconfig.json
  next.config.ts
```

---

## Getting Started

### Prerequisites

- Node.js 22 or later
- npm 10 or later
- A running PostgreSQL instance

### Installation

```bash
git clone <repository-url>
cd syncspace
npm install
```

### Environment Variables

Copy the example file and fill in real values:

```bash
cp .env.example .env
```

See the [Environment Variables](#environment-variables) section below for what each value should be.

### Database Setup

Run the initial migration against your PostgreSQL database:

```bash
npm run prisma:migrate
```

### Prisma Client Generation

```bash
npm run prisma:generate
```

### Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string used by Prisma. |
| `AUTH_SECRET` | Yes | Secret used by Auth.js to sign session tokens. |
| `AUTH_URL` | Yes | Base URL of the application, used by Auth.js (e.g. `http://localhost:3000` in development). |
| `NEXTAUTH_URL` | Yes | Base URL of the application, used by NextAuth for redirects (e.g. `http://localhost:3000` in development). |

---

## Usage

**Register**: Visit `/register` and create an account with a name, email, and password (minimum 8 characters).

**Log in**: Visit `/login` and sign in with your email and password. You'll land on the dashboard.

**Create a document**: From the dashboard, click "New Document," give it a title, and optionally add initial content.

**Edit offline**: Open any document you own or have edit access to and start typing. Your edits are saved locally immediately, with no network connection required. The sync status indicator in the editor header reflects whether your latest changes have reached the server.

**Share a document**: As the owner of a document, open it, scroll to "Manage access," and invite a collaborator by their registered email address, choosing their role (Editor or Viewer).

**Save a version**: Open a document's version history (the clock icon in the editor header) and click "Save current version" to checkpoint the current title and content.

**Restore a version**: From the version history list, preview a version, then click "Restore" to replace the document's current content with that version's content.

---

## Synchronization

From a user's perspective: you can keep typing whether or not you're online. While editing, a status indicator shows one of four states — **Saved**, **Saving…**, **Offline edits**, or **Sync failed**. If you go offline, your edits keep being saved to your browser; as soon as you're back online, pending changes are pushed to the server automatically. If someone else modified the same document in the meantime, the sync is paused and marked as a conflict rather than silently overwriting their change — reloading the document picks up the latest server state.

At the implementation level: every keystroke updates in-memory state and schedules two independent debounced operations — a short one that writes the current title and content to IndexedDB, and a longer one that calls a Server Action to push the same data to PostgreSQL. The push includes the `updatedAt` timestamp the client last saw for that document; the server only applies the update if that timestamp still matches the row in the database, which is what detects a conflicting concurrent edit.

---

## Security

**Authentication**: Handled by Auth.js using a Credentials provider. Sessions are JWT-based and carry the authenticated user's id.

**Password hashing**: Passwords are hashed with bcrypt (12 salt rounds) before being stored; plaintext passwords are never persisted.

**Authorization**: Every Server Action that reads or mutates a document independently determines the caller's role for that document (owner, or their `DocumentMember` role) and rejects the action if the role isn't sufficient. Document ownership is tracked via a dedicated `ownerId` foreign key, separate from collaborator role records.

**Validation**: All form and action inputs (registration, login, document title/content, share email/role) are validated server-side with Zod schemas before touching the database.

---

## Deployment

1. Provision a PostgreSQL database reachable from your deployment environment.
2. Set `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, and `NEXTAUTH_URL` as environment variables on the hosting platform.
3. Run `npx prisma migrate deploy` against the production database to apply migrations.
4. Build the application with `npm run build` and start it with `npm run start`, or deploy to a platform (such as Vercel) that runs these steps automatically.

Continuous integration is configured in `.github/workflows/ci.yml`, which installs dependencies, generates the Prisma client, and runs type checking and a production build on every push and pull request against `main`.

---

## Future Improvements

The following are not implemented and are listed here only as potential future work:

- Rich-text editing (the current editor is plain text)
- Realtime collaboration (live multi-user cursors, presence)
- A dedicated HTTP sync API for non-browser clients
- Automated test coverage
- Rate limiting on authentication endpoints
- Password reset flow

---

## License

```
MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
