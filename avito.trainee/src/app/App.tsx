import '@mantine/core/styles.css'

import { Button, MantineProvider } from '@mantine/core'
import theme from './theme'

function App() {
  return (
    <MantineProvider theme={theme}>
      <Button>123</Button>
    </MantineProvider>
  )
}

export default App
