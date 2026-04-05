export function formatDayMonthTime(
  iso: string | undefined,
  locale: string,
): string {
  if (!iso) return ''

  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''

  const dateParts = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
  }).formatToParts(d)

  const day = dateParts.find((p) => p.type === 'day')?.value ?? ''
  const month = dateParts.find((p) => p.type === 'month')?.value ?? ''

  const timeParts = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(d)

  const hour = timeParts.find((p) => p.type === 'hour')?.value ?? ''
  const minute = timeParts.find((p) => p.type === 'minute')?.value ?? ''

  if (!day || !month || hour === '' || minute === '') return ''

  return `${day} ${month} ${hour}:${minute}`
}
