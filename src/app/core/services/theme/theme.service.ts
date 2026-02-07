import { Injectable, signal, computed, effect } from '@angular/core';

export type Theme = 'light' | 'dark' | 'system';

const THEME_KEY = 'projectops-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  // State signals
  private readonly _storedTheme = signal<Theme>(this.getStoredTheme());
  private readonly _systemPrefersDark = signal<boolean>(this.getSystemTheme());

  // Current resolved theme
  readonly currentTheme = computed<'light' | 'dark'>(() => {
    const stored = this._storedTheme();

    if (stored === 'system') {
      return this._systemPrefersDark() ? 'dark' : 'light';
    }

    return stored;
  });

  // Is dark mode active
  readonly isDark = computed(() => this.currentTheme() === 'dark');

  // Stored theme setting (may be 'system')
  readonly themeSetting = signal<Theme>(this.getStoredTheme());

  constructor() {
    // Apply theme on change
    effect(() => {
      const theme = this.currentTheme();
      this.applyTheme(theme);
    });

    // Listen for system theme changes
    this.watchSystemTheme();
  }

  // ============ PUBLIC METHODS ============

  setTheme(theme: Theme): void {
    this._storedTheme.set(theme);
    this.themeSetting.set(theme);
    this.saveTheme(theme);
  }

  toggleTheme(): void {
    if (this._storedTheme() === 'system') {
      // If on system, switch to opposite of current
      this.setTheme(this.isDark() ? 'light' : 'dark');
    } else {
      // Toggle between light and dark
      this.setTheme(this._storedTheme() === 'light' ? 'dark' : 'light');
    }
  }

  cycleTheme(): void {
    const themes: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(this._storedTheme());
    const nextIndex = (currentIndex + 1) % themes.length;
    this.setTheme(themes[nextIndex]);
  }

  // ============ PRIVATE METHODS ============

  private getStoredTheme(): Theme {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
    return 'system'; // Default
  }

  private saveTheme(theme: Theme): void {
    localStorage.setItem(THEME_KEY, theme);
  }

  private getSystemTheme(): boolean {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return false;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark');
    } else {
      root.setAttribute('data-theme', 'light');
      root.classList.remove('dark');
    }
  }

  private watchSystemTheme(): void {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Use addListener for older browsers, addEventListener for newer
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      this._systemPrefersDark.set('matches' in e ? e.matches : false);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
    } else {
      // @ts-ignore - older browsers
      mediaQuery.addListener(handler);
    }
  }
}
