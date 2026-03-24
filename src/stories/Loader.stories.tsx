import type { Meta, StoryObj } from '@storybook/react';
import { Loader } from '@/components/layout/Loader';

const meta: Meta<typeof Loader> = {
  title: 'Layout/Loader',
  component: Loader,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Loader>;

export const Default: Story = {};
