import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '@/App';

describe('App', () => {
  it('renders welcome heading', async () => {
    render(<App />);
    expect(
      await screen.findByRole('heading', { name: /welcome to cryptodash/i })
    ).toBeInTheDocument();
  });

  it('renders the dashboard description', async () => {
    render(<App />);
    expect(
      await screen.findByText('Dashboard for following crypto prices.')
    ).toBeInTheDocument();
  });
});
