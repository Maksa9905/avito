import '@mantine/core/styles.css'

import { MantineProvider } from '@mantine/core'
import theme from './theme/theme'

function App() {
  return <MantineProvider theme={theme}></MantineProvider>
}

export default App
