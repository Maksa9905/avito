import { render } from '@testing-library/react'
import App from './App.tsx'

describe('App', () => {
  it('рендерится без ошибок', () => {
    const { container } = render(<App />)
    expect(container).toBeInTheDocument()
  })
})
