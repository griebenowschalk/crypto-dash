export type Theme = 'light' | 'dark' | 'system'

const THEME_STORAGE_KEY = 'theme'

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function getStoredTheme(): Theme {
  return (localStorage.getItem(THEME_STORAGE_KEY) as Theme) || 'system'
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  const isDark =
    theme === 'dark' || (theme === 'system' && getSystemTheme() === 'dark')

  if (isDark) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export function getTheme(): Theme {
  return getStoredTheme()
}

export function setTheme(theme: Theme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme)
  applyTheme(theme)
}

export function initTheme() {
  const theme = getStoredTheme()
  applyTheme(theme)

  // Listen for system theme changes
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => {
      const stored = getStoredTheme()
      if (stored === 'system') {
        applyTheme('system')
      }
    })
}
