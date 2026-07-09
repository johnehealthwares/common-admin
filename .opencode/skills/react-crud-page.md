# React CRUD Page — rxsoft-admin-3

## Purpose

Create a new CRUD page (list table + create/edit form) in the admin frontend.

## When to invoke

When adding a new resource management page.

## When not to invoke

For custom non-CRUD pages (dashboards, reports, chat).

## Inputs

- **Resource name** (e.g., `items`, `customers`, `purchase-orders`)
- **Module** (rxsoft, lis, conversation, communication, coding-concept, admin)
- **Columns** to display in table
- **Fields** for create/edit form
- **API endpoint**
- **API client** (the module's API client from `src/lib/`)

## Workflow

### Option A: Dynamic CRUD via ModelConfig (preferred for simple resources)

1. Add the resource config to the module's `registry/` — define fields, columns, groups, endpoint, and API provider.
2. The `DataPageShell` + `DataPageForm` components auto-generate table and form from the config.

### Option B: Custom page (for complex UIs)

1. Create a route file in `src/routes/_authenticated/{module}/{resource}/` — TanStack Router file-based routing auto-registers it.
2. Create a feature component in `src/features/{module}/{resource}` following:
   - Custom data table (use `src/features/components/table/paginated-data-table.tsx`)
   - TanStack Query hooks for data fetching
   - React Hook Form + Zod validation for forms
   - Zustand store for local state if needed
3. Add sidebar navigation entry in `src/layout/data/sidebar-data.ts`.

2. **Always use the module's dedicated API client** from `src/lib/` (e.g., `rxsoftApi`, `lisApi`).
3. **Always use `ListDto` pattern** from shared types for list endpoints.
4. **Always use `handleServerError`** for error notifications on mutations.
5. **Register route** in the file-based router by creating a file in the appropriate `routes/` directory.

## Refactoring

When adding new CRUD pages, prefer the **ModelConfig** (dynamic) approach from `src/features/components/` over creating bespoke components. This improves consistency and reduces code duplication.