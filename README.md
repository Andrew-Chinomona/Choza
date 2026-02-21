# Choza — Hotel Operations Management System (HOMS)

Next.js (App Router) + TypeScript + Neon (PostgreSQL) + Vercel

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env` file in the project root with the following:

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string |
| `AUTH_JWT_SECRET` | Yes | Secret for signing session JWTs |
| `VAPID_PUBLIC_KEY` | Later (PWA) | Web Push VAPID public key |
| `VAPID_PRIVATE_KEY` | Later (PWA) | Web Push VAPID private key |
| `NEXT_PUBLIC_APP_URL` | Production | Base URL for absolute links |
| `CRON_SECRET` | Production | Secret token to protect cron endpoints |

## Database Setup

The database uses raw SQL migrations against Neon Postgres. Migration files live in `database/migrations/` and seed data in `database/seeds/`.

### Commands

```bash
# Apply all pending migrations
npm run db:migrate

# Seed the database with MVP data (single hotel, sample users/rooms)
npm run db:seed

# Reset the database (drops all tables — dev/staging only)
npm run db:reset
```

### First-time setup

1. Create a Neon project at [console.neon.tech](https://console.neon.tech).
2. Copy the connection string into `DATABASE_URL` in `.env`.
3. Run migrations and seed:

```bash
npm run db:migrate
npm run db:seed
```

### Seed users (dev)

All seed users have PIN `1234`:

| Username | Role | Purpose |
|---|---|---|
| `admin` | ADMIN | System admin |
| `manager` | MAIN_MANAGER | Main manager + analytics |
| `frontdesk` | OPS_MANAGEMENT | Front desk operations |
| `housekeeper1` | HOUSEKEEPER | Housekeeping staff |
| `housekeeper2` | HOUSEKEEPER | Housekeeping staff |
| `maint1` | MAINTENANCE | Maintenance staff |

## Database Access Layer

Typed repository modules live under `src/lib/db/`:

- `neon.ts` — connection factory (uses `DATABASE_URL`)
- `types.ts` — TypeScript interfaces for all entities
- `rooms.ts`, `assignments.ts`, `cleaning.ts`, `notes.ts`, `maintenance.ts`, `audit.ts`, `users.ts` — hotel-scoped query functions
- `index.ts` — barrel export

Import from `@/lib/db`:

```ts
import { rooms, users } from "@/lib/db";
const allRooms = await rooms.getRoomsByHotel(hotelId);
```

## Database Integration

The app talks to Neon Postgres only on the server. All DB access goes through `src/lib/db/`.

| Where | How it connects |
|-------|------------------|
| **Server Actions** (`src/app/actions.ts`) | Import `@/lib/db` and call repository functions (e.g. `rooms.getRoomsByHotel(hotelId)`). Used by forms and client-triggered data fetches. |
| **API routes** (`src/app/api/.../route.ts`) | Same: import `@/lib/db`, call repos. Use for login, CRUD, and cron. Always scope by `hotel_id` from the session. |
| **Server Components** (pages under `src/app/`) | Import `@/lib/db` and await repo functions directly. No `"use client"`; DB code runs only on the server. |
| **Client Components** | Do not import `@/lib/db`. Fetch via Server Actions or `fetch('/api/...')` instead. |

**Important:** Every query must be scoped by `hotel_id` (from the logged-in user’s session) to enforce multi-tenant isolation. The DB layer does not add this automatically — the caller passes `hotelId`.

**Example — Server Component fetching rooms:**

```ts
// src/app/(dashboard)/housekeeping/page.tsx
import { assignments } from "@/lib/db";

export default async function HousekeepingPage() {
  const hotelId = "a0000000-0000-0000-0000-000000000001"; // from session in real app
  const list = await assignments.getAssignmentsForHousekeeper(hotelId, userId);
  return (/* ... */);
}
```

**Example — Server Action:**

```ts
"use server";
import { rooms } from "@/lib/db";

export async function setRoomVacant(roomId: string, hotelId: string, isVacant: boolean) {
  return rooms.setVacancy(roomId, hotelId, isVacant);
}
```

## Cron Endpoints (Production)

Two cron jobs should be configured in Vercel:

| Job | Schedule | Endpoint | Purpose |
|---|---|---|---|
| Audit retention | Daily | `/api/cron/audit-cleanup` | Purge audit logs older than retention window |
| Metrics materialization | Daily (optional) | `/api/cron/metrics` | Pre-compute daily performance summaries |

Protect these endpoints by checking the `CRON_SECRET` header against the env var.

## API-to-Table Reference

See `database/API_TABLE_MAP.md` for the full mapping of every API endpoint to the database tables it reads/writes and whether it generates audit log entries.

## Deploy on Vercel

1. Push to GitHub.
2. Connect the repo in Vercel.
3. Set all environment variables in Vercel project settings.
4. Vercel will run `next build` automatically.
5. Run `npm run db:migrate` once against the production `DATABASE_URL`.
