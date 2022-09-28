import React from "react";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ScreenWrapper from '../packages/components/src/ScreenWrapper/ScreenWrapper';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  (Story) => (
    <SafeAreaProvider>
      <ScreenWrapper>
        <Story />
      </ScreenWrapper>
    </SafeAreaProvider>
  ),
];