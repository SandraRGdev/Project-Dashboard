import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AvatarComponent } from '../../shared/ui/avatar/avatar.component';
import { ThemeToggleComponent } from '../../shared/ui/theme-toggle/theme-toggle.component';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: Date;
  read: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, AvatarComponent, ThemeToggleComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  protected readonly router = inject(Router);

  // State
  protected readonly notifications = signal<Notification[]>([
    { id: 1, title: 'Tarea completada', message: 'Carlos completó "Diseñar wireframes"', time: new Date(), read: false },
    { id: 2, title: 'Nuevo comentario', message: 'María comentó en "Integración API"', time: new Date(Date.now() - 3600000), read: false },
    { id: 3, title: 'Proyecto actualizado', message: 'Rediseño Portal alcanzó 65%', time: new Date(Date.now() - 7200000), read: true }
  ]);

  protected readonly showNotifications = signal(false);
  protected readonly showUserMenu = signal(false);
  protected readonly currentUser = signal({
    name: 'Ana Martínez',
    email: 'ana.martinez@projectops.com',
    role: 'Tech Lead',
    avatar: 'AM'
  });

  // Computed
  protected readonly unreadCount = computed(() =>
    this.notifications().filter(n => !n.read).length
  );

  protected readonly pageTitle = computed(() => {
    const url = this.router.url;
    const titles: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/projects': 'Proyectos',
      '/tasks': 'Tareas',
      '/team': 'Equipo'
    };

    for (const [path, title] of Object.entries(titles)) {
      if (url === path || url.startsWith(path + '/')) {
        return title;
      }
    }

    return 'ProjectOps';
  });

  // Actions
  protected toggleNotifications(): void {
    this.showNotifications.update(show => !show);
    this.showUserMenu.set(false);
  }

  protected toggleUserMenu(): void {
    this.showUserMenu.update(show => !show);
    this.showNotifications.set(false);
  }

  protected markAsRead(id: number): void {
    this.notifications.update(notifs =>
      notifs.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }

  protected markAllAsRead(): void {
    this.notifications.update(notifs =>
      notifs.map(n => ({ ...n, read: true }))
    );
  }

  protected logout(): void {
    this.router.navigate(['/auth/login']);
  }

  protected formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes}m`;
    if (hours < 24) return `Hace ${hours}h`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  }
}
