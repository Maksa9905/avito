import { Button, type ButtonSize, type MantineTheme } from '@mantine/core'

const getButtonStylesBySize = (theme: MantineTheme, size?: ButtonSize) => {
  switch (size) {
    case 'md':
      return {
        root: {
          height: '32px',
          padding: '5px 11.5px',
        },
        label: {
          fontSize: '14px',
          lineHeight: '22px',
          fontWeight: theme.fontWeights.regular,
        },
      }
    case 'sm':
      return {
        root: {
          height: '22px',
          padding: '0px 7px',
        },
        label: {
          fontSize: '14px',
          lineHeight: '22px',
          fontWeight: theme.fontWeights.regular,
        },
      }
    default:
      return {
        root: {
          height: '38px',
          padding: '8px 12px',
        },
        label: {
          fontSize: '16px',
          lineHeight: '1.4',
          fontWeight: theme.fontWeights.regular,
        },
      }
  }
}

export const buttonExtends = Button.extend({
  styles: (theme, props) => {
    const buttonStyles = getButtonStylesBySize(theme, props.size)

    return {
      root: buttonStyles.root,
      label: buttonStyles.label,
    }
  },
})
