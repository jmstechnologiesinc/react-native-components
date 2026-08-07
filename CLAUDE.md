# Project Coding Standards (reusable)

> Drop this file in **unchanged** across projects. Save as `CLAUDE.md` (Claude Code),
> `AGENTS.md` (Codex), `GEMINI.md` (Gemini CLI), or `.cursorrules` (Cursor).
>
> This file never contains project-specific details. Each repository may add a small
> companion file (e.g. `PROJECT.md`) with its architecture and conventions — see §10.

## 0. Governing principle

You do **not** impose a coding style. You **discover** how this project already works and
match it. When a rule here conflicts with what the codebase clearly does, the codebase
wins (except on correctness and safety). When two rules here conflict, apply §1.
When unsure, **stop and ask** (§9) instead of guessing.

## 1. Priority order (use this to resolve conflicts)

1. **Correctness & safety** — code that works and doesn't break existing behavior.
2. **Consistency** with the existing codebase.
3. **Readability & maintainability.**
4. **Performance.**
5. **Brevity.**

Never sacrifice a higher item for a lower one. Optimize performance only when it does not
wreck readability — unless a *measured* bottleneck justifies it.

## 2. Before you change anything

- Read the files you're about to touch **and their immediate neighbors** (same module/
  folder). Do not attempt to read the whole repo.
- Find the **nearest existing example** of what you're building (a similar component,
  service, or endpoint) and mirror its structure, naming, and error handling.
- Identify utilities, hooks, services, and abstractions that **already exist** and reuse
  them. Do not add a dependency or write a helper if an equivalent is already present.
- If the existing pattern is unclear or the codebase is inconsistent, **ask which
  convention to follow** — do not invent a third one.

## 3. Consistency & scope

- Match the surrounding code's style, naming, and file layout. Do **not** introduce a new
  pattern, library, or abstraction unless explicitly requested.
- Keep changes **minimal and scoped to the task**. Do not refactor, reformat, or "clean
  up" unrelated code in the same change.
- Preserve public APIs, types, and behavior unless the task is specifically to change them.

## 4. Code quality (actionable)

- One responsibility per function / class / module.
- Prefer composition over inheritance.
- No duplicated logic — reuse or extract.
- Type everything the language allows. No `any` / untyped escapes without a written reason.
- Handle errors the way the surrounding module already does (same error types, same logging).
- Remove dead code and unused imports **that you introduce**; don't touch unrelated ones.
- Meaningful names; don't introduce abbreviations the project doesn't already use.
- Apply SOLID and immutable patterns where they fit — as tools, not dogma.

## 5. Comments

- **English only.**
- Explain the **why**, never the **what**. No comment that merely restates the code.
- Include a one-line file header only when it clarifies a non-obvious responsibility.

```ts
/**
 * Manages authentication state and token refresh.
 * Prevents duplicated refresh requests across the application.
 */
```

Avoid:

```ts
// Create variable
const user = ...
```

## 6. UI (only when the project has a UI)

- **Adopt the project's existing design system** — Material, Fluent, Human Interface,
  Tailwind/shadcn, or custom tokens. Follow whatever is already in use; do not switch.
- Use existing components and **theme tokens**. Never hardcode spacing, color, typography,
  or elevation values — reference the tokens the project defines.
- If the project has no design system, follow the platform's native conventions.
- Always apply, regardless of system: **accessibility** (labels, roles, focus, contrast)
  and **responsive** layouts (no fixed-pixel designs that break on small screens).

## 7. Performance (measure before optimizing)

- Avoid unnecessary re-renders / recomputation. Memoize only where it measurably matters.
- Lazy-load heavy or rarely-used modules.
- Clean up subscriptions, listeners, and timers to prevent leaks.
- Do not micro-optimize non-hot-path code at the cost of clarity.

## 8. Verify before finishing (discover the commands)

Find this project's quality commands — check `package.json` scripts, `Makefile`,
`pubspec.yaml`, `build.gradle`, or the CI config — then run them:

- Lint / format check
- Type check
- Tests
- Build

The task is **not done** until they pass. If no such commands exist, say so and describe
what you verified manually instead. Never claim a change works without checking.

## 9. When to STOP and ask

Do not guess — ask first — when:

- The task is ambiguous or under-specified.
- Two existing patterns conflict and there is no clear winner.
- The change would touch many files, alter a public API, add a dependency, or change
  architecture.
- You would have to invent business logic that isn't specified anywhere.

## 10. Project-specific context

Before starting, look for a repo-specific companion file (e.g. `PROJECT.md`,
`docs/ARCHITECTURE.md`, or a `## Project` section below). If it exists, treat it as
authoritative for architecture, folder structure, and naming.

If it does **not** exist, infer those conventions from the codebase (§2) and, for anything
you cannot infer with confidence, ask rather than assume.
