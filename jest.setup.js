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

// Same story once more, and this one is a NATIVE module with no published
// mock: `react-native-permissions` resolves `RNPermissions` through
// `TurboModuleRegistry.getEnforcing` at import time. `ImagePickerAPI.js`
// imports it, `ImagePicker.js` imports that, and the barrel imports THAT — so
// this was the last thing standing between the barrel and its own test.
//
// The surface the library uses is exactly `{ PERMISSIONS, request }`, so that
// is all this stands in for. `request` answering `granted` is NOT a claim that
// the user granted anything: it is the only answer that does not turn a
// permission dialog — which no test environment can show — into a failure, and
// no suite asserts on it. A test that needs to exercise a DENIED path should
// mock `request` itself, where the denial is the point.
jest.mock('react-native-permissions', () => ({
    PERMISSIONS: {
        IOS: { CAMERA: 'ios.permission.CAMERA', PHOTO_LIBRARY: 'ios.permission.PHOTO_LIBRARY' },
        ANDROID: { CAMERA: 'android.permission.CAMERA', READ_MEDIA_IMAGES: 'android.permission.READ_MEDIA_IMAGES' },
    },
    request: () => Promise.resolve('granted'),
}));

