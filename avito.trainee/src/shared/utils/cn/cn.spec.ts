import { describe, expect, it } from 'vitest'

import { cn } from './cn'

describe('cn', () => {
  it('склеивает несколько классов через пробел', () => {
    expect(cn('foo', 'bar', 'baz')).toBe('foo bar baz')
  })

  it('отбрасывает undefined и пустые строки', () => {
    expect(cn('a', undefined, '', 'b')).toBe('a b')
  })

  it('возвращает пустую строку, если нечего склеивать', () => {
    expect(cn()).toBe('')
    expect(cn(undefined, undefined)).toBe('')
  })
})
