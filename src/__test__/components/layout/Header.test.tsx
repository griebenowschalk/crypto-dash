import type { ReactNode } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from '@/components/layout/Header';

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    children,
    to,
    ...rest
  }: {
    children: ReactNode;
    to: string;
  } & Record<string, unknown>) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),
}));

describe('Header', () => {
  it('renders logo link and nav labels', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: /cryptodash/i })).toHaveAttribute(
      'href',
      '/'
    );
    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute(
      'href',
      '/dashboard'
    );
    expect(screen.getByRole('link', { name: /markets/i })).toHaveAttribute(
      'href',
      '/markets'
    );
    expect(screen.getByRole('link', { name: /settings/i })).toHaveAttribute(
      'href',
      '/settings'
    );
  });

  it('activates Settings when clicked', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const settings = screen.getByRole('link', { name: /settings/i });
    await user.click(settings);

    expect(settings.className).toMatch(/font-bold/);
  });

  it('toggles mobile burger menu state', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const toggle = screen.getByRole('button', {
      name: /open navigation menu/i,
    });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggle);
    expect(
      screen.getByRole('button', { name: /close navigation menu/i })
    ).toHaveAttribute('aria-expanded', 'true');
  });
});
