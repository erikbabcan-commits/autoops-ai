import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from '../locales/en.json'
import sk from '../locales/sk.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      sk: { translation: sk },
    },
    fallbackLng: 'en',
    load: 'languageOnly',
    lowerCaseLng: true,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng
  }
})

export default i18n
