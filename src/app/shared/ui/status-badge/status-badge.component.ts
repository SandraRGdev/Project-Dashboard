import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Status } from '../../../core/models/status.enum';

type BadgeVariant = 'status' | 'priority' | 'custom';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.scss']
})
export class StatusBadgeComponent {
  // Inputs
  readonly status = input<Status | string>('');
  readonly label = input<string>('');
  readonly color = input<string>('');
  readonly variant = input<BadgeVariant>('status');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly rounded = input<boolean>(false);

  // Computed
  protected readonly badgeStyle = computed(() => {
    const variant = this.variant();
    const status = this.status();
    const customColor = this.color();

    if (variant === 'custom' && customColor) {
      return {
        backgroundColor: `${customColor}15`,
        color: customColor
      };
    }

    // Status colors
    const statusColors: Record<string, string> = {
      'pending': '#f59e0b',
      'in-progress': '#3b82f6',
      'completed': '#10b981',
      'cancelled': '#ef4444'
    };

    // Priority colors
    const priorityColors: Record<string, string> = {
      'low': '#10b981',
      'medium': '#f59e0b',
      'high': '#ef4444'
    };

    const colors = variant === 'priority' ? priorityColors : statusColors;
    const color = colors[status] || '#6b7280';

    return {
      backgroundColor: `${color}15`,
      color
    };
  });

  protected readonly displayLabel = computed(() => {
    if (this.label()) return this.label();

    const labels: Record<string, string> = {
      'pending': 'Pendiente',
      'in-progress': 'En Progreso',
      'completed': 'Completado',
      'cancelled': 'Cancelado',
      'low': 'Baja',
      'medium': 'Media',
      'high': 'Alta'
    };

    return labels[this.status()] || this.status();
  });

  protected readonly badgeClass = computed(() => {
    const classes = ['status-badge'];
    classes.push(`status-badge--${this.size()}`);

    if (this.rounded()) {
      classes.push('status-badge--rounded');
    }

    return classes.join(' ');
  });
}
