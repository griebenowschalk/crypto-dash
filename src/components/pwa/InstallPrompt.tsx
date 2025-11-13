import { usePWAInstall } from '@/hooks/usePWAInstall';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export function InstallPrompt() {
  const { canInstall, install } = usePWAInstall();

  if (!canInstall) return null;

  return (
    <Button onClick={install} variant="outline" className="gap-2">
      <Download className="h-4 w-4" />
      Install App
    </Button>
  );
}
