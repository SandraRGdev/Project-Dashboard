import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, Theme } from '../../../core/services/theme/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss']
})
export class ThemeToggleComponent {
  protected readonly themeService = inject(ThemeService);

  // Signals
  protected readonly isDark = this.themeService.isDark;
  protected readonly themeSetting = this.themeService.themeSetting;
  protected readonly showMenu = signal(false);

  // Computed
  protected readonly currentIcon = computed(() => {
    const theme = this.themeSetting();

    if (theme === 'system') {
      return this.isDark() ? 'system-dark' : 'system-light';
    }

    return theme;
  });

  protected readonly menuItems = computed(() => {
    const current = this.themeSetting();

    return [
      { value: 'light' as Theme, label: 'Claro', icon: 'sun', active: current === 'light' },
      { value: 'dark' as Theme, label: 'Oscuro', icon: 'moon', active: current === 'dark' },
      { value: 'system' as Theme, label: 'Sistema', icon: 'system', active: current === 'system' }
    ];
  });

  // Actions
  protected toggleTheme(): void {
    if (this.showMenu()) {
      this.showMenu.set(false);
    } else {
      this.themeService.toggleTheme();
    }
  }

  protected showMenuHandler(): void {
    this.showMenu.set(true);
  }

  protected hideMenu(): void {
    // Small delay to allow click to register
    setTimeout(() => this.showMenu.set(false), 150);
  }

  protected selectTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
    this.showMenu.set(false);
  }

  protected getIconPath(icon: string): string {
    const paths: Record<string, string> = {
      'sun': 'M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z',
      'moon': 'M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z',
      'system': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'
    };

    return paths[icon] || paths['system'];
  }
}
