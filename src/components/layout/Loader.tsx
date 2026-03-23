import { Logo } from './Logo';

export function Loader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Logo className="animate-pulse" />
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    </div>
  );
}
