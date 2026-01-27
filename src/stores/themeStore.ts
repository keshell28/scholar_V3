import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeMode = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeStore {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: ResolvedTheme) {
  const root = document.documentElement;
  
  // Add transition class for smooth theme switching
  root.classList.add('theme-transitioning');
  
  if (theme === 'dark') {
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }
  
  // Remove transition class after animation
  setTimeout(() => root.classList.remove('theme-transitioning'), 300);
}

function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === 'system') {
    return getSystemTheme();
  }
  return mode;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => {
      // Listen for system theme changes
      if (typeof window !== 'undefined') {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
          const { mode } = get();
          if (mode === 'system') {
            const newTheme = e.matches ? 'dark' : 'light';
            applyTheme(newTheme);
            set({ resolvedTheme: newTheme });
          }
        };
        
        // Modern browsers
        if (mediaQuery.addEventListener) {
          mediaQuery.addEventListener('change', handleSystemThemeChange);
        } else {
          // Legacy browsers
          mediaQuery.addListener(handleSystemThemeChange);
        }
      }
      
      return {
        mode: 'system',
        resolvedTheme: getSystemTheme(),
        
        setMode: (mode: ThemeMode) => {
          const resolved = resolveTheme(mode);
          applyTheme(resolved);
          set({ mode, resolvedTheme: resolved });
        },
        
        toggleMode: () => {
          const { mode } = get();
          let newMode: ThemeMode;
          
          // Cycle through: system → light → dark → system
          if (mode === 'system') {
            newMode = 'light';
          } else if (mode === 'light') {
            newMode = 'dark';
          } else {
            newMode = 'system';
          }
          
          const resolved = resolveTheme(newMode);
          applyTheme(resolved);
          set({ mode: newMode, resolvedTheme: resolved });
        },
      };
    },
    {
      name: 'scholar-theme-storage',
      partialize: (state) => ({ mode: state.mode }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const resolved = resolveTheme(state.mode);
          applyTheme(resolved);
          state.resolvedTheme = resolved;
        }
      },
    }
  )
);
