import { Stack } from '@mantine/core'

import styles from './AiChat.module.css'
import type { ChatMessage } from '../../model/types'
import AiMessage from './AiMessage'
import { ERole } from '@/shared/api'

type AiMessagesListProps = {
  messages: ChatMessage[]
  isLoading?: boolean
}

const AiMessagesList = ({ messages, isLoading }: AiMessagesListProps) => {
  return (
    <Stack className={styles.messagesContainer}>
      <Stack className={styles.messages}>
        {messages.map((message, index) => (
          <AiMessage
            key={index}
            message={message}
          />
        ))}
        {isLoading && (
          <AiMessage
            key="loading"
            message={{
              role: ERole.ASSISTANT,
              content: 'Думает...',
            }}
          />
        )}
      </Stack>
    </Stack>
  )
}

export default AiMessagesList
