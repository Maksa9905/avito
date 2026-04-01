import styles from './IconButton.module.css'

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

const IconButton = ({ children, ...props }: IconButtonProps) => {
  return (
    <button
      className={styles.button}
      {...props}
    >
      {children}
    </button>
  )
}

export default IconButton
