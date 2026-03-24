import type { Meta, StoryObj } from '@storybook/react';
import { Sparkline } from '@/components/crypto/Sparkline';
import type { HistoricalDataPoint } from '@/types/crypto';

const meta: Meta<typeof Sparkline> = {
  title: 'Crypto/Sparkline',
  component: Sparkline,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Sparkline>;

const upwardData: HistoricalDataPoint[] = Array.from(
  { length: 30 },
  (_, i) => ({
    time: Date.now() / 1000 - (30 - i) * 3600,
    open: 40000 + i * 200,
    high: 40200 + i * 200,
    low: 39800 + i * 200,
    close: 40000 + i * 250 + Math.sin(i) * 300,
    volumefrom: 100,
    volumeto: 100,
  })
);

const downwardData: HistoricalDataPoint[] = Array.from(
  { length: 30 },
  (_, i) => ({
    time: Date.now() / 1000 - (30 - i) * 3600,
    open: 45000 - i * 200,
    high: 45200 - i * 200,
    low: 44800 - i * 200,
    close: 45000 - i * 250 + Math.sin(i) * 300,
    volumefrom: 100,
    volumeto: 100,
  })
);

export const Positive: Story = {
  args: {
    data: upwardData,
    positive: true,
  },
};

export const Negative: Story = {
  args: {
    data: downwardData,
    positive: false,
  },
};

export const Empty: Story = {
  args: {
    data: [],
    positive: true,
  },
};
