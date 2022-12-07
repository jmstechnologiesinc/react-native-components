import memoize from 'lodash.memoize';
import i18n from 'i18n-js';
import * as RNLocalize from 'react-native-localize';

export const translationGetters = {
    es: () => require('./Translations/es.json'),
    en: () => require('./Translations/en.json'),
};

export const localized = memoize(
    (key, config) => (i18n.t(key, config).includes('missing') ? key : i18n.t(key, config)),
    (key, config) => (config ? key + JSON.stringify(config) : key)
);

export const setI18nConfig = () => {
    const fallback = { languageTag: 'en' };
    const { languageTag, isRTL } = RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) || fallback;
    localized.cache.clear();
    i18n.translations = { [languageTag]: translationGetters[languageTag]() };
    i18n.locale = languageTag;
};
