import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the crypto dash heading', () => {
    render(<App />)
    expect(screen.getByText('Crypto Dash')).toBeInTheDocument()
  })

  it('renders the dashboard description', () => {
    render(<App />)
    expect(
      screen.getByText('Dashboard for following crypto prices.')
    ).toBeInTheDocument()
  })
})
