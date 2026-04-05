import { Drawer } from '@mantine/core'
import AiChatContext from './AiChatContext'
import { useCallback, useMemo, useState } from 'react'
import { ERole, OllamaController } from '@/shared/api'
import AiMessagesList from './AiMessagesList'
import type { ChatMessage } from '../../model/types'
import AiInputMessage from './AiInputMessage'
import { useSendAiChatMessage } from '../../api/api'

import styles from './AiChat.module.css'

type AiChatProviderProps = {
  children: React.ReactNode
  onGetValues: () => Record<string, unknown>
}

const AiChatProvider = ({ children, onGetValues }: AiChatProviderProps) => {
  const [chatId, setChatId] = useState<string | null>(null)
  const [messagesTick, setMessagesTick] = useState(0)

  const { mutateAsync: sendChatMessage, isPending } = useSendAiChatMessage({
    onMessagesUpdated: () => setMessagesTick((t) => t + 1),
  })

  const chat = chatId ? OllamaController.getChat(chatId) : null

  const messages = chat?.getMessages()

  const userMessages = useMemo(
    () =>
      (messages?.filter((m) => m.role !== ERole.SYSTEM) ?? []) as ChatMessage[],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [messages, messagesTick],
  )

  const handleSend = useCallback(
    async (message: string) => {
      if (!chatId) return

      await sendChatMessage({ chatId, message, params: onGetValues() })
    },
    [chatId, onGetValues, sendChatMessage],
  )

  return (
    <AiChatContext.Provider value={{ chatId, setChatId }}>
      <Drawer
        classNames={{
          inner: styles.drawerInner,
          content: styles.drawerContent,
          body: styles.body,
        }}
        opened={Boolean(chatId)}
        position="right"
        onClose={() => setChatId(null)}
        title="Спросите у AI"
      >
        <div className={styles.chatRoot}>
          <AiMessagesList isLoading={isPending} messages={userMessages} />
          <div className={styles.inputFooter}>
            <AiInputMessage onSend={handleSend} />
          </div>
        </div>
      </Drawer>
      {children}
    </AiChatContext.Provider>
  )
}

export default AiChatProvider
