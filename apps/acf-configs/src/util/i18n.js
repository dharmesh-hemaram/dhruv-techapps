import { APP_LANGUAGES } from '@dhruv-techapps/ui';
import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
let lng = window.localStorage.getItem('language') || navigator.language.replace('-', '_');

if (!APP_LANGUAGES.includes(lng)) {
  lng = 'en';
  window.localStorage.setItem('language', lng);
}

i18n
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  // want your translations to be loaded from a professional CDN? => https://github.com/locize/react-tutorial#step-2---use-the-locize-cdn
  .use(Backend)

  // .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'en',
    ns: 'web-new',
    debug: false,
    defaultNS: 'web-new',
    lng,
    backend: {
      loadPath: `https://static.getautoclicker.com/acf-i18n/{{lng}}/{{ns}}.json`,
      addPath: '/locales/add/{{lng}}/{{ns}}',
      allowMultiLoading: true,
      reloadInterval: false,
      crossDomain: true,
    },
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
