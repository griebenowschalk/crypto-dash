import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  HeaderNavigation,
  type HeaderTab,
} from '@/components/layout/HeaderNavigation';

function HeaderNavigationStoryWrapper({
  initialTab = 'dashboard',
}: {
  initialTab?: HeaderTab;
}) {
  const [activeTab, setActiveTab] = useState<HeaderTab>(initialTab);

  return (
    <div className="flex justify-end p-6">
      <HeaderNavigation activeTab={activeTab} onNavigate={setActiveTab} />
    </div>
  );
}

const meta: Meta<typeof HeaderNavigationStoryWrapper> = {
  title: 'Layout/HeaderNavigation',
  component: HeaderNavigationStoryWrapper,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof HeaderNavigationStoryWrapper>;

export const Desktop: Story = {
  args: {
    initialTab: 'dashboard',
  },
};

export const Mobile: Story = {
  args: {
    initialTab: 'markets',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
