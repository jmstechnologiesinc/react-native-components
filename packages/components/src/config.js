import { Platform } from 'react-native';
import ENV from 'react-native-config';
import { IMAGEKIT_URL, LEGAL_ENTITY_NAME } from 'react-native-dotenv';

export const IS_WEB_PLATFORM = Platform.OS == 'web'

const Config = {
  IMAGEKIT_URL: IS_WEB_PLATFORM ? IMAGEKIT_URL : ENV.IMAGEKIT_URL,
  LEGAL_ENTITY_NAME: IS_WEB_PLATFORM ? LEGAL_ENTITY_NAME : ENV.LEGAL_ENTITY_NAME
}

export { Config };
