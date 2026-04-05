import type { TGenerateRecommendedPriceResponse } from './types'
import type { TGenerateDescriptionResponse } from './types'

export function extractModelJsonText(raw: string): string {
  const trimmed = raw.trim()
  const fence = /^```(?:json)?\s*([\s\S]*?)```$/m
  const m = trimmed.match(fence)
  return m ? m[1].trim() : trimmed
}

export function parseGenerateRecommendedPriceResponse(
  raw: string,
): TGenerateRecommendedPriceResponse {
  let parsed: unknown
  try {
    parsed = JSON.parse(extractModelJsonText(raw))
  } catch {
    throw new Error('Ответ модели не является валидным JSON')
  }

  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    Array.isArray(parsed) ||
    !('marketOverview' in parsed) ||
    !('recommendedPrice' in parsed) ||
    typeof (parsed as { marketOverview: unknown }).marketOverview !==
      'string' ||
    typeof (parsed as { recommendedPrice: unknown }).recommendedPrice !==
      'number' ||
    !Number.isFinite((parsed as { recommendedPrice: number }).recommendedPrice)
  ) {
    throw new Error(
      'Ответ модели не соответствует формату { "marketOverview": string, "recommendedPrice": number }',
    )
  }

  const { marketOverview, recommendedPrice } = parsed as {
    marketOverview: string
    recommendedPrice: number
  }

  return { marketOverview, recommendedPrice }
}

export function parseGenerateDescriptionResponse(
  raw: string,
): TGenerateDescriptionResponse {
  let parsed: unknown
  try {
    parsed = JSON.parse(extractModelJsonText(raw))
  } catch {
    throw new Error('Ответ модели не является валидным JSON')
  }

  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    Array.isArray(parsed) ||
    !('description' in parsed) ||
    typeof (parsed as { description: unknown }).description !== 'string'
  ) {
    throw new Error(
      'Ответ модели не соответствует формату { "description": string }',
    )
  }

  return {
    description: (parsed as { description: string }).description,
  }
}
