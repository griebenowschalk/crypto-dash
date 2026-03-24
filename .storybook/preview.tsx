import type { Preview, Decorator } from '@storybook/react';
import {
  RouterProvider,
  createRouter,
  createMemoryHistory,
  createRootRoute,
  createRoute,
} from '@tanstack/react-router';
import '../src/index.css';

const withRouter: Decorator = Story => {
  // Build the route tree inside the decorator so the root component can close over Story
  const rootRoute = createRootRoute({ component: Story });
  const coinRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/coin/$symbol',
    component: () => <></>,
  });
  const routeTree = rootRoute.addChildren([coinRoute]);
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ['/'] }),
  });
  return <RouterProvider router={router} />;
};

const withDarkMode: Decorator = Story => {
  document.documentElement.classList.add('dark');
  return <Story />;
};

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: 'oklch(0.18 0.08 250)' },
        { name: 'light', value: 'oklch(0.96 0 0)' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [withRouter, withDarkMode],
};

export default preview;
