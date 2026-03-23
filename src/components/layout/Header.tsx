import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Logo } from './Logo';

export const Header = () => {
  const pathname =
    typeof window !== 'undefined' ? window.location.pathname : '/dashboard';
  const initialTab = pathname.startsWith('/settings')
    ? 'settings'
    : pathname.startsWith('/markets')
      ? 'markets'
      : 'dashboard';
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'markets' | 'settings'
  >(initialTab);

  const styles = (tab: 'dashboard' | 'markets' | 'settings') =>
    cn(
      'h-auto p-2',
      activeTab === tab &&
        'text-primary scale-110 font-bold transition-all duration-300'
    );

  return (
    <header className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2 py-8 sm:gap-4">
      <a href="/" aria-label="CryptoDash">
        <Logo />
      </a>

      <Button
        variant="ghost"
        className={styles('dashboard')}
        onClick={() => {
          setActiveTab('dashboard');
          if (window.location.pathname !== '/dashboard') {
            window.location.assign('/dashboard');
          }
        }}
      >
        Dashboard
      </Button>
      <Button
        variant="ghost"
        className={styles('markets')}
        onClick={() => {
          setActiveTab('markets');
          if (window.location.pathname !== '/markets') {
            window.location.assign('/markets');
          }
        }}
      >
        Markets
      </Button>
      <Button
        variant="ghost"
        className={styles('settings')}
        onClick={() => {
          setActiveTab('settings');
          if (window.location.pathname !== '/settings') {
            window.location.assign('/settings');
          }
        }}
      >
        Settings
      </Button>
    </header>
  );
};
