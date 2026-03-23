import { Muted } from '@/components/typography';
import { Logo } from './Logo';

export function Loader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center overflow-hidden">
      <div className="flex flex-col items-center gap-4">
        <Logo className="animate-pulse" />
        <Muted className="mt-0">Loading...</Muted>
      </div>
    </div>
  );
}
