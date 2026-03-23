import { useState } from 'react';
import { Download, X } from 'lucide-react';
import usePWAInstall from '@/hooks/usePWAInstall';

export function InstallPrompt() {
  const { canInstall, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  if (!canInstall || dismissed) return null;

  return (
    <div className="bg-primary/10 border-primary/20 flex items-center justify-between border-b px-4 py-2.5 text-sm">
      <div className="flex items-center gap-2">
        <Download className="text-primary h-4 w-4 shrink-0" />
        <span>
          Add <strong>CryptoDash</strong> to your home screen for quick access.
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={install}
          className="text-primary hover:text-primary/80 font-medium transition-colors"
        >
          Install
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="text-muted-foreground hover:text-foreground rounded p-0.5 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
