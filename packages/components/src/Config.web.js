import { Platform } from 'react-native';

// C-35 — the web twin of `Config.js`.
//
// The native module reads `react-native-config` (a TurboModule react-native-web
// does not provide, so importing it throws at module evaluation) and
// `react-native-dotenv` (a Babel plugin a host bundler does not run). A web host
// therefore cannot get its values from either: it hands them over at runtime,
// once, before rendering, through `configureComponents`.
//
// `Config` is one mutable object on purpose. Its readers (`utils.js`, the map
// wrappers) read `Config.<KEY>` when they are CALLED, not when they are
// imported, so a value configured after import is still seen.

export const IS_WEB_PLATFORM = Platform.OS == 'web';

const Config = {
    IMAGEKIT_URL: undefined,
    LEGAL_ENTITY_NAME: undefined,
    MAPBOX_ACCESS_TOKEN: undefined,
    GOOGLE_GEO_CODER_PLACE_API: undefined,
    CORS_PROXY_DISPATCHER_APP: undefined,
};

/** Merges the host's values into the library's configuration. */
export const configureComponents = (values = {}) => Object.assign(Config, values);

export { Config };
