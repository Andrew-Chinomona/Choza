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

- `neon.ts` — connection factory
- `types.ts` — TypeScript interfaces for all entities
- `rooms.ts`, `assignments.ts`, `cleaning.ts`, `notes.ts`, `maintenance.ts`, `audit.ts`, `users.ts` — hotel-scoped query functions
- `index.ts` — barrel export

Import from `@/lib/db`:

```ts
import { rooms, users } from "@/lib/db";
const allRooms = await rooms.getRoomsByHotel(hotelId);
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
