# RxSoft Admin 3

React-based admin dashboard for the RxSoft healthcare platform. Built with Mantine 9, TanStack Router, and Vite.

Part of the [RxSoft monorepo](https://github.com/anomalyco/rxsoft).

## Stack

| Aspect | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| UI | Mantine 9 |
| Routing | TanStack Router (file-based, auto code-splitting) |
| State | Zustand |
| Forms | react-hook-form + zod |
| API | TanStack React Query + Axios |
| Charts | Recharts, ReactFlow |
| Build | Vite 8 |
| Lint/Format | oxlint + oxfmt + stylelint |
| Testing | Vitest + React Testing Library |
| Package Manager | yarn 4.14.1 (node-modules linker) |
| Module | ESM (`"type": "module"`) |

## Quick Start

```bash
yarn install
yarn dev
```

The dev server defaults to **port 5173**.

## Scripts

| Command | Description |
|---|---|
| `yarn dev` | Vite dev server |
| `yarn build` | `tsc && vite build` |
| `yarn typecheck` | `tsc --noEmit` |
| `yarn lint` | oxlint + stylelint |
| `yarn format:test` | oxfmt check |
| `yarn format:write` | oxfmt auto-format |
| `yarn vitest` | Run vitest tests |
| `yarn test` | Full pipeline: typecheck + format + lint + vitest + build |
| `yarn preview` | Preview production build |
| `yarn storybook` | Storybook dev server (port 6006) |
| `yarn storybook:build` | Build storybook |

## Project Structure

```
src/
  assets/          — Static assets, favicons
  components/      — Shared UI components
  config/          — App configuration
  context/         — React context providers
  features/        — Feature modules (admin, apm, auth, chats, coding-concept, communication, conversation, damorex, dashboard, errors, lis, queries, questionnaire, registry, rxsoft, settings, shared)
  layout/          — App layout, sidebar, navigation
  lib/             — Utility library
  modules/         — Chat UI module
  registry/        — Component registry
  routes/          — TanStack Router file-based routes
  stores/          — Zustand stores
  theme.ts         — Mantine theme overrides

Framework features:
- TanStack Router with auto code-splitting
- Route tree auto-generated at `routeTree.gen.ts`
- React Query for server state management
- Code-splitting per route
- State management via Zustand stores
- Sentry error tracking
- Socket.IO client for real-time
```

## Architecture Patterns

- **ModelConfig-based CRUD**: Dynamic data-table system for listing/searching entities. See [data-table skill](https://github.com/anomalyco/rxsoft/blob/main/rxsoft-admin-3/.opencode/skills/data-table.md).
- **Feature modules**: Each domain area (LIS, APM, chat, etc.) is a self-contained feature under `src/features/`.
- **TanStack Router**: File-based routing with `_authenticated` layout wrapper and separate route groups for auth, errors, etc.

## Path Aliases

Uses `@/*` → `./src/*` (configured in Vite and tsconfig).

## See Also

- [`../AGENTS.md`](https://github.com/anomalyco/rxsoft/blob/main/AGENTS.md) — Monorepo overview and conventions
