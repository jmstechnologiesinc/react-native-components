# PROJECT.md — react-native-components

Companion to `CLAUDE.md` (§10). Authoritative for this repo's architecture, conventions and
commands. `CLAUDE.md` is the generic, project-agnostic rules file and **lives here as its source of
truth** — it is copied unchanged into the other repos. Do not add project-specific content to it;
it goes here.

## Where to work

`feature/temporal-migration`, in this repository's main checkout (`~/daxir/react-native-components`), is the one
source of truth (owner, 2026-10-07). Branch from it and merge back into it; keep no long-lived
worktree.
The authority is fleet-management `docs/canonical-trunk.md`.

## What this is — two things in one repo

1. **The published library**: `packages/components/` → **`@jmstechnologiesinc/react-native-components`**
   (`0.4.0` in the source, **0.4.0-dev: not published yet**; `0.3.1` is the last published version; ISC,
   published to the GitHub registry). This is the real product.
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
  portable.js       the web-safe subset of the barrel (C-35), for web hosts — see "Portable entry"
  styles.js         shared style objects built from MD3LightTheme tokens
  tones.js          status tones (success/warning/danger/neutral/info) -> theme roles + icons
  consts.js         shared constants (LAYOUT_MODE, …)
  utils.js          shared helpers (ImageKit URL builders, action sheets, deep linking, …)
  Config.js         env values (react-native-config / dotenv); Config.web.js is the runtime-configured twin
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
3. Export it from `packages/components/src/index.js` — otherwise it does not exist for consumers. If it
   loads on the web without native modules, export it from `portable.js` too (the guard test will tell you
   if it does not).
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

`commons`, `user`, `vendor`, `driver`, `order` (**≥ 0.1.3**: the canonical vocabulary and
`canonicalOf` live there), `order-narration`, `cart`, `react-native-paper`,
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

Since **0.2.0** (ADR-0017 §5.4, §6):

- **Both locales are always installed**, with `fallbacks: true` and `defaultLocale: 'en'`. A key
  present in `en` and missing from `es` renders the English string, not the raw key.
- **A missing key is detected through the API** (`defaultValue` + a sentinel), not by searching the
  rendered text for the substring `missing`. A legitimate translation containing that word used to
  be reported absent.
- **The memo key leads with `i18n.locale`**, so the first render after a language change is correct
  even without clearing the cache.
- **`Localization/catalog.js`** is the seam with `@jmstechnologiesinc/order-narration`. That
  catalogue is **flat, with dotted keys, by design** — the same file is read by the server's `i18n`
  — and it is looked up by **exact match**, never merged into the nested tree: a headline key is a
  prefix of its own `.detail`, so as a tree one of the two silently destroys the other. It reaches
  the i18n library as `defaultValue`, which both libraries interpolate exactly like a translation.
- **`Localization/format.js`** is `Intl` (`formatDateTime`, `formatTime`, `formatRelativeTime`) in
  the **app's** locale. Never `toLocaleString()`: that is the device's locale, which is a different
  thing and visibly wrong when the two differ.

Since **0.4.0** (C-25):

- **`registerFlatCatalog({ en: {key: text}, es: {…} })`** registers a host's flat catalogue — the
  `partner.*` catalogue, which belongs to `@jmstechnologiesinc/partner` (canon R2) and must **never** be
  added to `Translations/*.json`. It is served through the same exact-match seam as the narration
  (`catalog.js`), so dotted values (`partner.disabled_reason.rejected.fraud`) work and a registration
  survives `setI18nConfig`, which replaces `i18n.translations` wholesale. On the web it is also added to
  i18next as a resource bundle, so `react-i18next` readers see it. `%{}` interpolates as everywhere.
- **`currentLocale()`** is exported by both twins; `format.js` reads it. It used to read `i18n-js`
  directly, so on the web every date was formatted in `en`.
- `merge` (deep merge of nested catalogues) is exported from the barrel and the portable entry.

`Localization.web.js` is the web twin, and as of 0.2.0 it really is one: same loader, same `%{}`
placeholder syntax (i18next's default `{{}}` would have shown narration placeholders raw), same
answer for an absent key, same `en` fallback. Several modules have `.web.js` counterparts — if you
change a module that has one, check whether the twin needs the same change.

## Order narration (0.2.0)

`Order/` no longer reads order statuses. `@jmstechnologiesinc/order-narration` owns the vocabulary
and answers in **keys and parameters**; `Order/viewModel.js` is the one place those become text, and
the components take the result and paint it.

- `orderViewModel({ order, actor })` → `{ headline, detail, statusLabel, chips, actions, eta,
  progress, severity, narrated }`. `actions` carry `tone` and `icon`, so no component parses a
  button's value to decide how it looks.
- **When the narration has nothing to say it returns `narrated: false` and no sentence, and that is
  deliberate.** 32 of the 165 cells are still written as pending in `order-narration`'s matrix, but
  **24 of those 32 were written on 2026-09-14 (checkpoint M93, `order-narration` unpublished)**
  after the assignment axis declared C5 at M92: `awaiting_driver`, `driver_assigned` and
  `driver_enroute`, 21 final cells and 3 N/A by judgement (the driver at `awaiting_driver`, who by
  construction holds no order there). The matrix now pins 83 final / 8 pending / 74 N/A. The 8 that
  remain pending are `in_transit`'s, and they wait on decision D-9, not on work (plan §20.8). This
  package sees none of it until `order-narration` is published. **Do not add a
  fallback to `whatIsTheOrderStatus`** — that keeps the legacy vocabulary alive forever, which is
  what C6 exists to end. The honest degradation is `statusLabel`, complete for all eleven canonical
  members.
- `whatIsTheOrderStatus` is **`@deprecated` and lives exactly one release** (D-51). Nothing new may
  call it. **`CustomerApp` stopped calling it at M94 (2026-09-14, `f2c68862`, N2c)**: all eight order
  screens go through `orderViewModel` and the buttons carry intents; the app links this package by
  `file:` until 0.2.0 is published, then `^0.2.0`. `Order/__tests__/d50.test.js` keeps every legacy reference contained inside it and fails
  if one appears anywhere else — or if that file stops being the legacy table.

## Portable entry (C-35) and partner components (K-22) — 0.4.0-dev

`src/portable.js` (published as `lib/portable`) is what a **web host** imports: the partner console
(`CustomerApp/admin-web`) and the presentational views it borrows from the app. It re-exports only
modules that load on react-native-web **without stubs**: List, ScreenWrapper, ChipList, Tabs,
SegmentedButtonGroup, ActionGroup, SideNav, TouchableRippleWrapper, TN*, `ButtonWrapper`,
`PhotoGalleryDisplay`, `styles`, `LAYOUT_MODE`, a `Form` subset (PersonInfo, VehicleInfo,
BusinessInfo, DriverInfo, EmailPassword, SecretInputText), `StripeForm.AccountBank`, Localization (`localized`,
`setI18nConfig`, `registerFlatCatalog`, `currentLocale`, `merge`), the formatters, the Order and Partner view
models, the K-22 components and the generic web-host UI (next section). `ImagePicker` is **not** portable (picker, permissions, draggable list): a web host shows
photos with `PhotoGalleryDisplay` and the app injects the picker.

- `packages/components/__tests__/portableEntry.test.js` walks its static import graph the way a web
  bundler does (`.web.js` first) and fails if a native-only module becomes reachable (react-native-config,
  dotenv, localize, image picker, action sheet, permissions, geolocation, gesture handler, reanimated,
  draggable list, mapbox, bottom sheets, centrifuge) — or the package's own name, which drags the barrel in.
- **`Config.web.js`**: on the web the host calls `configureComponents({ IMAGEKIT_URL, … })` once before
  rendering. Native `Config.js` exports the same function (merge, no behaviour change).
- **Never import this package by its published name from inside it**, and import `../ScreenWrapper`
  (the index that attaches `.Section`/`.Container`), not `../ScreenWrapper/ScreenWrapper`.
- `OptionPicker/OptionSheet.js` is the native action sheet; `OptionSheet.web.js` is a Paper modal with the
  same `show()`/`hide()` ref, which is what lets `Form.BusinessInfo` load on the web.
- `lib/*` deep imports keep working; there is deliberately no `exports` map yet.

K-22 components (APIs frozen in `CustomerApp/admin-web/docs/ARCHITECTURE.md` §5), RN primitives + Paper,
themed through `useTheme()` so a host's theme applies:

- `Partner/StatusChip` (+ `SlaChip`) — label and tone from `Partner/viewModel`.
- `DocumentViewer` — default image renderer (RN `Image`); the host injects `renderDocument` /
  `renderZoom` (on the web: `react-pdf`, `react-zoom-pan-pinch`, which live **only** in admin-web).
  `onError({source, error})` reports an image the default renderer could not load (a lapsed signed URL).
- `DecisionDialog` — Paper `Dialog` in a `Portal` (the host needs Paper's `Provider`).
- `Timeline` — `history` and `steps`.
- `Partner/viewModel.js` (barrel/portable: `PartnerViewModel`, because `statusLabel` is the Order one):
  the key is the package's `statusLabelKey(group, value)` resolved with `localized`; a value outside the
  vocabulary, or a key the registered catalogue lacks, renders the raw value. Each kind's group is read
  from the package's `LABEL_GROUPS` (never spelled here). `TONE_BY_KIND` and `INTENT_PRESENTATION` stay
  here (presentation with one consumer: request #6 was declined) but are keyed by the package constants
  (`[REQUIREMENT_BUCKET.PAST_DUE]: danger`). `requirement_cause` is a label-only kind (`LABEL_ONLY_KINDS`).
- Canon R1 is two tests. `Partner/__tests__/viewModelCompleteness.test.js` walks every value of each
  coloured group and every `STAFF_INTENT` from the package and fails on one without a tone or a
  presentation. `packages/components/__tests__/noLocalRedefinition.test.js` collects the package's
  vocabulary and fails on a literal or plain object key equal to a value, or a `partner.*` literal, in
  `src/Partner/**`, `DecisionDialog`, `DocumentViewer`, `Timeline` and `tones.js` (tests and stories
  excluded). It does not scan the rest of `src/`: `active`, `pending`, `car`, `web` are also Order and
  platform words there. A new partner component joins its `SCOPE`.
- Stories register the package catalogue (`registerFlatCatalog({ en: EN, es: ES })`), as a host does.

Forms (C-25): `Form.PersonInfo`, `Form.VehicleInfo` and `Form.BusinessInfo` take `readOnly` (alias of
`isDisabled`, but it also locks PersonInfo's email, which `isDisabled` never did) and
`highlightFields: string[]` (the names the form reports to `inputActionHandler`), which outlines the field
in `primary` and adds a «Changed» helper line (the line is what survives on a disabled input).
They also take `errors: Array<{ field, code, message? }>` — server field errors (K-32), keyed by the same
names. Each error of a rendered field puts its input in Paper's `error` state and adds one
`HelperText type="error"` under it (`testID="error.<field>"`) showing `message`, or the raw `code` when the
host resolved none; BusinessInfo's `industries` gets its line under the picker. Errors of fields the form
does not render are ignored, and the forms' own required messages are unchanged. All of it lives in
`Form/FormField.js` (`errorsOf`, `FieldErrorText`, the `field`/`errors` props of `FormField`).

`Form.VehicleInfo` with the catalogue (C-22, additive, still 0.4.0): given `catalog: { vehicleTypes, colors,
makes, models }` (each `Array<{ value, label }>`, labelled by the host) plus `vehicleType`, `makeId`,
`modelId`, `licensePlateRegion` and `vin`, it renders the market schema in canon §9.15's order (type → year →
make → model, color, plate, plate region, optional VIN) with `Form/FormSelectField.js` (an outlined input that
opens a Paper `Menu`, portable). A make or model pick reports its id and its name (`makeId` + `make`); with no
`makes`/`models` (no catalogue slice for that type and year) they stay typed text. Without `catalog` the form is
the tree it always was, pinned by `legacyRendering.test.js` (`Form.VehicleInfo (vehicle form)`, captured from
`admin-app` @ 516446e).

`PhotoGalleryDisplay({ photoUrls, title?, emptyLabel?, highlighted?, size?, testID? })`
(`ImagePicker/PhotoGalleryDisplay.js`, barrel and portable): **resolved** URIs, never rewritten; a horizontal
strip of RN `Image`s, each labelled «Photo i of n» (`global.photoOf`); `global.noPhotos` when empty or all
blank; `title` defaults to `photos` (`null` hides it); `highlighted` adds the «Changed» line. testIDs:
`<testID>` (the strip), `<testID>.photo.<i>`, `<testID>.empty`; `testID` defaults to `photo-gallery`.

Accessibility and MD3 fidelity for the console shell (OPEN-ITEMS #12-#14 of `admin-web/docs/OPEN-ITEMS.md`),
additive — the app's rendering is pinned by `packages/components/__tests__/legacyRendering.test.js`, which
re-renders the existing consumers' props (CustomerApp's `drawerSideNav` and `InventoryManagerScreen`,
`StickySectionList`, `ChipList`) and compares them with the trees captured before the change
(`__tests__/__fixtures__/legacyTrees.json`): SideNav and ChipList are byte-identical; tabs gain only
`accessibilityRole` and `accessibilityState.selected`. Recapture the fixture only for a deliberate change.

- **`src/accessibility.js`** — `accessibilityProps({ role, label, selected, checked, disabled, current })`.
  react-native-web 0.21 ignores `accessibilityState` and warns on `accessibilityRole`/`accessibilityLabel`,
  so on the web it returns `role`, `aria-label`, `aria-selected`/`aria-checked`/`aria-disabled`/
  `aria-current` (plus `accessibilityState`, which RNW drops silently); on native, the `accessibility*`
  props. Use it in any component that sets a state a screen reader must hear. It is internal (not exported).
- **`SideNav`** — `variant: 'drawer' (default) | 'rail'`. The drawer keeps the 56dp gap under the first
  collapsed destination (the app sets it apart); `rail` is the MD3 navigation rail, destinations evenly spaced
  by Paper's 12dp. Items take `testID` and `accessibilityLabel` (on the destination button; on
  `Drawer.Item`, `testID` lands on its outer view — Paper's limit). The container takes
  `accessibilityRole` (`"navigation"` for a rail), `accessibilityLabel` and `testID`. Paper's items accept
  no `aria-*` for their button, so on the web SideNav marks each item wrapper `data-side-nav-item` and sets
  `aria-current="page"` on the selected button's DOM node after every render.
- **`Tabs`** — `Tabs.List` is `accessibilityRole="tablist"` (+ `accessibilityLabel`, `testID`) by default;
  `accessibilityRole={null}` opts out (`ChipList` does: chips are not tabs). `Tabs.Scrollable` forwards the
  three to its list. `Tabs.Item` is a `tab` with `accessibilityState.selected` (`aria-selected` on the web),
  takes `accessibilityLabel`, `testID` and `disabled` (`aria-disabled`). On the web: roving tabindex (only
  the selected tab — or the first, when none is — is a Tab stop), and the list handles Left/Right (wrapping,
  mirrored under `dir="rtl"`), Home and End by focusing the tab and clicking it (automatic activation; a
  disabled tab is skipped). `Tabs.Item variant="primary"` is the MD3 primary tab: 48dp, `titleSmall`, a 3dp
  indicator with rounded top corners as wide as the label, no layout shift. Without `variant` the original
  look stays (2dp full-width underline, the selected tab 2dp taller): the app's tab bars keep it; changing it
  is a product decision, not a fix.
- Tests under Jest run React Native's Pressable, which folds `aria-*` into `accessibilityState` before the
  host node: assert web ARIA on the props handed to Paper's `TouchableRipple`, and DOM syncs by giving the
  mocked View instance a `querySelectorAll` (see `SideNav.test.js`, `Tabs.test.js`).

## Generic UI for web hosts — 0.4.0-dev

The partner console's generic UI (`CustomerApp/admin-web/src/ui`) lives here now, for the console and the
AdminApp port alike. Every piece is in the barrel **and** `portable.js`, one folder per component, JS, themed
through `useTheme()` (a host theme's roles apply) and built on Paper components **as they are**: no hand-made
copy of a Paper component, even to work around a web accessibility quirk — those are recorded below as Paper
fork items. Labels come by props, with `global.*` defaults of this library's catalogue (never `partner.*`).
Nothing here is used by the customer/vendor/driver apps; the one app component touched, `Form.DriverInfo`,
renders its old tree without the new props (`legacyRendering.test.js`).

**Metrics are theme tokens.** The hosts keep Paper's size scaling on the web (no identity shim), so a raw
360px pane would look shrunken next to Paper components 1.16× their MD3 size. `Layout/metrics.js`:
`paneMetrics(theme)` / `usePaneMetrics()` → `{ rail: x20, margin: x6, spacer: x6, fixedPane: x20 × 4.5,
paneRadius: roundness × 4, sideSheetWidth, sideSheetRadius, bottomSheetMaxWidth: x20 × 8, bottomSheetRadius:
roundness × 7, dragHandle: { x8, x1 } }` (80/24/24/360/16/640/28/32×4 with an identity scale).
`tokenScale(theme)` = `spacing.x1 / 4`; `useWindowSizeClass()` → `{ sizeClass, width, height, scale }` reads
the class from `width / scale` (MD3 breakpoints `sizeClassOf`: compact <600, medium, expanded ≥840, large
≥1200, extraLarge ≥1600), so a window must be as much wider as the panes are. Identical to MD3 at scale 1.

Layout (`src/Layout/`, `index.js` re-exports):
- `paneArrangement(layout, sizeClass, activePane?)` → `{ panes, single, supporting }`: the collapse table
  (`LAYOUT` L3/L2A/L2B, `PANE`, `SUPPORTING_MODE`; compact collapses like medium; L3 on medium keeps the
  supporting pane as a side sheet).
- `PaneLayout({ layout, list, detail, primary, supporting, activePane, onBack, supportingOpen,
  onToggleSupporting, supportingLabel, testID='pane-layout' })` — slot testIDs `<testID>-<pane>`, sheet
  `<testID>-supporting-sheet`; an empty slot takes no room; `usePaneContext()` →
  `{ role, inSheet, onBack, onShowSupporting, onCloseSheet, supportingMode }`. Once laid out (`onLayout`) it keeps
  only the panes its own width fits (`fittingArrangement`: every flexible pane at least as wide as a fixed one,
  else the next narrower class's arrangement), so a host's rail beside it and the token scale count: at 840px
  beside an 80dp rail L2A shows one pane at a time. Until measured, the window's class alone decides.
- `Pane({ children, accessibilityLabel, style, testID })` — `region`; flat inside a sheet.
- `PaneHeader({ title, subtitle, onBack, actions:[{icon, label, onPress, disabled, testID}], trailing,
  backLabel, showSupportingLabel, closeLabel, testID='pane-header' })` on Paper `Appbar`; adds back
  (`<testID>-back`), show-supporting (`<testID>-show-supporting`) and close (`<testID>-close`) from the layout.
- `PaneFooter({ caption, actions:[{key, label, icon, onPress, primary, tone:'primary'|'danger', disabled}],
  busy, testID='pane-footer' })` on `ActionGroup.Buttons`; `footerButtons(actions, colors)` is its emphasis rule
  (at most one contained; never an adverse action by default).
- `BottomSheet({ visible, onDismiss, title, accessibilityLabel, closeLabel, children, testID })` (public) and the
  scaffold's own `SideSheet` (same props; internal to `PaneLayout`, not exported) —
  Paper `Portal` + `Surface`, scrim `<testID>-scrim` (pointer only, `aria-hidden`), the internal `SheetHeader`
  when titled, BottomSheet handle `<testID>-handle`. Web: `role="dialog"`, `aria-modal`,
  `useModalFocus`. Android: the back button dismisses. Sizes come from the window, not percentages: on iOS
  Paper's `Surface` moves `top/right/bottom/left` to an outer shadow layer and nests the surface two layers in,
  where a percentage or a stretch has nothing to resolve against (the side sheet gets the window's height there).
- The navigation rail is `SideNav variant="rail"` (the host's `DrawerSideNav` passes it; a FAB goes in
  `renderHeader`). `NavigationRail`, which duplicated it, is no longer exported.

Data display and feedback:
- `SectionCard({ title, subtitle, trailing, children, style, testID })` — Paper `Card mode="outlined"` +
  `Card.Title` (`titleMedium`/`bodySmall`, trailing in `right`) + `Card.Content`; 16dp gap under it.
- `KeyValueList({ items:[{key, label, value}], testID })` — rows `<testID>-<key>`; absent value → `—`.
- `ListRow({ title, description, details, icon, iconColor, trailing, onPress, selected, accessibilityLabel,
  inset=true, rounded, titleNumberOfLines, descriptionNumberOfLines, testID, children })` — **always** Paper
  `List.Item`; `iconSlot(icon, color?)`, `nodeSlot(node)` are its slot helpers.
- `MutedText({ children, variant='bodyMedium', numberOfLines, style, testID })`.
- `EmptyState({ title, description, actionLabel, actionIcon, onAction })`, `LoadingState({ label })`,
  `ErrorState({ title, description, onRetry, retryLabel })` on `TNEmptyStateView` / `TNActivityIndicator`.
- `DataTableView({ columns:[{key, title, numeric, sortable, flex, render, sortValue}], rows, rowKey, sort,
  defaultSort, onSortChange, sortMode:'client'|'server', onRowPress, selectedKey, hasMore, loadingMore,
  onLoadMore, emptyLabel, loadMoreLabel, sortByLabel, accessibilityLabel, testID='data-table' })` on Paper
  `DataTable`; `sortRows`, `nextSort`, `SORT_DIRECTION`, `SORT_MODE`. `accessibilityLabel` names the table
  (`aria-label` on Paper's `DataTable`); the `table`/`row`/`columnheader`/`cell` roles and a sortable title's
  `aria-sort` are the Paper fork's (branch `web-a11y`, to publish as 5.12.12; CustomerApp OPEN-ITEMS #46), so a
  sortable title's button is named by its title alone.
- `CodeBlock({ value, accessibilityLabel, testID })` (`codeText`), monospace per platform.
- `StatusBanner({ message, tone='info', icon, actions, visible=true, style, testID })` — Paper `Banner` in the
  tone's container (`tones.js`), text/icon/actions in its `onContainer` (a `ThemeProvider` around the Banner).

Fields: `NoteField({ label, value, onChangeText, helper, error, required, multiline=true, numberOfLines,
disabled, testID })`; `CheckboxListField({ label, options, values, onChange, disabled,
error, testID })` (Paper `Checkbox.Item`, leading, Android style); `FilterChips({ options:[{value, label}], value,
onChange, compact=true, disabled, accessibilityLabel, testID })` on `ChipList` (replaces the admin prototype's
`PartnerStatusFilterChips`; labels arrive localized). Tabs: `Tabs.Bar({ tabs:[{value, label, disabled,
accessibilityLabel}], value, onChange, accessibilityLabel, style, testID='tabs' })` — `Tabs.Scrollable` +
`Tabs.Item variant="primary"` with a value/label API, sized to its container (`width: 100%`, `flexGrow: 0`).

Form pieces: `ChangedHelperText`, `FieldErrorText` and the new `FieldErrorList({ errors, exclude, fieldLabel,
testID='field-errors' })` (every error one line; `<testID>.<field>`, `form` when field-less) are exported from
`Form/FormField.js`. `Form.DriverInfo` takes `readOnly` (locks every field and drops the applicant-facing
background-check disclosure; the secrets stay masked), `highlightFields`, `errors` (names `licenseNumer`,
`dateofBirth`, `ssn`) and `dateOfBirth` (seeds the date field); under `readOnly` the date field gets no entry aids
(placeholder, keypad, length). `legacyTrees.capture.test.js` re-captures `__fixtures__/legacyTrees.json` cases from
an old checkout (`CAPTURE_LEGACY_FROM`); the driver form's reproduces byte for byte from `partner-ui/k22` @ 7d46582.

Utilities: `useNow(intervalMs=60000)`; `valueText(value)` / `EMPTY_VALUE`; `DateInput/`: `formatDateInput`,
`parseDateInput` (instants typed in local time, `{ withTime }`), `formatCalendarDate`, `parseCalendarDate`
(`YYYY-MM-DD` kept as the string, never through a time zone), `parseDay`, `isBlankDay`, `DATE_PATTERN`,
`DATE_TIME_PATTERN`.

Catalogue keys added (en + es): `global.back`, `global.close`, `global.showSidePanel`, `global.navigation`,
`global.loading`, `global.somethingWentWrong`, `global.retry`, `global.loadMore`, `global.sortBy`
(`%{column}`), `global.profilePhoto`, `global.noProfilePhoto`.

**Paper fork web a11y items** (fixed in `@jmstechnologiesinc/react-native-paper`, not here, on the fork's branch
`web-a11y`, unpublished: CustomerApp OPEN-ITEMS #46. The components above use Paper as it is and inherit these on
the web until the fork's 5.12.12 is published):
- **Disabled press wrappers render `aria-disabled="true"`.** `Card` (always wraps its content in a
  `TouchableWithoutFeedback` with `disabled={!onPress}`), `List.Item` (its `TouchableRipple`), `DataTable.Row`,
  `DataTable.Title` (no `onPress`), `Chip` (no `onPress`) and `Appbar.Content` wrap content in a press target
  that is disabled when not pressable; react-native-web renders it `aria-disabled="true"`, so every control
  inside is announced dimmed (and automation refuses to act on it). Affects `SectionCard`, a non-pressable
  `ListRow`, `DataTableView` without `onRowPress`, `PaneHeader`'s title. The fork should render the wrapper (or
  its `disabled`) only with a press handler.
- **`accessibilityState` never reaches the DOM.** react-native-web 0.21 ignores it and the fork passes no
  `aria-*` twin: `RadioButton.Item`/`Checkbox.Item` (checked), `Chip` (selected: `FilterChips`),
  `SegmentedButtons` and `DataTable.Row` selection are silent to a screen reader. RNC's own components use
  `accessibility.js`; `ListRow` and `DataTableView` pass `aria-current`/`aria-selected` themselves.
- **`Modal` subscribes `BackHandler` on the web.** Every `Dialog` open logs react-native-web's «BackHandler is
  not supported on web»; it should skip the subscription on the web (the sheets here use `useModalFocus` there
  and `BackHandler` only on Android).
- **`Appbar.Content` drops `subtitle` under MD3** (`PaneHeader` draws it).

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
- `peerDependencies` are the contract with the host app. `package.json` declares `react`, `react-native`,
  `@jmstechnologiesinc/react-native-paper`, `@react-navigation/elements`, `@jmstechnologiesinc/order`,
  `@jmstechnologiesinc/order-narration` and `@jmstechnologiesinc/partner` — the last pinned **exactly**
  (canon R4; also a devDependency), because the view model and its tests read its vocabulary, and
  both the barrel and the portable entry import `Partner/viewModel`. The harness links the main checkout's
  root `node_modules`, which does not carry it; in a worktree it is unpacked into
  `packages/components/node_modules` (`npm pack @jmstechnologiesinc/partner@<the pin>` + extract), where Jest
  resolves it with no `moduleNameMapper`. The barrel additionally expects the host to provide what the app
  already has (`centrifuge`, `react-native-gesture-handler`, `react-native-reanimated`,
  `react-native-vector-icons`, …); the portable entry needs only `react-native-safe-area-context`,
  `react-native-vector-icons`, `color`, `@jmstechnologiesinc/commons`/`vendor`/`react-native-size-matters` and, on
  the web, `i18next`, `i18next-browser-languagedetector` and `react-i18next`. All of them are now declared
  as peers (C-35, 2026-10-03): every package `lib/` imports, at the range CustomerApp declares (so the main
  host never conflicts). The commented-out `expo-blur` and `showcase-template` are not. `partner` is a peer
  at **^0.2.33** (0.4.3, owner 2026-10-04: an exact pin refused every contract patch the app installs, B-8) and a
  devDependency at exactly 0.2.33; the harness carries it unpacked in `packages/components/node_modules`. `prepublishOnly` runs the build, so a
  publish never ships a stale `lib/`. **A new runtime dependency is an architectural change — ask first (§9)**;
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

Jest with the `react-native` preset. New tests go next to the code in a `__tests__/` folder. Render tests
use `react-test-renderer` inside Paper's `Provider`, with fake timers and an unmount after each test (Paper
animates on timers); assert on the HOST node of a `testID` (what a screen reader reads). The story is
still the component's documentation; write one that exercises the states you changed.

## Gotchas

- `main.js` / entry: root `index.js` registers the app; `App.tsx` decides Storybook vs demo screen.
- Web support is real (`react-native-web`, `mapbox-gl`, `react-map-gl`, `.web.js` twins) and the
  `.storybook` webpack config polyfills `os` via `os-browserify`. Don't assume native-only.
- `truly-native/` is legacy (`TN*` prefix). Don't extend it; new work goes in a normal component folder.
- The root package is `private: true` on purpose — never publish from the root.
- Current branch at time of writing: `feat/menu-schedule-strings`; remote
  `github.com/jmstechnologiesinc/react-native-components`.
