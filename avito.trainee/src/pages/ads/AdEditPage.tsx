import { Link, useParams } from 'react-router-dom'
import { Stack, Text, Title } from '@mantine/core'

export function AdEditPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <Stack p="md" gap="md">
      <Title order={2}>Редактирование #{id}</Title>
      <Text c="dimmed">Форма редактирования (/ads/:id/edit)</Text>
      <Link to={id ? `/ads/${id}` : '/ads'}>
        К просмотру
      </Link>
      <Link to="/ads">К списку</Link>
    </Stack>
  )
}
