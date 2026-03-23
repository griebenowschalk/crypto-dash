import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Logo } from './Logo';

export const Header = () => {
  const pathname =
    typeof window !== 'undefined' ? window.location.pathname : '/dashboard';
  const initialTab = pathname.startsWith('/settings')
    ? 'settings'
    : 'dashboard';
  const [activeTab, setActiveTab] = useState<'dashboard' | 'settings'>(
    initialTab
  );

  const styles = (tab: 'dashboard' | 'settings') =>
    cn(
      'h-auto p-2',
      activeTab === tab &&
        'text-primary scale-110 font-bold transition-all duration-300'
    );

  return (
    <header className="grid grid-cols-[1fr_auto_auto] items-center gap-4 py-8">
      <a href="/">
        {/* <img
          src="/src/assets/logo-horizontal-icon.svg"
          alt="CryptoDash"
          className="h-12 w-auto"
          loading="lazy"
        /> */}
        <Logo />
      </a>
      <Button
        variant="ghost"
        className={cn('h-auto p-2', styles('dashboard'))}
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
        className={cn('h-auto p-2', styles('settings'))}
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
