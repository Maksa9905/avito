import { cn } from '@/shared/utils/cn'
import styles from './IconButton.module.css'

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

const IconButton = ({ children, className, ...props }: IconButtonProps) => {
  return (
    <button
      className={cn(styles.button, className)}
      {...props}
    >
      {children}
    </button>
  )
}

export default IconButton
