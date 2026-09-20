// `react-native-config` 1.5.3+ reads its values through a TurboModule
// (`TurboModuleRegistry.get(...)`), which react-native-web does not provide, so
// importing it on the web throws at module evaluation and takes down every
// story that reaches `packages/components/src/Config.js`. Config.js never
// reads `ENV` when `STORYBOOK_ENABLED` or `Platform.OS === 'web'` (it uses
// `react-native-dotenv` there), so an empty object is a faithful stand-in.
module.exports = {};
