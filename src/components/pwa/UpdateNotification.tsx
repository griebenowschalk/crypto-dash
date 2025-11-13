import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function UpdateNotification() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      let refreshing = false;

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });

      const checkForUpdates = async () => {
        const registration = await navigator.serviceWorker.getRegistration();
        if (!registration) return;

        registration.addEventListener('updatefound', () => {
          setUpdateAvailable(true);
        });

        // Check for updates every hour
        setInterval(
          () => {
            registration.update();
          },
          60 * 60 * 1000
        );
      };

      checkForUpdates();
    }
  }, []);

  const handleUpdate = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration?.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    }
  };

  if (!updateAvailable) return null;

  return (
    <Card className="fixed right-4 bottom-4 z-50 p-4 shadow-lg">
      <div className="flex items-center gap-4">
        <p className="text-sm">Update available</p>
        <Button onClick={handleUpdate} size="sm">
          Reload
        </Button>
      </div>
    </Card>
  );
}
