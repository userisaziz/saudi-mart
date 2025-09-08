export const theme = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554'
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a'
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d'
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f'
    },
    danger: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d'
    }
  },
  borderRadius: {
    sm: '6px',
    md: '10px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px'
  },
  shadows: {
    soft: '0 2px 8px rgba(0, 0, 0, 0.06)',
    medium: '0 4px 12px rgba(0, 0, 0, 0.1)',
    deep: '0 8px 24px rgba(0, 0, 0, 0.15)',
    glow: '0 0 20px rgba(59, 130, 246, 0.3)'
  },
  spacing: {
    sidebar: '280px',
    sidebarCollapsed: '80px',
    header: '64px',
    containerPadding: '24px'
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
} as const

export type Theme = typeof theme
export type ThemeColor = keyof typeof theme.colors
export type ColorShade = keyof typeof theme.colors.primary

export const getColorValue = (color: ThemeColor, shade: ColorShade = 500): string => {
  const colorPalette = theme.colors[color] as Record<number, string>
  return colorPalette[shade] || theme.colors.primary[500]
}

export class ThemeManager {
  private static instance: ThemeManager
  private currentTheme: 'light' | 'dark' = 'light'
  private listeners: ((theme: 'light' | 'dark') => void)[] = []

  static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager()
    }
    return ThemeManager.instance
  }

  constructor() {
    this.initializeTheme()
  }

  private initializeTheme(): void {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    
    this.currentTheme = storedTheme || systemTheme
    this.applyTheme(this.currentTheme)
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.setTheme(e.matches ? 'dark' : 'light')
      }
    })
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.currentTheme = theme
    this.applyTheme(theme)
    localStorage.setItem('theme', theme)
    this.listeners.forEach(listener => listener(theme))
  }

  getTheme(): 'light' | 'dark' {
    return this.currentTheme
  }

  toggleTheme(): void {
    this.setTheme(this.currentTheme === 'light' ? 'dark' : 'light')
  }

  subscribe(listener: (theme: 'light' | 'dark') => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }
}

export const useTheme = () => {
  const themeManager = ThemeManager.getInstance()
  
  return {
    theme: themeManager.getTheme(),
    setTheme: themeManager.setTheme.bind(themeManager),
    toggleTheme: themeManager.toggleTheme.bind(themeManager),
    subscribe: themeManager.subscribe.bind(themeManager)
  }
}