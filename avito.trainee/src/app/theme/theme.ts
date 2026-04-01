import { createTheme } from '@mantine/core'
import { buttonExtends } from './button.extends'
import { textInputExtends } from './textinput.extends'
import { selectExtends } from './select.extends'

const theme = createTheme({
  black: '#262626',
  white: '#ffffff',
  cursorType: 'pointer',
  primaryColor: 'blue',
  primaryShade: {
    light: 5,
    dark: 8,
  },
  autoContrast: true,
  fontFamily: 'Roboto, sans-serif',
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px',
  },
  fontWeights: {
    medium: '500',
    regular: '400',
    bold: '700',
  },
  lineHeights: {
    xs: '16px',
    sm: '20px',
    md: '24px',
    lg: '28px',
    xl: '32px',
  },
  breakpoints: {
    xs: '576px',
    sm: '768px',
    md: '992px',
    lg: '1200px',
    xl: '1400px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
  },
  radius: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
  },
  defaultRadius: '8px',
  colors: {
    blue: [
      '#e1f7ff',
      '#cbe9ff',
      '#98cfff',
      '#62b5ff',
      '#369eff',
      '#1890ff',
      '#0089ff',
      '#0076e5',
      '#0069ce',
      '#005ab7',
    ],
    red: [
      '#ffeaeb',
      '#fdd5d6',
      '#f1abac',
      '#e77d7f',
      '#de5658',
      '#db4648',
      '#d83033',
      '#bf2226',
      '#ac1b20',
      '#970f19',
    ],
  },
  components: {
    Button: buttonExtends,
    TextInput: textInputExtends,
    Select: selectExtends,
  },
})

export default theme
