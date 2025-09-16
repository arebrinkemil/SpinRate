# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project overview

SpinRate is a Remix + Vite TypeScript app with server-rendered React (streaming), Tailwind CSS (with NextUI), and Prisma as the data access layer targeting MongoDB. Content is integrated via Sanity, and new releases are pulled from the Spotify API.

Key technologies and entry points:
- App framework: Remix (SSR + routing) with Vite
  - Entry: app/entry.server.tsx (streaming SSR), app/entry.client.tsx (hydration)
  - Root layout: app/root.tsx (NextUI provider, dark mode, NavBar/Footer)
- UI: TailwindCSS (tailwind.config.ts) + NextUI components
- TypeScript config: tsconfig.json (alias ~/* -> ./app/*)
- Data layer: Prisma (prisma/schema.prisma) with MongoDB provider
  - Prisma client setup: app/db/prisma.ts (singleton in dev)
  - Seed script: prisma/seed.ts
- Auth: Cookie-based session in app/auth/auth.ts (cookie name "auth")
- Content: Sanity client in app/sanity/client.ts
- External integration: Spotify API in app/routes/queries.ts (fetches new releases and upserts via helper functions)

Note on database: README.md references PostgreSQL, but the schema at prisma/schema.prisma uses provider = "mongodb". Treat MongoDB as the source of truth.

## Commands you will commonly use

- Install dependencies (Node >= 20 per package.json engines):
  ```bash
  npm install
  ```

- Start dev server (Remix + Vite):
  ```bash
  npm run dev
  ```

- Build for production:
  ```bash
  npm run build
  ```

- Start production server (serves build/server/index.js):
  ```bash
  npm run start
  ```

- Lint (ESLint with caching, respects .gitignore):
  ```bash
  npm run lint
  ```

- Type-check (no emit):
  ```bash
  npm run typecheck
  ```

- Database: seed local/dev data:
  ```bash
  npm run prisma-seed
  ```

- Database: SSH tunnel to remote MongoDB (for local use). This forwards local 27018 -> remote 27017:
  ```bash
  npm run db:tunnel
  ```
  After starting the tunnel, set DATABASE_URL to a MongoDB URI that points at 127.0.0.1:27018 (adjust database name/options as appropriate for your environment).

- Prisma CLI (on demand):
  ```bash
  npx prisma generate
  npx prisma db push
  ```
  Use these when changing prisma/schema.prisma. db push syncs the schema to MongoDB.

- Tests:
  A test runner is not configured in this repo (no test script or jest/vitest config present). Running a single test is not applicable.

## Environment configuration

env validation is centralized in app/config/env.ts using zod. Ensure these variables exist in your environment (values omitted):
- DATABASE_URL  (MongoDB connection string)
- SPOTIFY_CLIENT_ID
- SPOTIFY_CLIENT_SECRET
- AUTH_SECRET  (min length 32)
- AUTH_URL
- API_URL
- API_VERSION
- CACHE_TTL
- RATE_LIMIT_WINDOW_MS
- RATE_LIMIT_MAX_REQUESTS
- LOG_LEVEL  (one of: debug, info, warn, error)
- ENABLE_CACHE            ("true"|"false")
- ENABLE_RATE_LIMIT       ("true"|"false")
- ENABLE_LOGGING          ("true"|"false")

Additional variable referenced by auth (not part of env.ts schema):
- COOKIE_SECRET (used to sign the session cookie in app/auth/auth.ts)

Note: app/routes/queries.ts currently obtains a Spotify access token using constants in-file. If you need environment-driven credentials, align that code with the variables above.

## High-level architecture

- Routing and SSR
  - Remix routes in app/routes drive both loaders/actions and UI rendering. The _index route redirects to /home.
  - entry.server.tsx implements React 18 streaming (bots vs browsers) and sets ABORT_DELAY.
  - entry.client.tsx hydrates the app.
  - root.tsx wires global providers (NextUI), layout, dark-mode script, and redirects logged-in users from "/" to "/home" via its loader.

- Auth
  - app/auth/auth.ts manages a signed "auth" cookie (httpOnly, lax). COOKIE_SECRET is required in non-development contexts. Helpers include requireAuthCookie and redirectIfLoggedInLoader.

- Data and domain logic
  - Prisma client lives in app/db/prisma.ts with a dev-time global to prevent duplicate clients.
  - Core models (MongoDB via Prisma): User, Password, Artist, Album, Song, Rating, Review, Comment, Favorite (see prisma/schema.prisma).
  - Utilities in app/utils encapsulate cross-cutting concerns and domain logic:
    - cache.ts (simple TTL cache + decorator + middleware)
    - ratingLogic.ts, reviewLogic.ts, reviewLoader.ts (aggregate fetches for rating/review UIs)
    - middleware.ts, rateLimit.ts, errors.ts, logger.ts

- External/content integrations
  - Sanity: app/sanity/client.ts (projectId, dataset, apiVersion)
  - Spotify: app/routes/queries.ts fetches new releases using the client credentials flow and upserts artists/albums/songs.

- Build/tooling
  - Vite config: vite.config.ts (remix vite plugin + tsconfig paths)
  - Tailwind config: tailwind.config.ts (NextUI plugin, custom theme and breakpoints)
  - ESLint: .eslintrc.cjs (React + TS + a11y, TS-aware imports)
  - TypeScript: tsconfig.json (ES2022, bundler resolution, noEmit, alias ~/*)

## Docs and rules surfaced to Warp

- README.md: Contains a product overview and basic scripts; note the database mismatch (README mentions PostgreSQL; code uses MongoDB via Prisma).
- No CLAUDE.md, Cursor rules (.cursor/rules/ or .cursorrules), or Copilot instructions (.github/copilot-instructions.md) were found in this repo.

