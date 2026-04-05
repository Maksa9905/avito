import { describe, expect, it } from 'vitest'

import {
  IMPROVE_DESCRIPTION_INSTRUCTIONS,
  RECOMMENDED_PRICE_INSTRUCTIONS,
} from '../lib/prompts'

import { createAiSystemPrompt } from './prompt'
import { EPromptType } from './types'

describe('createAiSystemPrompt', () => {
  it('для IMPROVE_DESCRIPTION подставляет инструкции улучшения описания и язык', () => {
    const prompt = createAiSystemPrompt(EPromptType.IMPROVE_DESCRIPTION, 'ru')
    const content = prompt.getContent()

    expect(content).toContain(IMPROVE_DESCRIPTION_INSTRUCTIONS)
    expect(content).toContain('ru')
  })

  it('для RECOMMENDED_PRICE подставляет инструкции по цене и язык', () => {
    const prompt = createAiSystemPrompt(EPromptType.RECOMMENDED_PRICE, 'en')
    const content = prompt.getContent()

    expect(content).toContain(RECOMMENDED_PRICE_INSTRUCTIONS)
    expect(content).toContain('en')
  })
})
