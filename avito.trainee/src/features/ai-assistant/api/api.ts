import { OllamaController, SystemPrompt, UserJsonPrompt } from '@/shared/api'
import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
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
  TSendAiChatMessageParams,
  TSendAiChatMessageResponse,
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

type TSendAiChatMessageContext = {
  chat: NonNullable<ReturnType<typeof OllamaController.getChat>>
  previousLength: number
}

type UseSendAiChatMessageOptions = Pick<
  UseMutationOptions<
    TSendAiChatMessageResponse,
    Error,
    TSendAiChatMessageParams,
    TSendAiChatMessageContext
  >,
  'onMutate' | 'onError' | 'onSettled' | 'onSuccess'
> & {
  onMessagesUpdated?: () => void
}

export const useSendAiChatMessage = (options?: UseSendAiChatMessageOptions) => {
  const { onMessagesUpdated, onMutate, onError, onSettled, onSuccess } =
    options ?? {}

  return useMutation<
    TSendAiChatMessageResponse,
    Error,
    TSendAiChatMessageParams,
    TSendAiChatMessageContext
  >({
    onMutate: async (variables, context) => {
      const parentContext = await onMutate?.(variables, context)

      const chat = OllamaController.getChat(variables.chatId)
      if (!chat) {
        throw new Error('Чат не найден')
      }

      const trimmed = variables.message.trim()
      if (!trimmed) {
        throw new Error('Сообщение не может быть пустым')
      }

      const previousLength = chat.getMessages().length
      const paramsString = JSON.stringify(variables.params, null, 2)
      chat.addSystemPrompt(new SystemPrompt(paramsString))
      chat.pushUserMessage(trimmed)

      onMessagesUpdated?.()

      return { ...parentContext, chat, previousLength }
    },
    mutationFn: async ({ chatId }) => {
      const chat = OllamaController.getChat(chatId)
      if (!chat) {
        throw new Error('Чат не найден')
      }

      const reply = await chat.completeAssistantReply()

      return { reply }
    },
    onError: (error, variables, result, context) => {
      result?.chat.rollbackToMessageCount(result?.previousLength)
      onMessagesUpdated?.()
      onError?.(error, variables, result, context)
    },
    onSuccess: (data, variables, result, context) => {
      onMessagesUpdated?.()
      onSuccess?.(data, variables, result, context)
    },
    onSettled: (data, error, variables, result, context) => {
      onSettled?.(data, error, variables, result, context)
    },
  })
}
