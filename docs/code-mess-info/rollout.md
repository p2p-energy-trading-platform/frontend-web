# Frontend cleanup rollout

Follow these phases in order. Each phase is a reviewable slice. Do not start a later phase while an earlier one is still open, and do not mix phase work into one pull request.

Findings and file citations live in [README.md](./README.md). This document is the sequence for fixing them.

## Status

- **Phase 0 is in effect.** New UI uses tokens from [`src/styles/token.css`](../../src/styles/token.css) and primitives from [`src/components/ui`](../../src/components/ui). Do not add hex utilities, raw palette classes (`emerald-*`, `amber-*`, `red-*`), `gx-*` classes, arbitrary `text-[Npx]`, fake `setTimeout` / `localStorage` / `alert` success flows, or hand-rolled dialogs, tables, selects, and tab strips.
- **Phase 1 is complete.** Alias colors in [`src/styles.css`](../../src/styles.css) point at real tokens. Feedback and trade tokens are available as utilities. History, wallet, auth, avatars, and charts no longer use `gx-*` or hardcoded hex.

## Rules for every phase

- One phase, one pull request (or a short stack of PRs that stay inside that phase).
- Leave the visual design alone. Restyle only where a class is broken (`gx-*`, undefined `brand-*` / `bg-*`) or where a hand-rolled widget is replaced by the matching shadcn primitive.
- Keep demo data working until Phase 5. Screens must still render. This rollout removes the mess around the demo; it does not invent the backend.
- After each phase: `npm run typecheck`, `npm run lint`, `npm run check`, and a click-through of every route that phase touched (desktop and a narrow viewport).
- Rename typo files only in the phase that already edits that screen. Route renames happen in Phase 2, together with the shell.

## Phase 0 — Guardrails

**Depends on:** nothing.

**Goal:** Stop the mess from growing while the later phases run.

**Do this:**

- Treat [README.md](./README.md) as the defect list. New UI uses tokens from [`src/styles/token.css`](../../src/styles/token.css) and primitives from [`src/components/ui`](../../src/components/ui).
- No new hex classes (`bg-[#…]`), no new raw palette classes (`emerald-*`, `amber-*`, `red-*`), no new `gx-*` classes, no new `text-[Npx]`.
- No new `setTimeout` / `localStorage` / `alert` flows presented as real success.
- No new hand-rolled dialog, table, select, or tab strip. If the primitive is missing, it waits for Phase 4.

**Done when:** the team is using this file as the sequence. No application code is required in this phase.

## Phase 1 — Token hygiene

**Depends on:** Phase 0.

**Goal:** One color system. Every color class on a screen resolves to a variable in [`src/styles/token.css`](../../src/styles/token.css).

**In this phase:**

- In [`src/styles.css`](../../src/styles.css), wire or delete the `@theme` aliases that point at undefined variables: `--brand-*`, `--bg-canvas`, `--bg-surface`, `--bg-elevated`, `--bg-overlay`, `--bg-sunken`, `--border-brand`, `--text-brand`, `--text-on-brand`. Prefer mapping them onto tokens that already exist (`--background-*`, `--text-*`, `--action-*`) so call sites keep working.
- Expose feedback and trade tokens that components should use (`--feedback-success-*`, `--feedback-warning-*`, `--trade-buy-*`, `--trade-sell-*`) if they are missing from `@theme`.
- Replace `gx-*` classes and `var(--gx-*)` in:
  - [`src/components/history/OrderHistory.tsx`](../../src/components/history/OrderHistory.tsx)
  - [`src/components/history/TradeHistory.tsx`](../../src/components/history/TradeHistory.tsx)
  - [`src/components/wallet/BankAccountList.tsx`](../../src/components/wallet/BankAccountList.tsx)
  Status pills use feedback and trade tokens. Surfaces use `bg-card`, `border-border`, and the existing shadow scale. Delete the custom `gx-shimmer` skeleton inline styles; a plain token-colored block is enough until Phase 4 adds `skeleton`.
- Replace hardcoded hex in:
  - [`src/components/auth/Signup.tsx`](../../src/components/auth/Signup.tsx)
  - [`src/components/auth/SignInForm.tsx`](../../src/components/auth/SignInForm.tsx)
  - [`src/components/page-components/Header.tsx`](../../src/components/page-components/Header.tsx) (avatar)
  - [`src/components/profile/Profile.tsx`](../../src/components/profile/Profile.tsx) (avatar and `emerald-*`)
  - [`src/routes/__root.tsx`](../../src/routes/__root.tsx) (selection color)
  - [`src/components/landing/HeroSection.tsx`](../../src/components/landing/HeroSection.tsx) (`text-emerald-500`)
- Point chart colors in [`src/components/trade/MarketChart.tsx`](../../src/components/trade/MarketChart.tsx) and the energy/dashboard chart fallbacks at CSS variables (`--action-accent`, `--destructive`, `--chart-*`).
- Delete the unused red-border stub [`src/components/landing/FeaturesSection.tsx`](../../src/components/landing/FeaturesSection.tsx) if it is still unimported.

**Leave for later:** app shell, `ssr` flags, new shadcn files, splitting god components, font-size cleanup beyond colors.

**Done when:**

- A search of `src/` finds no `gx-`, no `bg-[#`, no `text-[#`, and no `emerald-` / `amber-` / `border-red-` utility classes.
- Computed styles for history tables, profile warnings, and auth side panels still show the intended navy, teal, and feedback colors in light and dark mode.

## Phase 2 — One app shell

**Depends on:** Phase 1.

**Goal:** Authenticated pages share one layout. Public pages share the marketing header and footer. Every sidebar link goes to a route that exists.

**In this phase:**

- Add an authenticated layout route that renders [`src/components/page-components/Sidebar.tsx`](../../src/components/page-components/Sidebar.tsx) and [`src/components/page-components/Header.tsx`](../../src/components/page-components/Header.tsx) once.
- Move dashboard, energy assets, trade, wallet, profile, notifications, order history, and trade history under that layout. Delete the per-page `Sidebar` / `PageHeader` mounts.
- Remove the `usesAppShell` pathname allowlist from [`src/routes/__root.tsx`](../../src/routes/__root.tsx). The public shell (`Header` + `Footer`) wraps public routes only: `/`, `/about`, `/sign-in`, `/sign-up`.
- Sign-in and sign-up stay full-screen and do not sit under a second marketing header.
- Fix [`Sidebar.tsx`](../../src/components/page-components/Sidebar.tsx):
  - `/trade` and `/wallet` use `Link`, same as dashboard.
  - Remove `/forecast` until that page exists.
  - Point History at the real history routes. Prefer one `/history` layout with order and trade as child routes, and redirect `/orderhistory` and `/tradehistory`.
- Rename routes while moving them, with redirects from the old paths:
  - `/energyassets` → `/energy-assets`
  - `/notification` → `/notifications`
- Rename typo files in the same PR if those screens move: `CurentSlotCard`, `GenerstionChart`, `Notificationfeed` / `Notificationfilterbar` / `Notificationitem`, and the `Benifits` export on [`src/components/landing/BenefitsHeader.tsx`](../../src/components/landing/BenefitsHeader.tsx).

**Leave for later:** swapping widgets for shadcn, extracting sample data, mobile sheet (Phase 4 supplies `sheet`; this phase only stops the double chrome).

**Done when:**

- `/orderhistory` and `/tradehistory` (or their redirects) show a single app chrome.
- `/`, `/about` show marketing header and footer only.
- Clicking every sidebar item lands on a real page without a full browser reload.
- `/forecast` is gone from the nav.

## Phase 3 — SSR policy

**Depends on:** Phase 2. Do this after the layout move so each route is opted out once, on its final path.

**Goal:** Server-render public pages only.

| Keep `ssr` on | Set `ssr: false` |
| --- | --- |
| `/` | `/dashboard` |
| `/about` | `/energy-assets` |
| `/sign-in` | `/trade` |
| `/sign-up` | `/wallet` |
| Future marketing pages | `/profile` |
|  | `/notifications` |
|  | History routes |

**In this phase:**

- Set `ssr: false` on the authenticated route (the layout route is enough if every authenticated page is a child of it).
- Confirm [`src/routeTree.gen.ts`](../../src/routeTree.gen.ts) shows `ssr: true` only for the public routes.

**Leave for later:** loaders and React Query. Those arrive with the backend, behind the Phase 5 boundary.

**Done when:** a production build serves HTML for `/` and `/about`, and the authenticated routes are client-rendered.

## Phase 4 — shadcn primitives

**Depends on:** Phase 3. Add components before rewriting call sites, in this order.

**Goal:** Screens use [`src/components/ui`](../../src/components/ui). Feature code stops rebuilding primitives.

**Add with the shadcn CLI** (`components.json` is already `base-nova`). Do not hand-write these files.

1. `sonner` — mount `<Toaster />` in the root document. History already calls `toast`.
2. `dialog` — replace the history overlays.
3. `table` — replace the raw `<table>` in both history components.
4. `tabs` — replace [`src/components/ui/tabs.tsx`](../../src/components/ui/tabs.tsx) (it imports `cn` from the package `"cn"` and nothing uses it), then switch energy assets, payment methods, the order panel, and the trading terminal onto it.
5. `dropdown-menu`, `tooltip`, `avatar`, `alert`, `separator`, `skeleton`, `sheet`.
6. `form` only where a screen is already being edited (create-account first). `@tanstack/react-form` stays unused until that screen moves onto it.
7. Later, if a screen needs them: `scroll-area`, `popover`, `breadcrumb`.

**Replace call sites in this order:**

1. History dialogs, tables, filters (`select`, `input`, `button`), and the skeleton placeholder.
2. Trade order panel and order book controls. Change [`src/components/energy-assets/AssetCard.tsx`](../../src/components/energy-assets/AssetCard.tsx) to import `Button` from `#/components/ui/button`.
3. Wallet payment methods, transaction filter, card and bank icon buttons (tooltip + accessible name).
4. KYC country `select` and the email OTP inputs.
5. Energy asset filter bar and tab strip.
6. App header avatar and profile avatar.
7. Sidebar collapse and mobile nav via `sheet`.

**Leave for later:** moving sample arrays out of these files (Phase 5). A file may be edited twice: once to swap the widget, once to extract data.

**Done when:**

- `src/components` outside `ui/` has no `<table`, no fixed full-screen overlay used as a dialog, and no import from `@base-ui/react/button`.
- `<Toaster />` is mounted once.
- Icon-only buttons have an accessible name.
- The sidebar collapses to a sheet below the `md` breakpoint.
- Wallet transactions and payment methods stack on a narrow viewport.

## Phase 5 — Data boundary

**Depends on:** Phase 4.

**Goal:** UI components receive data through hooks. Sample data lives in one module per feature. That module is the seam the backend replaces with React Query.

**In this phase, per feature** (dashboard, energy assets, trade, wallet, notifications, history, profile, auth):

- Move hardcoded arrays and the "Sara A. / Villa 47 / JLT Zone 4" persona into `src/data/<feature>.ts` (the folder exists and is empty).
- Add `src/hooks/use<Feature>.ts` that returns that data. Components call the hook. They do not import the sample module.
- Split the god files along that line:
  - [`src/components/profile/Profile.tsx`](../../src/components/profile/Profile.tsx)
  - [`src/components/history/OrderHistory.tsx`](../../src/components/history/OrderHistory.tsx)
  - [`src/components/history/TradeHistory.tsx`](../../src/components/history/TradeHistory.tsx)
  - [`src/routes/energyassets.tsx`](../../src/routes/energyassets.tsx) (path may already be `/energy-assets` from Phase 2)
- Pick **AED** as the display currency everywhere, including [`src/components/trade/OrderPanel.tsx`](../../src/components/trade/OrderPanel.tsx), [`src/components/trade/MarketSummary.tsx`](../../src/components/trade/MarketSummary.tsx), and [`src/lib/market-data.ts`](../../src/lib/market-data.ts). One market locale goes with it.
- Label remaining simulated behavior in the hook (`source: 'demo'`), including the market ticker. Remove `alert` on sign-in, the `GridX123!` password, and the "Temporary demo" / "About this demo" copy from [`src/components/Footer.tsx`](../../src/components/Footer.tsx) and [`src/routes/about.tsx`](../../src/routes/about.tsx).
- Remove unused dependencies once nothing imports them: `@faker-js/faker`, `zustand` (unless a hook genuinely needs it), `@tanstack/match-sorter-utils`. Keep `@tanstack/react-query`. Keep `@tanstack/react-form` and `@tanstack/react-table` only if Phase 4 or this phase started using them; otherwise remove them too.
- Pin `@tanstack/*` versions that are currently `"latest"`.

**Leave for later:** real API clients, auth tokens, and loaders. When the backend is ready, replace the body of each hook with `useQuery` / `useMutation`. Do not add `fetch` inside components.

**Done when:**

- Routes and presentational components contain no sample arrays and no `setTimeout` used as a fake network.
- `rg "Sara A.|GridX123|HistoryDemoState|AED |RM " src` shows the persona and currency in the data modules only, and no `RM `.
- `npm run typecheck` passes after the god-file splits.

## Phase 6 — Typography

**Depends on:** Phase 5. Do this last so each screen is touched once more, after structure has settled.

**Goal:** One type scale, Inter only.

**In this phase:**

- Replace arbitrary `text-[10px]`, `text-[11px]`, `text-[26px]`, and similar with the utilities in [`src/styles.css`](../../src/styles.css): `text-display-*`, `text-heading-*`, `text-label-*`, `text-caption`, `text-code`.
- Auth titles, profile titles, wallet section titles, and history pills all use that scale.
- Keep the Inter imports in [`src/routes/__root.tsx`](../../src/routes/__root.tsx).
- Remove `@fontsource-variable/geist` from `package.json`.
- Point `MarketChart` font family at the theme sans stack.

**Done when:** a search of `src/` finds no `text-[` font-size utilities and no `geist` import. Headings on auth, dashboard, and profile use the same scale.

## After Phase 6

The frontend is ready for a backend integration pass. That pass is not part of this rollout. It replaces Phase 5 hooks with React Query calls, adds route loaders only on the public pages that need them, and deletes the demo data modules.
