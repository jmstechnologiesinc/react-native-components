import type {Preview} from '@storybook/react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {
  IMAGEKIT_URL,
  LEGAL_ENTITY_NAME,
  MAPBOX_ACCESS_TOKEN,
  GOOGLE_GEO_CODER_PLACE_API,
  CORS_PROXY_DISPATCHER_APP,
} from 'react-native-dotenv';
import {configureComponents} from '../packages/components/src/Config';
import './preview.css';

// On the web the library reads its configuration from `Config.web.js`, which
// the host fills at runtime (C-35). This harness is that host: it hands over
// the values `Config.js` used to read from `react-native-dotenv` itself.
configureComponents({
  IMAGEKIT_URL,
  LEGAL_ENTITY_NAME,
  MAPBOX_ACCESS_TOKEN,
  GOOGLE_GEO_CODER_PLACE_API,
  CORS_PROXY_DISPATCHER_APP,
});

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
