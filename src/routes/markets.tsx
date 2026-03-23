import { createFileRoute } from '@tanstack/react-router';
import { Markets } from '@/pages/Markets';

export const Route = createFileRoute('/markets')({
  component: Markets,
});
