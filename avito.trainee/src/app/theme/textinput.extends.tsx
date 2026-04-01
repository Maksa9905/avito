import { TextInput } from '@mantine/core'

export const textInputExtends = TextInput.extend({
  vars: () => ({
    wrapper: {
      '--input-height': '32px',
    },
  }),
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
