import { NumberInput } from '@mantine/core'

export const numberInputExtends = NumberInput.extend({
  vars: () => ({
    controls: {},
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
