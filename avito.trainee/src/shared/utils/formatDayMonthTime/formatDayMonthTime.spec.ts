import { describe, expect, it } from 'vitest'

import { formatDayMonthTime } from './formatDayMonthTime'

describe('formatDayMonthTime', () => {
  it('возвращает пустую строку для undefined и невалидной строки', () => {
    expect(formatDayMonthTime(undefined, 'ru')).toBe('')
    expect(formatDayMonthTime('', 'ru')).toBe('')
    expect(formatDayMonthTime('not-a-date', 'ru')).toBe('')
  })

  it('для ru форматирует как «день месяц часы:минуты» без года', () => {
    const s = formatDayMonthTime('2000-06-15T08:30:00', 'ru')
    expect(s).toContain('июня')
    expect(s).toMatch(/\d{1,2}:\d{2}$/)
    expect(s).not.toMatch(/2000/)
  })
})
