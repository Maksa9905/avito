import { Box, Image } from '@mantine/core'

import { cn } from '@/shared/utils/cn'

import styles from './ItemImage.module.css'

type ItemImageProps = {
  className?: string
  images: string[]
}

const ItemImage = ({ className, images }: ItemImageProps) => {
  if (images.length === 0) return null

  const mainImage = images[0]
  const thumbs = images.slice(1)

  return (
    <Box className={cn(styles.container, className)}>
      <Image
        className={styles.main}
        src={mainImage}
      />
      <Box className={styles.thumbsContainer}>
        <Box className={styles.thumbs}>
          {thumbs.map((image) => (
            <Image
              key={image}
              className={styles.thumb}
              src={image}
            />
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default ItemImage
