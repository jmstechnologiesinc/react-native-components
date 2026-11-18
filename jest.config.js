module.exports = {
  preset: '@react-native/jest-preset',

  // `packages/components/lib/` is BUILD OUTPUT (`npm run build` is a plain
  // `cp -r src/* lib`, see PROJECT.md). Jest was collecting the copied suites
  // too, so every result was reported twice and a stale `lib/` reported
  // failures for code that no longer existed in `src/`. Never edit `lib`, and
  // do not test it either.
  // `@rnmapbox/maps` throws AT IMPORT if its native module is absent
  // («native code not available»), so transpiling it is not enough and never
  // was: the barrel could not load under Jest at all. The fix is not a mock of
  // our own invention -- the library PUBLISHES this setup file and maintains
  // it, so what the tests see is the surface its author declares, not one this
  // repository guessed. It must run before `jest.setup.js`.
  // `@react-native-documents/picker` (ImagePicker/pickPdf.js) likewise
  // publishes the setup that stands in for its native module; its package
  // `exports` do not name it, so it is named by its path, as its docs do.
  setupFiles: [
    '@rnmapbox/maps/setup-jest',
    '<rootDir>/node_modules/@react-native-documents/picker/jest/build/jest/setup.js',
    '<rootDir>/jest.setup.js',
  ],

  // `__tests__/__fixtures__/` holds the data and case modules the suites
  // share (`appPathCases.js`); they are not suites themselves.
  testPathIgnorePatterns: ['/node_modules/', '/packages/components/lib/', '/__fixtures__/'],

  // The sibling `@jmstechnologiesinc/*` packages publish untranspiled ESM
  // (`material-tokens` exports at the top level; this library itself ships raw
  // JSX), and `react-native-config` does the same. They are inside
  // `node_modules`, which the preset excludes from transformation by default,
  // so anything importing them failed to parse — which is why the library's
  // own barrel test («needs tests») had never actually loaded the barrel.
  // `react-native-gesture-handler` 3 ships ESM too (`lib/module`), and
  // `react-native-actions-sheet` 10 imports it; `react-native-worklets`
  // (Reanimated 4) ships ESM and its jest mock is TypeScript;
  // `@react-native-documents/picker` ships ESM (`lib/module`).
  transformIgnorePatterns: [
    'node_modules/(?!(?:.pnpm/)?((jest-)?react-native|@react-native(-community|-documents)?|@jmstechnologiesinc|react-native-config|react-native-actions-sheet|react-native-gesture-handler|react-native-image-picker|react-native-draggable-flatlist|react-native-reanimated|react-native-worklets|@react-navigation|dinero\\.js|@dinero\\.js|@rnmapbox|react-native-vector-icons|react-native-permissions|react-native-geolocation-service|react-native-applifecycle)/)',
  ],

  // Several modules in the library import the library BY ITS PUBLISHED NAME
  // (`import { localized } from '@jmstechnologiesinc/react-native-components'`).
  // That resolves in a consuming app, where the package is installed, and
  // nowhere inside this repo — so any suite reaching one of those files failed
  // to resolve. Point the name at the source it is published from.
  moduleNameMapper: {
    // A-3 (2026-09-19): la biblioteca de posición construye un
    // `NativeEventEmitter` AL IMPORTARSE y tumba el barril entero fuera de un
    // dispositivo. La decisión fue EXCLUIRLA de la suite, no doblarla: el stub
    // lanza con su razón en cada método, así que el barril carga y nada puede
    // depender en silencio de una posición inventada. El porqué, entero, está
    // en el propio stub.
    '^react-native-geolocation-service$': '<rootDir>/test/stubs/geolocation-excluded.js',
    '^@jmstechnologiesinc/react-native-components/lib/(.*)$': '<rootDir>/packages/components/src/$1',
    '^@jmstechnologiesinc/react-native-components$': '<rootDir>/packages/components/src/index.js',
  },
};
