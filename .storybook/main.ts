import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async viteConfig => {
    viteConfig.resolve ??= {};
    viteConfig.resolve.alias = {
      ...viteConfig.resolve.alias,
      '@': path.resolve(process.cwd(), 'src'),
    };
    // Remove PWA and TanStack Router plugins — not needed in Storybook
    viteConfig.plugins = (viteConfig.plugins ?? []).filter(
      p =>
        p &&
        'name' in p &&
        ![
          'vite-plugin-pwa',
          'vite-plugin-pwa:build',
          'vite-plugin-workbox',
          'vite-plugin-info',
          'tanstack-router',
        ].some(n => (p as { name: string }).name?.startsWith(n))
    );
    return viteConfig;
  },
};

export default config;
