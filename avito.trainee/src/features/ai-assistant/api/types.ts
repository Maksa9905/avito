export type TGenerateRecommendedPriceParams = {
  language: string
  params: Record<string, unknown>
}

export type TGenerateDescriptionParams = {
  language: string
  params: Record<string, unknown>
}

export type TGenerateRecommendedPriceResponse = {
  marketOverview: string
  recommendedPrice: number
}

export type TGenerateDescriptionResponse = {
  description: string
}

export type TSendAiChatMessageParams = {
  chatId: string
  message: string
  params: Record<string, unknown>
}

export type TSendAiChatMessageResponse = {
  reply: string
}
