import { Textarea } from '@mantine/core'

import SendMessageIcon from '@/shared/icons/SendMessageIcon'
import IconButton from '@/shared/ui/IconButton'

import styles from './AiChat.module.css'
import { useCallback, useState } from 'react'

type AiInputMessageProps = {
  onSend: (message: string) => void
}

const AiInputMessage = ({ onSend }: AiInputMessageProps) => {
  const [message, setMessage] = useState<string>('')

  const handleSend = useCallback(() => {
    onSend(message)
  }, [message, onSend])

  return (
    <Textarea
      value={message}
      onChange={(event) => setMessage(event.target.value)}
      autosize
      minRows={1}
      maxRows={5}
      placeholder="Спросите у AI"
      className={styles.input}
      rightSection={
        <IconButton
          onClick={handleSend}
          className={styles.icon}
          color="gray"
        >
          <SendMessageIcon />
        </IconButton>
      }
    />
  )
}

export default AiInputMessage
