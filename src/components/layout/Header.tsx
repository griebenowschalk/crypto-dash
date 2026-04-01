import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import type { HeaderTab } from './HeaderNavigation';
import { HeaderNavigation } from './HeaderNavigation';
import { Logo } from './Logo';

export const Header = () => {
  const pathname =
    typeof window !== 'undefined' ? window.location.pathname : '/dashboard';
  const initialTab = pathname.startsWith('/settings')
    ? 'settings'
    : pathname.startsWith('/markets')
      ? 'markets'
      : 'dashboard';
  const [activeTab, setActiveTab] = useState<HeaderTab>(initialTab);

  return (
    <header className="grid grid-cols-[1fr_auto] items-center gap-2 py-8 sm:gap-4">
      <Link to="/" aria-label="CryptoDash">
        <Logo />
      </Link>

      <HeaderNavigation activeTab={activeTab} onNavigate={setActiveTab} />
    </header>
  );
};
