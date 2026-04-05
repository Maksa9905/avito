import type { ERole } from '@/shared/api'

export enum EPromptType {
  RECOMMENDED_PRICE = 'recommended_price',
  IMPROVE_DESCRIPTION = 'improve_description',
}

export type RecommendedPriceAiResponse = {
  marketOverview: string
  recommendedPrice: number
}

export type ChatMessage = {
  role: ERole.USER | ERole.ASSISTANT
  content: string
}
