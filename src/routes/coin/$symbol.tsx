import { createFileRoute } from '@tanstack/react-router';
import { CoinDetail } from '@/pages/CoinDetail';

export const Route = createFileRoute('/coin/$symbol')({
  component: CoinDetail,
});
