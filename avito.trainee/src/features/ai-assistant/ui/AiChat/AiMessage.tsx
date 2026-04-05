import { Box, Text } from '@mantine/core'
import styles from './AiChat.module.css'
import type { ChatMessage } from '../../model/types'
import { ERole } from '@/shared/api'
import { cn } from '@/shared/utils/cn'

type AiMessageProps = {
  message: ChatMessage
  className?: string
}

const AiMessage = ({ message, className }: AiMessageProps) => {
  return (
    <Box
      className={cn(
        styles.message,
        message.role === ERole.USER && styles.user,
        className,
      )}
    >
      <Text className={styles.content}>{message.content}</Text>
    </Box>
  )
}

export default AiMessage
