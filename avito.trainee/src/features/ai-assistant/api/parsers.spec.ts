import { describe, expect, it } from 'vitest'

import {
  extractModelJsonText,
  parseGenerateDescriptionResponse,
  parseGenerateRecommendedPriceResponse,
} from './parsers'

describe('extractModelJsonText', () => {
  it('возвращает исходную строку, если нет markdown-ограждения', () => {
    const raw = '{"description":"x"}'
    expect(extractModelJsonText(raw)).toBe(raw)
  })

  it('снимает обёртку ```json ... ```', () => {
    const inner = '{"description":"текст"}'
    const raw = `\`\`\`json\n${inner}\n\`\`\``
    expect(extractModelJsonText(raw)).toBe(inner)
  })

  it('снимает обёртку ``` ... ``` без языка', () => {
    const inner = '{"a":1}'
    expect(extractModelJsonText(`\`\`\`\n${inner}\n\`\`\``)).toBe(inner)
  })

  it('обрезает пробелы по краям', () => {
    expect(extractModelJsonText('  {"x":1}  ')).toBe('{"x":1}')
  })
})

describe('parseGenerateDescriptionResponse', () => {
  it('парсит валидный JSON с description', () => {
    expect(parseGenerateDescriptionResponse('{"description":"Новый текст"}')).toEqual(
      { description: 'Новый текст' },
    )
  })

  it('понимает JSON внутри markdown-ограждения', () => {
    const raw = '```json\n{"description":"OK"}\n```'
    expect(parseGenerateDescriptionResponse(raw)).toEqual({ description: 'OK' })
  })

  it('бросает при невалидном JSON', () => {
    expect(() => parseGenerateDescriptionResponse('not json')).toThrow(
      'Ответ модели не является валидным JSON',
    )
  })

  it('бросает, если нет строкового поля description', () => {
    expect(() => parseGenerateDescriptionResponse('{"description":1}')).toThrow(
      'не соответствует формату',
    )
  })

  it('бросает, если description отсутствует', () => {
    expect(() => parseGenerateDescriptionResponse('{"other":true}')).toThrow(
      'не соответствует формату',
    )
  })
})

describe('parseGenerateRecommendedPriceResponse', () => {
  it('парсит валидный ответ', () => {
    const raw =
      '{"marketOverview":"рынок стабилен","recommendedPrice":125000}'
    expect(parseGenerateRecommendedPriceResponse(raw)).toEqual({
      marketOverview: 'рынок стабилен',
      recommendedPrice: 125000,
    })
  })

  it('бросает при невалидном JSON', () => {
    expect(() => parseGenerateRecommendedPriceResponse('')).toThrow(
      'Ответ модели не является валидным JSON',
    )
  })

  it('бросает, если recommendedPrice не число', () => {
    expect(() =>
      parseGenerateRecommendedPriceResponse(
        '{"marketOverview":"x","recommendedPrice":"100"}',
      ),
    ).toThrow('не соответствует формату')
  })

  it('бросает, если recommendedPrice — NaN / не конечное', () => {
    expect(() =>
      parseGenerateRecommendedPriceResponse(
        '{"marketOverview":"x","recommendedPrice":null}',
      ),
    ).toThrow('не соответствует формату')
  })
})
