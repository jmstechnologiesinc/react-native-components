/** @type{import("@storybook/react-webpack5").StorybookConfig} */
module.exports = {
  stories: [
    '../packages/components/src/List/*.stories.?(ts|tsx|js|jsx)',
    '../packages/components/src/VendorView/*.stories.?(ts|tsx|js|jsx)',
    '../packages/components/src/ScreenWrapper/*.stories.?(ts|tsx|js|jsx)',
    '../packages/components/src/QuantityButton/*.stories.?(ts|tsx|js|jsx)',
    '../packages/components/src/RideAndSharing/*.stories.?(ts|tsx|js|jsx)',
    '../packages/components/src/TipsFilter/*.stories.?(ts|tsx|js|jsx)',
    '../packages/components/src/Accounting/*.stories.?(ts|tsx|js|jsx)',
    '../packages/components/src/ActionGroup/*.stories.?(ts|tsx|js|jsx)',
    '../packages/components/src/CartList/*.stories.?(ts|tsx|js|jsx)',
    '../packages/components/src/ChipList/*.stories.?(ts|tsx|js|jsx)',
    '../packages/components/src/DynamicForm/*.stories.?(ts|tsx|js|jsx)',
    '../packages/components/src/IndustryList/*.stories.?(ts|tsx|js|jsx)',
    '../packages/components/src/PhotoGallery/*.stories.?(ts|tsx|js|jsx)',
    '../packages/components/src/ProductList/*.stories.?(ts|tsx|js|jsx)',
    '../packages/components/src/ProductView/*.stories.?(ts|tsx|js|jsx)',
    '../packages/components/src/SegmentedButtonGroup/*.stories.?(ts|tsx|js|jsx)',
    '../packages/components/src/SideNav/*.stories.?(ts|tsx|js|jsx)',
    '../packages/components/src/SocialAuthentication/*.stories.?(ts|tsx|js|jsx)',
    '../packages/components/src/StickySectionList/*.stories.?(ts|tsx|js|jsx)',
    '../packages/components/src/SwipeToDelete/*.stories.?(ts|tsx|js|jsx)',
    '../packages/components/src/Tabs/*.stories.?(ts|tsx|js|jsx)',
    '../packages/components/src/TouchableRippleWrapper/*.stories.?(ts|tsx|js|jsx)',
    '../packages/components/src/VendorList/*.stories.?(ts|tsx|js|jsx)',
  ],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-react-native-web',
    '@storybook/addon-webpack5-compiler-babel',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: true,
  },
  webpackFinal: async config => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      os: require.resolve('os-browserify/browser'),
    };
    return config;
  },
};
