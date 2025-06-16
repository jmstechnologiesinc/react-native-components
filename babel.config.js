module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'transform-inline-environment-variables',
    [
      'module:react-native-dotenv',
      {
        moduleName: 'react-native-dotenv',
        verbose: false,
      },
    ],

    ['babel-plugin-react-docgen-typescript', { exclude: 'node_modules' }],
    'react-native-reanimated/plugin',


  ],
};
