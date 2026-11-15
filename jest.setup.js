// `react-native-config` reads its values from a NATIVE module at import time
// (`NativeConfigModule.getConfig()`), so any suite that reaches `Config.js` —
// and therefore the library's barrel, since `utils.js` imports it — threw
// before running a single assertion. That is why
// `packages/components/__tests__/components.test.js` had never actually
// loaded `src/index.js`: the one test that can catch a broken export.
//
// Env values are the app's, not this library's, so an empty object is the
// honest stand-in: a test asserting on a real value would be asserting on the
// developer's `.env`.
jest.mock('react-native-config', () => ({ __esModule: true, default: {}, Config: {} }));

// Same story: `react-native-localize` resolves a TurboModule at import time.
// `Localization.js` imports it, so the barrel does too. The device language is
// the device's; `en` is the library's own fallback and the only answer that
// does not depend on whose machine the suite runs on.
// `getLocales` is mocked for the same reason and with the same answer:
// `OrderTripTelemetry.js` calls it AT IMPORT TIME
// (`const { languageCode } = RNLocalize.getLocales()[0]`), so a mock carrying
// only `findBestLanguageTag` keeps the barrel out exactly as the native module
// did. It returns the same `en` as the rest of this file: the device language
// belongs to the device, and a suite depending on it would be asserting about
// whoever's machine runs it.
jest.mock('react-native-localize', () => ({
    findBestLanguageTag: () => ({ languageTag: 'en', isRTL: false }),
    getLocales: () => [{
        countryCode: 'US', languageTag: 'en-US', languageCode: 'en', isRTL: false,
    }],
}));

// Same story again, one layer deeper: the barrel reaches
// `OptionPickerActionSheet.js` -> `react-native-actions-sheet` ->
// `react-native-gesture-handler`, which resolves `RNGestureHandlerModule`
// through `TurboModuleRegistry.getEnforcing` at import time and throws in any
// environment without the native binary. The library publishes its own jest
// setup for exactly this; using it keeps the mock surface the library's
// responsibility instead of a hand-written stub that drifts from it.
require('react-native-gesture-handler/jestSetup');

// Reanimated 4 runs on `react-native-worklets`, a native runtime no test
// environment has. Worklets' Jest guide recommends the mock the library
// publishes for exactly this; Reanimated itself then runs as it is (its guide
// asks for no mock of its own).
jest.mock('react-native-worklets', () => require('react-native-worklets/src/mock'));

// Same story once more: `react-native-permissions` resolves `RNPermissions`
// through `TurboModuleRegistry.getEnforcing` at import time. `ImagePickerAPI.js`
// imports it, `ImagePicker.js` imports that, and the barrel imports THAT.
//
// The library publishes its own jest mock (`react-native-permissions/mock`, the
// one the app's jest setup uses). It carries the whole surface, `RESULTS`
// included, which `ImagePickerAPI.js` reads at import time. Its `request`
// answers `granted`: that is NOT a claim that the user granted anything, only
// the answer that does not turn a permission dialog, which no test environment
// can show, into a failure. A test that needs to exercise a DENIED path should
// mock `request` itself, where the denial is the point.
jest.mock('react-native-permissions', () => require('react-native-permissions/mock'));

