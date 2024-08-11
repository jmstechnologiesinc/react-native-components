import { Platform } from 'react-native';
import ENV from 'react-native-config';


export const IS_WEB_PLATFORM = Platform.OS == 'web'

const Config = {
  IMAGEKIT_URL: IS_WEB_PLATFORM ? process.env.EXPO_PUBLIC_IMAGEKIT_URL : ENV.IMAGEKIT_URL,
  LEGAL_ENTITY_NAME: IS_WEB_PLATFORM ? process.env.EXPO_PUBLIC_LEGAL_ENTITY_NAME : ENV.LEGAL_ENTITY_NAME
}

export { Config };