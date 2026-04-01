import { Menu, X } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type HeaderTab = 'dashboard' | 'markets' | 'settings';

interface HeaderNavigationProps {
  activeTab: HeaderTab;
  onNavigate: (tab: HeaderTab) => void;
}

const NAV_ITEMS: Array<{ tab: HeaderTab; label: string }> = [
  { tab: 'dashboard', label: 'Dashboard' },
  { tab: 'markets', label: 'Markets' },
  { tab: 'settings', label: 'Settings' },
];

export function HeaderNavigation({
  activeTab,
  onNavigate,
}: HeaderNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const styles = (tab: HeaderTab) =>
    cn(
      'h-auto p-2',
      activeTab === tab &&
        'text-primary scale-110 font-bold transition-all duration-300'
    );

  return (
    <nav className="relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      <div
        className={cn(
          'bg-background absolute top-full right-0 z-30 mt-2 hidden min-w-44 flex-col rounded-lg border p-2 shadow-lg',
          isOpen && 'flex',
          'md:static md:mt-0 md:flex md:min-w-0 md:flex-row md:items-center md:gap-2 md:border-0 md:bg-transparent md:p-0 md:shadow-none'
        )}
      >
        {NAV_ITEMS.map(item => (
          <Button
            key={item.tab}
            variant="ghost"
            asChild
            className={styles(item.tab)}
          >
            <Link
              to={`/${item.tab}`}
              onClick={() => {
                onNavigate(item.tab);
                setIsOpen(false);
              }}
            >
              {item.label}
            </Link>
          </Button>
        ))}
      </div>
    </nav>
  );
}
