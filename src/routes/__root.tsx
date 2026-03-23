import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Header } from '@/components/layout/Header';
import { Container } from '@/components/layout/Container';
import { InstallPrompt } from '@/components/pwa/InstallPrompt';
import { UpdateNotification } from '@/components/pwa/UpdateNotification';

export const Route = createRootRoute({
  component: () => (
    <div className="bg-background text-foreground min-h-screen">
      <InstallPrompt />
      <Container>
        <Header />
        <Outlet />
      </Container>
      <UpdateNotification />
    </div>
  ),
});
