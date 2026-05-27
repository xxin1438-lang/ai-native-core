# React SPA — Architecture Immutability Rules

Built-in adapter rules. Always included in forbidden-patterns during sync.

---

## State Layering

- DO NOT put server data (lists, details, pagination, cache) into Zustand (use TanStack Query)
- DO NOT put form field values into Zustand (use TanStack Form)
- DO NOT fetch server data outside of TanStack Query's queryFn
- DO NOT use useState for cross-component shared UI state

## Component Boundaries

- DO NOT put business logic (API calls, state management, routing) in components/ui/
- DO NOT import from features/ inside components/ui/
- DO NOT call toast() or Toaster directly from components (use lib/notify.ts)
- DO NOT access Zustand stores directly outside of features/ (use encapsulated hooks)

## Type Safety

- DO NOT use broad type assertions (as WholeObject), minimize to single field
- DO NOT use array index as list key (use stable business identifiers)
- DO NOT return implicit undefined from nullable API functions (use `return result ?? null`)

## CSS / Styling

- DO NOT hardcode hex/rgb/hsl color values (use CSS variables or Tailwind tokens only)
- DO NOT use media queries for dark mode in components (use .dark class override)
- DO NOT double-wrap CSS tokens (hsl(hsl(...)))

## SDD Flow

- Full flow: explore (recommended for complex) → propose → confirm → apply
- DO NOT skip spec stage and write implementation directly
- DO NOT omit ASCII wireframe from design.md
- For complex features (new modules, architecture changes), DO NOT skip explore

## Stack Consistency

- DO NOT introduce Radix UI as alternative in shadcn/ui Base UI projects
- DO NOT import from @base-ui/react/* in features/ layer
- DO NOT manually edit auto-generated route files

## File Structure

- DO NOT create shadcn-style component files outside src/components/ui/
- DO NOT directly import internal components across features/ modules
