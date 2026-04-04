import { Button, Dialog, Group, Stack, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import type { ItemEditRestoreDraftDialogControl } from '../../model/useFormValuesAutosave'

type ItemEditDraftRestoreDialogProps = ItemEditRestoreDraftDialogControl

const ItemEditDraftRestoreDialog = ({
  opened,
  onRestore,
  onDiscard,
}: ItemEditDraftRestoreDialogProps) => {
  const { t } = useTranslation('ads')

  return (
    <Dialog
      opened={opened}
      onClose={onDiscard}
      size="md"
      withCloseButton
    >
      <Stack gap="md">
        <Text size="sm">{t('editPage.draftRestore.description')}</Text>
        <Group justify="flex-end">
          <Button
            variant="default"
            size="sm"
            onClick={onDiscard}
          >
            {t('editPage.draftRestore.discard')}
          </Button>
          <Button
            size="sm"
            onClick={onRestore}
          >
            {t('editPage.draftRestore.restore')}
          </Button>
        </Group>
      </Stack>
    </Dialog>
  )
}

export default ItemEditDraftRestoreDialog
