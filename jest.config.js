module.exports = {
  preset: 'react-native',

  // `packages/components/lib/` is BUILD OUTPUT (`npm run build` is a plain
  // `cp -r src/* lib`, see PROJECT.md). Jest was collecting the copied suites
  // too, so every result was reported twice and a stale `lib/` reported
  // failures for code that no longer existed in `src/`. Never edit `lib`, and
  // do not test it either.
  setupFiles: ['<rootDir>/jest.setup.js'],

  testPathIgnorePatterns: ['/node_modules/', '/packages/components/lib/'],

  // The sibling `@jmstechnologiesinc/*` packages publish untranspiled ESM
  // (`material-tokens` exports at the top level; this library itself ships raw
  // JSX), and `react-native-config` does the same. They are inside
  // `node_modules`, which the preset excludes from transformation by default,
  // so anything importing them failed to parse — which is why the library's
  // own barrel test («needs tests») had never actually loaded the barrel.
  transformIgnorePatterns: [
    'node_modules/(?!(?:.pnpm/)?((jest-)?react-native|@react-native(-community)?|@jmstechnologiesinc|react-native-config|react-native-actions-sheet|react-native-image-picker|react-native-draggable-flatlist|react-native-reanimated|@react-navigation)/)',
  ],

  // Several modules in the library import the library BY ITS PUBLISHED NAME
  // (`import { localized } from '@jmstechnologiesinc/react-native-components'`).
  // That resolves in a consuming app, where the package is installed, and
  // nowhere inside this repo — so any suite reaching one of those files failed
  // to resolve. Point the name at the source it is published from.
  moduleNameMapper: {
    '^@jmstechnologiesinc/react-native-components/lib/(.*)$': '<rootDir>/packages/components/src/$1',
    '^@jmstechnologiesinc/react-native-components$': '<rootDir>/packages/components/src/index.js',
  },
};
