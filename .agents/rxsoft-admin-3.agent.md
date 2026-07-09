# RxSoft Admin Agent

## Overview

React 19 + Mantine 9 + Vite 8 + TanStack Router admin frontend. Port 5173. ESM. Yarn 4.14.1. Node 24.15.0.

## Key commands

- `yarn dev` — Vite dev server
- `yarn build` — `tsc && vite build`
- `yarn typecheck` — `tsc --noEmit`
- `yarn lint` — oxlint + stylelint
- `yarn format:write` — oxfmt
- `yarn vitest` — vitest run
- `yarn test` — full pipeline: typecheck + format + lint + vitest + build

## Tech stack

React 19, Mantine 9, TanStack Router (file-based, auto-code-splitting), TanStack Query 5, Zustand 5, Axios, React Hook Form + Zod, Recharts, Socket.IO client, Sentry, Vitest + Testing Library, oxlint + oxfmt + stylelint.

## Module architecture

Multi-module app with 6 API clients, each mapping to a backend module:
- `rxsoft` (port 8080) — pharmacy management
- `lis` (port 8002) — LIS
- `conversation` (port 8001) — conversation engine
- `communication` (port 8003) — interoperability switch
- `coding-concept` (port 8004) — coding concepts
- `admin` — admin console

## Auth

Login via `identityApi.post('/auth/login')` → JWT access + refresh tokens stored in `localStorage`. Zustand auth store persisted. Auto-refresh via Axios interceptors. 30-min inactivity auto-logout. Route guards via TanStack Router `beforeLoad`.

## Refactoring deviations (fix when touching)

### Tests (1 file — infrastructure exists but barely used)
- Vitest 4 + Testing Library configured in `vite.config.mjs`
- Custom render wrapper in `test-utils/` with `MantineProvider`
- Only 1 test: `src/components/Welcome/Welcome.test.tsx`
- **Needs**: tests for pages, forms, API clients, auth flows
- Storybook configured but no `.stories` files exist

### Dynamic CRUD system
- `ModelConfig` type + `DataPageShell` + `DataPageForm` in `src/features/components/`
- Preferred approach for simple CRUD — reduces duplication, ensures consistent UX
- Custom pages only for non-CRUD (dashboards, reports, chat)

### API clients
- 6 API clients in `src/lib/`: `identity-api`, `rxsoft-api`, `lis-api`, `conversation-api`, `communication-api`, `coding-concept-api`
- All point to localhost in dev — use the correct one per module
- Import from `src/lib/{module}-api.ts`

### Modules architecture
- 6 modules defined in `src/features/shared/module-data.ts`
- Route-to-module mapping in `src/lib/module-routing.ts`
- Sidebar nav in `src/layout/data/sidebar-data.ts` (657 lines — extensive)**
- Routes under `_authenticated/` are guarded; `(errors)/` and `(auth)/` are public
- `damorex/` (e-commerce) is public, bypasses auth layout