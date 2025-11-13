# crypto-dash

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.17-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![CI](https://github.com/schalkgriebenow/crypto-dash/actions/workflows/cy.yml/badge.svg)](https://github.com/schalkgriebenow/crypto-dash/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/schalkgriebenow/crypto-dash/badge.svg)](https://codecov.io/gh/schalkgriebenow/crypto-dash)

Dashboard for following crypto prices

## Tech Stack

- **React 19.2.0** - UI library
- **TypeScript 5.9.3** - Type safety
- **Vite 7.2.2** - Build tool and dev server
- **Tailwind CSS 4.1.17** - Utility-first CSS framework
- **shadcn/ui** - Re-usable component library
- **Recharts 2.15.4** - Charting library
- **Vitest 4.0.8** - Testing framework
- **ESLint 9.39.1** - Linting
- **Prettier 3.6.2** - Code formatting (with Tailwind plugin)
- **Husky 9.1.7** - Git hooks
- **GitHub Actions** - CI/CD

## Features

- **Modern UI** - Built with Tailwind CSS v4 and shadcn/ui components
- **Dark Mode** - Full dark/light theme support with system preference detection
- **Charts** - Interactive charts powered by Recharts
- **Accessible** - WCAG compliant color contrasts and semantic HTML
- **Type Safe** - Full TypeScript coverage
- **Tested** - Comprehensive test coverage with Vitest
- **Fast** - Optimized builds with Vite

## Prerequisites

- Node.js 22 or higher
- npm 11 or higher

## Setup

1. Install dependencies:

```bash
npm install
```

2. Set up Husky (if not already initialized):

```bash
npx husky init
```

3. For Codecov integration, add your Codecov token as a GitHub secret:
   - Go to your repository settings on GitHub
   - Navigate to Secrets and variables → Actions
   - Add a new secret named `CODECOV_TOKEN` with your Codecov token

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report

## Development Workflow

1. Create a feature branch
2. Make your changes
3. Pre-commit hook will automatically:
   - Run ESLint and Prettier on staged files
   - Format Tailwind classes with prettier-plugin-tailwindcss
4. Pre-push hook will automatically:
   - Run TypeScript type checking
5. Push your changes
6. CI will run:
   - Linting
   - Type checking
   - Tests with coverage
   - Upload coverage to Codecov

## License

MIT
