import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import adsRu from './locales/ru/ads.json'
import itemsRu from './locales/ru/items.json'

void i18n.use(initReactI18next).init({
  lng: 'ru',
  fallbackLng: 'ru',
  supportedLngs: ['ru'],
  ns: ['items', 'ads'],
  defaultNS: 'items',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    ru: {
      ads: adsRu,
      items: itemsRu,
    },
  },
  react: {
    useSuspense: false,
  },
})

export default i18n
