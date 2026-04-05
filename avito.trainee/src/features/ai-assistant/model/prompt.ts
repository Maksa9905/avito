import {
  IMPROVE_DESCRIPTION_INSTRUCTIONS,
  RECOMMENDED_PRICE_INSTRUCTIONS,
} from '../lib/prompts'

import { EPromptType } from './types'

import { SystemPrompt } from '@/shared/api'

export function createAiSystemPrompt(
  promptType: EPromptType,
  language: string,
): SystemPrompt {
  const base =
    promptType === EPromptType.IMPROVE_DESCRIPTION
      ? IMPROVE_DESCRIPTION_INSTRUCTIONS
      : RECOMMENDED_PRICE_INSTRUCTIONS

  return new SystemPrompt(base, language)
}
