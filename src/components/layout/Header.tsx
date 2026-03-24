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

  const handleNavigate = (tab: HeaderTab) => {
    setActiveTab(tab);
    const targetPath = `/${tab}`;
    if (window.location.pathname !== targetPath) {
      window.location.assign(targetPath);
    }
  };

  return (
    <header className="grid grid-cols-[1fr_auto] items-center gap-2 py-8 sm:gap-4">
      <a href="/" aria-label="CryptoDash">
        <Logo />
      </a>

      <HeaderNavigation activeTab={activeTab} onNavigate={handleNavigate} />
    </header>
  );
};
