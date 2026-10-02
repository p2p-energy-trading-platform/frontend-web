# Phase 4 component choices

Checked against the shadcn registry for this project (`style: base-nova`, `base: base`) on 1 Oct 2026, using `shadcn@latest` (`npx shadcn@latest docs` and `shadcn add`).

The rollout named `sonner` and `form`. Those names do not match what the current Base UI preset should install.

## Installed

| Rollout name | What was added | Why |
| -------------------------------------------------------------------------------------------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sonner` | `toast` | This project uses Base UI. Current shadcn guidance is: use `toast` from `#/components/ui/toast` on Base UI, and `sonner` only on Radix or React Aria. `sonner` still exists in the registry, but its component depends on `next-themes`, which this TanStack Start app does not use. History now calls `toast.add({ type, title })`. `<Toaster />` is mounted once in `src/routes/__root.tsx`. |
| `form` | `field` | `shadcn docs form` has no documentation. `shadcn view @shadcn/form` returns an empty registry item. The current form layout primitive is `field` (`Field`, `FieldLabel`, `FieldError`, `FieldGroup`). Create-account uses it. `@tanstack/react-form` is still unused. |
| `tabs` | `tabs` (replaced) | The previous file imported `cn` from the `cn` package and was unused. The CLI overwrite is the current Base UI tabs component. |
| `dialog`, `table`, `dropdown-menu`, `tooltip`, `avatar`, `alert`, `separator`, `skeleton`, `sheet` | same names | Added with the CLI. Do not hand-edit these files to restyle them. |
| email OTP | `input-otp` | The rollout calls for the email OTP inputs to use a primitive. `input-otp` is the current shadcn component for that. |
| category and view filters | `toggle-group` (and `toggle`) | Current guidance is: a set of 2–7 options uses `ToggleGroup`, not a row of buttons. Energy asset categories and the grid/list switch use it. Page-level strips (energy, payment methods, order side, order type) use `tabs`. |

`TooltipProvider` wraps the document in `src/routes/__root.tsx`. The CLI prints that reminder when `tooltip` is added.

## Left for later

`scroll-area`, `popover`, and `breadcrumb` are still the components to add if a later screen needs them. `dropdown-menu` is installed and not yet used; the header user control is still a profile link.

## CLI note

The project's pinned `shadcn` (4.12) refused `toast` and said to use `sonner`. `shadcn@latest` (4.21) installed `toast` successfully. Use `npx shadcn@latest add` for further components so the registry matches this preset.
