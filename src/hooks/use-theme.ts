import { useEffect, useState } from 'react'
import { getTheme, setTheme, initTheme, type Theme } from '@/lib/theme'

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => getTheme())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    initTheme()
    // avoiding cascading renders
    Promise.resolve().then(() => {
      setMounted(true)
      setThemeState(getTheme())
    })
  }, [])

  const updateTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    setThemeState(newTheme)
  }

  return {
    theme,
    setTheme: updateTheme,
    mounted,
  }
}
