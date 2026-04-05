import { Menu } from '@mantine/core'

import { cn } from '@/shared/utils/cn'

import { useCallback, useEffect, useState } from 'react'
import ErrorState from './ErrorState'
import SuccessState from './SuccessState'

import styles from './AiConfirmMenu.module.css'

type AiConfirmMenuProps = {
  children: React.ReactNode
  open: boolean
  error?: boolean
  content?: string
  onApply?: () => void
}

const AiConfirmMenu = ({
  children,
  open,
  content,
  error,
  onApply,
}: AiConfirmMenuProps) => {
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    setOpened(open)
  }, [open])

  const handleApply = useCallback(() => {
    onApply?.()
    setOpened(false)
  }, [onApply])

  const handleClose = useCallback(() => {
    setOpened(false)
  }, [])

  return (
    <Menu
      opened={opened}
      withArrow
    >
      <Menu.Target>{children}</Menu.Target>
      <Menu.Dropdown className={cn(styles.dropdown, error && styles.error)}>
        {error ? (
          <ErrorState onClose={handleClose} />
        ) : (
          <SuccessState
            content={content || ''}
            onApply={handleApply}
            onClose={handleClose}
          />
        )}
      </Menu.Dropdown>
    </Menu>
  )
}

export default AiConfirmMenu
