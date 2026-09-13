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
jest.mock('react-native-localize', () => ({
    findBestLanguageTag: () => ({ languageTag: 'en', isRTL: false }),
}));
