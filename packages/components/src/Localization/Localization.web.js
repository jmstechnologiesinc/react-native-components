import memoize from 'lodash.memoize';
import i18n from 'i18n-js';

export const translationGetters = {
    es: () => require('./Translations/es.json'),
    en: () => require('./Translations/en.json'),
};




export const setI18nConfig = () => {
    const language = navigator.language || navigator.userLanguage;

    const languageTag = language.startsWith('es') ? 'es' : 'en';

    i18n.translations = { [languageTag]: translationGetters[languageTag]() };
    i18n.locale = languageTag;
};

export const localized = memoize(
    (key, config) => (i18n.t(key, config).includes('missing') ? key : i18n.t(key, config)),
    (key, config) => (config ? key + JSON.stringify(config) : key)
);


