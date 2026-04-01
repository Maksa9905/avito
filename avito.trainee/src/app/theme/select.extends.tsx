import CaretDownIcon from '@/shared/icons/CaretDownIcon'
import { Select } from '@mantine/core'

export const selectExtends = Select.extend({
  vars: () => ({
    wrapper: {
      '--input-height': '32px',
    },
  }),
  defaultProps: {
    rightSection: <CaretDownIcon />,
  },
})
