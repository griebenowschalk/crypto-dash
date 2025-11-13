import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/use-theme'
import { Button } from './ui/button'

export function ThemeToggle() {
  const { theme, setTheme, mounted } = useTheme()

  if (!mounted) {
    return null
  }

  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <Button
      variant="secondary"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="hover:bg-accent hover:text-accent-foreground inline-flex cursor-pointer items-center justify-center rounded-md border-none p-4"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  )
}
