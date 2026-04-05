import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import itemsRu from './locales/ru/items.json'

void i18n.use(initReactI18next).init({
  lng: 'ru',
  fallbackLng: 'ru',
  supportedLngs: ['ru'],
  ns: ['items'],
  defaultNS: 'items',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    ru: {
      items: itemsRu,
    },
  },
  react: {
    useSuspense: false,
  },
})

export default i18n
