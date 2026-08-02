# PROJECT.md — react-native-components

Companion to `CLAUDE.md` (§10). Authoritative for this repo's architecture, conventions and
commands. `CLAUDE.md` is the generic, project-agnostic rules file and **lives here as its source of
truth** — it is copied unchanged into the other repos. Do not add project-specific content to it;
it goes here.

## What this is — two things in one repo

1. **The published library**: `packages/components/` → **`@jmstechnologiesinc/react-native-components`**
   (currently `0.1.79`, ISC, published to npm from GitHub). This is the real product.
2. **A Storybook harness** at the repo root (`package.json` name `react_native_storybook_starter`,
   `private: true`). A throwaway React Native app whose only job is to render the library's stories,
   on-device and on web. It is **not** shipped and **not** the thing you are editing when asked to
   change a component.

Lerna (`lerna.json`, `packages/*`, `version: "independent"`) manages the package, but there is
effectively one package.

**Almost every change belongs in `packages/components/src/`.** Touch the root only for Storybook,
lint/babel/metro config, or the hosted docs.

## Who consumes this

`CustomerApp` (all four apps: Shopping / Vendor / Driver / RideAndSharing) depends on this package.
`Firebase/functions` and `fleet-management` share the sibling `@jmstechnologiesinc/*` packages.

That makes this a **published, versioned dependency of a production app**: every export in
`packages/components/src/index.js` is public API. Renaming, reshaping props, or removing an export
is a **breaking change** — `CLAUDE.md` §3 ("preserve public APIs") applies literally here. If a
change would break a consumer, stop and ask (§9).

## Layout of the library

```
packages/components/src/
  index.js          THE public API — the single barrel. Nothing is public unless exported here.
  styles.js         shared style objects built from MD3LightTheme tokens
  consts.js         shared constants (LAYOUT_MODE, …)
  utils.js          shared helpers (ImageKit URL builders, action sheets, deep linking, …)
  Config.js
  <ComponentName>/  one folder per component
    <ComponentName>.js         the component
    <ComponentName>.stories.js its Storybook story
    (sub-components, utils.js, index.js for the bigger ones)
  Localization/     localized() / setI18nConfig() + Translations/{en,es}.json
  truly-native/     TN* legacy primitives (TNActivityIndicator, TNEmptyStateView)
```

Bigger features are folders with an `index.js` and internal sub-components + hooks — see `Chat/`
(`Bubble`, `Composer`, `MessageList`, `useChat.js`, `useStreamingMessages.js`, `models.js`) and
`Order/`. Mirror the nearest existing folder of similar size rather than inventing a shape.

### Adding a component (the checklist)

1. `packages/components/src/<Name>/<Name>.js`
2. `packages/components/src/<Name>/<Name>.stories.js`
3. Export it from `packages/components/src/index.js` — otherwise it does not exist for consumers.
4. Add the folder's glob to `.storybook/main.ts` (see "Storybook" below — the web config is a
   hand-maintained list, not a glob over `src/**`).
5. Any user-facing string goes into **both** `Translations/en.json` and `es.json` via `localized()`.

## Style — note the split, and match the file you are in

The repo has **two different styles**, which is exactly the situation `CLAUDE.md` §0/§2 covers:
match the surrounding code, do not unify them as a side effect of another task.

| | Root harness (`App.tsx`, `.storybook/`, `.ondevice/`) | Library (`packages/components/src/`) |
|---|---|---|
| Config | `.eslintrc.js` → `@react-native-community`; `.prettierrc.js` → `singleQuote`, `bracketSpacing: false`, `arrowParens: 'avoid'`, `bracketSameLine` | Follows the JMS house style used across `CustomerApp` / `Firebase` |
| Indent | 2 spaces | **4 spaces** |
| Braces | `{foo}` | `{ foo }` |
| Language | TypeScript (`.tsx`/`.ts`) | **JavaScript (`.js`) — do not add TS to the library** |

Library conventions: **arrow-function components**, named export folder + default export component,
`PascalCase` files, import order React → react-native → `@jmstechnologiesinc/*` → local (blank-line
separated). Comments in **English** (§5).

## Design system — this repo *is* the design system layer

- UI primitives come from **`@jmstechnologiesinc/react-native-paper`** (a Material Design 3 fork),
  never from upstream `react-native-paper` and never raw `react-native` components where a Paper
  one exists.
- **Spacing/color/typography come from `MD3LightTheme` tokens** (`MD3LightTheme.spacing.x2`,
  `MD3LightTheme.colors.surfaceDisabled`, `variant="headlineSmall"`). Hardcoding a pixel or hex
  value here propagates the mistake into every consuming app — `CLAUDE.md` §6 is not negotiable in
  this repo.
- Icons via `MATERIAL_ICONS` from `@jmstechnologiesinc/commons`, not string literals.
- `styles.js` holds the shared style objects; extend it rather than re-declaring the same margins.

## Sibling `@jmstechnologiesinc/*` packages

`commons`, `user`, `vendor`, `driver`, `order`, `cart`, `react-native-paper`,
`material-bottom-tabs`, `bottom-sheet`, `react-native-size-matters`, `react-native-phone-input`,
`react-native-google-places-autocomplete`, `react-native-image-blur-loading`.

Constants and generic helpers (`isNumeric`, `MATERIAL_ICONS`, order statuses, money formatters) live
in `commons` and friends — **check there before writing a helper here**, and never duplicate one.
Money is `dinero.js` (cents/Dinero objects, never floats).

## Localization

`Localization/Localization.js`: `setI18nConfig()` picks the best tag via `react-native-localize`,
`localized(key, config)` is a `lodash.memoize`d `i18n-js` lookup that **falls back to returning the
key when the translation is missing** — so a missing string fails silently and looks like a key on
screen. Always add to `en.json` **and** `es.json`. `localized.cache.clear()` inside `setI18nConfig`
is why a language change actually takes effect; don't remove it.

`Localization.web.js` is the web twin. Several modules have `.web.js` counterparts — if you change a
module that has one, check whether the twin needs the same change.

## Storybook

Two separate configs, both reading stories from `packages/components/src`:

- **`.ondevice/`** (`@storybook/react-native`) — glob `**/*.stories.?(ts|tsx|js|jsx)`, picks up new
  stories automatically. Run `npm run storybook-generate` after adding one.
- **`.storybook/`** (`@storybook/react-webpack5` + `react-native-web`) — an **explicit, hand-written
  list of per-folder globs**. A new story does **not** appear on the web/hosted Storybook until you
  add its line here. This is the step most easily forgotten.

Entry point: `App.tsx` swaps in `./.ondevice` when `STORYBOOK_ENABLED` is set (`react-native-dotenv`).

The web build is the **public documentation site** — `firebase.json` deploys `storybook-static/` to
`react-native-components-e19ee.web.app`, and the README's demo links point at it. A story is the
component's documentation, not an optional extra.

## Build & publish — read this before releasing

`packages/components/package.json`:

```json
"main": "lib/index.js",  "files": ["lib"],
"build": "npm run clean && mkdir lib && cp -r src/* lib"
```

**The build is a plain copy — there is no transpilation.** `lib/` ships raw JSX + ESM, which is why
consumers must have this package inside their Metro/Babel transform path. Consequences:

- `lib/` is generated. **Never edit `lib/` — edit `src/` and rebuild.**
- `lib/` is stale until you run `npm run build` in `packages/components/`; publishing without it
  ships the previous version's code.
- Adding syntax that Metro/Babel in the consumer can't handle breaks consumers at bundle time, not
  here. Test a real change against `CustomerApp` when in doubt.
- `peerDependencies` (`react`, `react-native`, `@jmstechnologiesinc/react-native-paper`,
  `@react-navigation/elements`, `centrifuge`, `react-native-gesture-handler`,
  `react-native-keyboard-controller`, `react-native-reanimated`, `react-native-vector-icons`) are the
  contract with the host app. **A new runtime dependency is an architectural change — ask first (§9)**;
  it must either be a peer the app already has, or be justified as a real dependency.

## Commands (§8)

```bash
# root (harness)
npm run lint               # eslint .                       <- must pass
npm test                   # jest (preset react-native)
npm run prettier           # prettier --write "**/*.{js,jsx,ts,tsx,json,css,md}"

npm run storybook          # metro with STORYBOOK_ENABLED
npm run storybook:ios / storybook:android
npm run storybook-generate # regenerate .ondevice/storybook.requires.ts after adding stories
npm run storybook:web      # storybook dev -p 6006
npm run build-storybook    # -> storybook-static/
firebase deploy --only hosting   # publishes the docs site — confirm before running

# library
cd packages/components && npm run build     # clean + copy src -> lib
```

There is **no type check** for the library (it is JS). "Verified" means: lint passes, `jest` passes,
and the affected story renders in Storybook. For a change consumers depend on, also build and run it
in `CustomerApp`.

## Tests

Jest with the `react-native` preset. Coverage is thin — `packages/components/__tests__/components.test.js`
and `Localization/__tests__/Localization.test.js`, plus the root `__tests__/App.test.tsx`. New tests
go next to the code in a `__tests__/` folder. In practice **the story is the primary verification**
for visual components; write one that exercises the states you changed.

## Gotchas

- `main.js` / entry: root `index.js` registers the app; `App.tsx` decides Storybook vs demo screen.
- Web support is real (`react-native-web`, `mapbox-gl`, `react-map-gl`, `.web.js` twins) and the
  `.storybook` webpack config polyfills `os` via `os-browserify`. Don't assume native-only.
- `truly-native/` is legacy (`TN*` prefix). Don't extend it; new work goes in a normal component folder.
- The root package is `private: true` on purpose — never publish from the root.
- Current branch at time of writing: `feat/menu-schedule-strings`; remote
  `github.com/jmstechnologiesinc/react-native-components`.
