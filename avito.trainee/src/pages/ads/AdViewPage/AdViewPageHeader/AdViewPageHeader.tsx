import { Button, Box, Title, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useGetItemByIdQuery } from '@/features/item-editing'
import { useNavigate, useParams } from 'react-router-dom'
import EditIcon from '@/shared/icons/EditIcon'
import { formatDayMonthTime } from '@/shared/utils/formatDayMonthTime'
import { useCallback, useMemo } from 'react'

import styles from '../AdViewPage.module.css'

const AdViewPageHeader = () => {
  const { t, i18n } = useTranslation('ads')

  const navigate = useNavigate()

  const locale = i18n.resolvedLanguage ?? i18n.language

  const { id } = useParams<{ id: string }>()
  const { data: item } = useGetItemByIdQuery(id)

  const publishedLabel = useMemo(() => {
    const date = formatDayMonthTime(item?.createdAt, locale)

    return date ? t('viewPage.publishedAt', { date }) : ''
  }, [item?.createdAt, locale, t])

  const editedLabel = useMemo(() => {
    const date = formatDayMonthTime(item?.updatedAt, locale)

    return date ? t('viewPage.editedAt', { date }) : ''
  }, [item?.updatedAt, locale, t])

  const handleEdit = useCallback(() => {
    navigate(`/ads/${id}/edit`)
  }, [id, navigate])

  const handleGoBack = useCallback(() => {
    navigate(-1)
  }, [navigate])

  return (
    <Box
      component="header"
      className={styles.header}
    >
      <Title
        className={styles.title}
        order={1}
      >
        {item?.title}
      </Title>
      <Button
        className={styles.edit}
        rightSection={<EditIcon />}
        onClick={handleEdit}
      >
        Редактировать
      </Button>
      <Box
        component="span"
        className={styles.price}
      >
        {item?.price}₽
      </Box>
      <Box className={styles.timestamps}>
        <Text>{publishedLabel}</Text>
        <Text>{editedLabel}</Text>
      </Box>
      <Button
        variant="transparent"
        color="gray"
        onClick={handleGoBack}
        size="sm"
        className={styles.goback}
      >
        ← Вернуться к списку
      </Button>
    </Box>
  )
}

export default AdViewPageHeader
