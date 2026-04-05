import { createContext, useContext } from 'react'

type AiChatContextType = {
  chatId: string | null
  setChatId: (chatId: string) => void
}

const AiChatContext = createContext<AiChatContextType | null>(null)

export const useAiChat = () => {
  const context = useContext(AiChatContext)
  if (!context) {
    throw new Error('useAiChat must be used within an AiChatProvider')
  }
  return context
}

export default AiChatContext
