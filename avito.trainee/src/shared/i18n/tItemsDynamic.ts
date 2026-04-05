import type { TFunction } from 'i18next'

/** Ключи вида `form.edit.*`, `categories.*`, `sorting.*` собираются в рантайме; соответствие словарю задаётся конфигом. */
export function tItemsDynamic(t: TFunction<'items'>, key: string): string {
  return (t as (k: string) => string)(key)
}
