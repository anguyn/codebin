import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  isHydrated: boolean;

  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setHydrated: (hydrated: boolean) => void;

  isDark: boolean;
  isLight: boolean;
}

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

const resolveTheme = (theme: ThemeMode): 'light' | 'dark' => {
  return theme === 'system' ? getSystemTheme() : theme;
};

const applyThemeToDOM = (resolvedTheme: 'light' | 'dark') => {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;

  // Remove existing theme classes
  root.classList.remove('light', 'dark');

  // Add new theme class
  root.classList.add(resolvedTheme);

  // Update color-scheme for native elements
  root.style.colorScheme = resolvedTheme;

  // Update meta theme-color for mobile browsers
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute(
      'content',
      resolvedTheme === 'dark' ? '#0f172a' : '#ffffff',
    );
  }
};

const setThemeCookie = (theme: ThemeMode) => {
  if (typeof document === 'undefined') return;

  // Set cookie for SSR - expires in 1 year
  document.cookie = `theme=${theme}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: 'system',
      resolvedTheme: 'light',
      isHydrated: false,

      // Computed properties
      get isDark() {
        return get().resolvedTheme === 'dark';
      },

      get isLight() {
        return get().resolvedTheme === 'light';
      },

      // Actions
      setTheme: (theme: ThemeMode) => {
        const resolvedTheme = resolveTheme(theme);

        // Apply to DOM immediately
        applyThemeToDOM(resolvedTheme);

        // Set cookie for SSR
        setThemeCookie(theme);

        // Update store
        set({ theme, resolvedTheme });
      },

      toggleTheme: () => {
        const { theme, resolvedTheme } = get();
        let newTheme: ThemeMode;

        if (theme === 'system') {
          // If system, toggle to opposite of current resolved theme
          newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
        } else {
          // If manual theme, toggle between light/dark
          newTheme = theme === 'dark' ? 'light' : 'dark';
        }

        get().setTheme(newTheme);
      },

      setHydrated: (isHydrated: boolean) => {
        set({ isHydrated });
      },
    }),
    {
      name: 'bus-theme',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ theme: state.theme }),
      skipHydration: true, // Important for SSR
    },
  ),
);
