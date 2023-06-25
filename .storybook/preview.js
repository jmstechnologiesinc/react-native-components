import React from "react";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  Provider as PaperProvider,
} from '@jmstechnologiesinc/react-native-paper';

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
        <PaperProvider>
          <Story />
        </PaperProvider>
    </SafeAreaProvider>
  ),
];