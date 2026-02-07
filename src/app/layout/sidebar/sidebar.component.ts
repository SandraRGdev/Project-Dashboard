import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NAV_ITEMS, ICON_PATHS } from '../navigation-items';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  protected readonly router = inject(Router);

  // State
  protected readonly navItems = signal(NAV_ITEMS);
  protected readonly isCollapsed = signal(false);
  protected readonly currentRoute = signal(this.router.url);

  // Computed
  protected readonly iconPaths = ICON_PATHS;
  protected readonly sidebarClass = computed(() => ({
    'sidebar': true,
    'sidebar--collapsed': this.isCollapsed()
  }));

  ngOnInit(): void {
    // Listen to route changes
    this.router.events.subscribe(() => {
      this.currentRoute.set(this.router.url);
    });
  }

  protected toggleCollapse(): void {
    this.isCollapsed.update(collapsed => !collapsed);
  }

  protected isActive(route: string): boolean {
    return this.currentRoute() === route ||
           this.currentRoute().startsWith(route + '/');
  }

  protected getBadgeValue(item: typeof NAV_ITEMS[0]): string | number {
    const badge = item.badge;
    if (typeof badge === 'function') {
      return badge();
    }
    return badge || '';
  }
}
