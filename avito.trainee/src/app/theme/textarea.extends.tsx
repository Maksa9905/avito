import { Textarea } from '@mantine/core'

export const textareaExtends = Textarea.extend({
  styles: () => ({
    error: {
      marginTop: '8px',
    },
    label: {
      marginBottom: '8px',
      lineHeight: '22px',
    },
  }),
})
