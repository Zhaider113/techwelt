import i18n from 'i18next';
import * as Localization from 'expo-localization';
import {initReactI18next} from "react-i18next";

import en from "../../locales/en.json";
import es from "../../locales/es.json";
import fr from "../../locales/fr.json";
import de from "../../locales/de.json";
import it from "../../locales/it.json";
import ar from "../../locales/ar.json";

// creating a language detection plugin using expo
// http://i18next.com/docs/ownplugin/#languagedetector

const languageDetector = {
    type: 'languageDetector',
    async: true, // async detection
    detect: (callback) => {
        // We will get back a string like "en-UK".
        callback(Localization.locale);

    },

    init: () => {
    },

    cacheUserLanguage: () => {
    },
}


i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .use(languageDetector)
    .init({
        fallbackLng: 'en-US',
        compatibilityJSON: 'v3',
        // the translations

        resources: {
            'en-US': {
                translation: en
            },
            'fr': {
                translation: fr
            },
            'es': {
              translation: es
            },
            'it': {
              translation: it
            },
            'de': {
              translation: de
            },
            'ar': {
              translation: ar
            },
            // have a initial namespace
            ns: ['translation'],
            supportedLngs: [  // Supported languages
                {
                  code: 'en',
                  locale: 'English'
                }, {
                  code: 'fr',
                  locale: 'French'
                }, {
                  code: 'es',
                  locale: 'Spanish'
                }, {
                  code: 'it',
                  locale: 'Italian'
                }, {
                  code: 'de',
                  locale: 'Germany'
                },{
                  code: 'ar',
                  locale: 'Arabic'
                } 
            ],
            defaultNS: 'translation',
            interpolation: {
                escapeValue: false // not needed for react
            }
        }
    })
export default i18n;


// French , English , Spanish, Italian, Germany , Arabic

// import { Platform } from "react-native";

// const isAndroid = Platform.OS === "android";
// const isHermes = !!global.HermesInternal;

// if (isAndroid || isHermes) {
//   require("@formatjs/intl-locale/polyfill");

//   require("@formatjs/intl-pluralrules/polyfill");
//   require("@formatjs/intl-pluralrules/locale-data/en");
//   require("@formatjs/intl-pluralrules/locale-data/es");

//   require("@formatjs/intl-displaynames/polyfill");
//   require("@formatjs/intl-displaynames/locale-data/en");
//   require("@formatjs/intl-displaynames/locale-data/es");
// }

// import i18n from "i18next";
// import { initReactI18next } from "react-i18next";

// // Could be anything that returns default preferred language
// import { getLocales } from "expo-localization";

// // Import all the languages you want here


// i18n.use(initReactI18next).init({
//   // Add any imported languages here
//   resources: {
//     en: {
//       translation: en,
//     },
//     es: {
//       translation: es,
//     }
//   },
//   lng: 'en',//getLocales()[0].languageCode,
//   fallbackLng: "en",  // This is the default language if none of the users preffered languages are available
//   interpolation: {
//     escapeValue: false, // https://www.i18next.com/translation-function/interpolation#unescape
//   },
//   returnNull: false,
// })

// // i18n.use(initReactI18next).init({
// //   resources: {
// //     en: { translation: en },
// //     fr: { translation: fr },
// //   },
// //   lng: 'en', // Default language
// //   fallbackLng: 'en', // Fallback language
// //   interpolation: {
// //     escapeValue: false,
// //   },
// // });
