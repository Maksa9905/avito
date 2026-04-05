import { OllamaController, SystemPrompt, UserJsonPrompt } from '@/shared/api'
import { useMutation } from '@tanstack/react-query'
import {
  IMPROVE_DESCRIPTION_INSTRUCTIONS,
  RECOMMENDED_PRICE_INSTRUCTIONS,
} from '../lib/prompts'
import {
  parseGenerateDescriptionResponse,
  parseGenerateRecommendedPriceResponse,
} from './parsers'

import type {
  TGenerateDescriptionParams,
  TGenerateDescriptionResponse,
  TGenerateRecommendedPriceParams,
  TGenerateRecommendedPriceResponse,
} from './types'

export const useGenerateRecommendedPrice = () => {
  return useMutation<
    TGenerateRecommendedPriceResponse,
    Error,
    TGenerateRecommendedPriceParams
  >({
    mutationFn: async ({
      language,
      params,
    }: TGenerateRecommendedPriceParams) => {
      const systemPrompt = new SystemPrompt(
        RECOMMENDED_PRICE_INSTRUCTIONS,
        language,
      )

      const chat = OllamaController.createChat(
        'recommended-price',
        systemPrompt,
      )

      const prompt = new UserJsonPrompt(params)

      const response = await chat.chat(prompt)

      return parseGenerateRecommendedPriceResponse(response)
    },
  })
}

export const useGenerateDescription = () => {
  return useMutation<
    TGenerateDescriptionResponse,
    Error,
    TGenerateDescriptionParams
  >({
    mutationFn: async ({ language, params }: TGenerateDescriptionParams) => {
      const systemPrompt = new SystemPrompt(
        IMPROVE_DESCRIPTION_INSTRUCTIONS,
        language,
      )

      const chat = OllamaController.createChat(
        'improve-description',
        systemPrompt,
      )

      const prompt = new UserJsonPrompt(params)

      const response = await chat.chat(prompt)

      return parseGenerateDescriptionResponse(response)
    },
  })
}
