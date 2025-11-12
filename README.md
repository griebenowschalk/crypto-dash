# crypto-dash

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://react.dev/)
[![CI](https://github.com/schalkgriebenow/crypto-dash/workflows/CI/badge.svg)](https://github.com/schalkgriebenow/crypto-dash/actions)
[![codecov](https://codecov.io/gh/schalkgriebenow/crypto-dash/branch/main/graph/badge.svg)](https://codecov.io/gh/schalkgriebenow/crypto-dash)

Dashboard for following crypto prices

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Vitest** - Testing framework
- **ESLint** - Linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **GitHub Actions** - CI/CD

## Prerequisites

- Node.js 20 or higher
- npm

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
