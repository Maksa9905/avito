import ChatIcon from '@/shared/icons/ChatIcon'
import styles from './AiFloatingButton.module.css'
import { useCallback } from 'react'
import { useAiChat } from '../AiChat'
import { OllamaController, SystemPrompt } from '@/shared/api'
import { AI_CHAT_INSTRUCTIONS } from '../../lib/prompts'
import { i18n } from '@/shared/i18n'
import { useLocalStorage } from '@mantine/hooks'
import { useParams } from 'react-router-dom'

const AiFloatingButton = () => {
  const { id: itemId } = useParams<{ id: string }>()

  const [chatIdMap, setChatIdMap] = useLocalStorage<Record<string, string>>({
    key: 'ai-chat-id-map',
    defaultValue: {},
  })

  const { setChatId } = useAiChat()

  const handleClick = useCallback(() => {
    const language = i18n.resolvedLanguage ?? i18n.language

    const prompt = new SystemPrompt(AI_CHAT_INSTRUCTIONS, language)

    const chatId = itemId ? chatIdMap[itemId] : null

    if (chatId) {
      setChatId(chatId)
    } else {
      const chat = OllamaController.createChat('ai-chat', prompt)

      const chatId = chat.getId()

      if (itemId) setChatIdMap((prev) => ({ ...prev, [itemId]: chatId }))
      setChatId(chatId)
    }
  }, [chatIdMap, itemId, setChatId, setChatIdMap])

  return (
    <button
      className={styles.button}
      onClick={handleClick}
    >
      <ChatIcon />
    </button>
  )
}

export default AiFloatingButton
