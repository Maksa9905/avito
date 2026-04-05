import 'i18next'

import type itemsRu from './locales/ru/items.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'items'
    resources: {
      items: typeof itemsRu
    }
  }
}
