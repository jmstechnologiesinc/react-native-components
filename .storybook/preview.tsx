import type {Preview} from '@storybook/react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const preview: Preview = {
  parameters: {
    actions: {argTypesRegex: '^on[A-Z].*'},
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export const decorators = [
  Story => (
    <SafeAreaProvider>
      <Story />
    </SafeAreaProvider>
  ),
];
export default preview;
