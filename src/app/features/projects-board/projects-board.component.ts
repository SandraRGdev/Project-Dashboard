import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectStore } from '../../core/services/signal-store/project.store';
import { Project, ProjectMetrics } from '../../core/models/project.model';
import { Status, STATUS_COLORS, STATUS_LABELS } from '../../core/models/status.enum';

@Component({
  selector: 'app-projects-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects-board.component.html',
  styleUrls: ['./projects-board.component.scss']
})
export class ProjectsBoardComponent implements OnInit {
  protected readonly projectStore = inject(ProjectStore);

  // Signals from store
  protected readonly projects = this.projectStore.filteredProjects;
  protected readonly loading = this.projectStore.loading;
  protected readonly metrics = this.projectStore.metrics;

  // Expose Math for template use
  protected readonly Math = Math;

  // Local component signals
  protected readonly viewMode = signal<'grid' | 'list'>('grid');
  protected readonly sortBy = signal<'name' | 'progress' | 'priority' | 'startDate'>('startDate');
  protected readonly sortOrder = signal<'asc' | 'desc'>('desc');

  // Computed: sorted projects
  protected readonly sortedProjects = computed(() => {
    const projects = this.projects();
    const sortBy = this.sortBy();
    const sortOrder = this.sortOrder();

    return [...projects].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'progress':
          comparison = a.progress - b.progress;
          break;
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'startDate':
          comparison = a.startDate.getTime() - b.startDate.getTime();
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  });

  // Computed: status badge color
  protected readonly Status = Status;
  protected readonly STATUS_COLORS = STATUS_COLORS;
  protected readonly STATUS_LABELS = STATUS_LABELS;

  ngOnInit(): void {
    this.projectStore.loadProjects();
  }

  // ============ ACTIONS ============
  protected selectProject(projectId: number): void {
    this.projectStore.selectProject(projectId);
  }

  protected toggleViewMode(): void {
    this.viewMode.update(mode => mode === 'grid' ? 'list' : 'grid');
  }

  protected setSortBy(field: 'name' | 'progress' | 'priority' | 'startDate'): void {
    if (this.sortBy() === field) {
      this.sortOrder.update(order => order === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(field);
      this.sortOrder.set('desc');
    }
  }

  protected getPriorityColor(priority: string): string {
    const colors = {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#10b981'
    };
    return colors[priority as keyof typeof colors] || '#6b7280';
  }

  protected getPriorityLabel(priority: string): string {
    const labels = {
      high: 'Alta',
      medium: 'Media',
      low: 'Baja'
    };
    return labels[priority as keyof typeof labels] || priority;
  }

  protected formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(date));
  }

  protected getProgressBarColor(progress: number): string {
    if (progress >= 75) return '#10b981';
    if (progress >= 50) return '#3b82f6';
    if (progress >= 25) return '#f59e0b';
    return '#ef4444';
  }

  // Helper methods for metrics with hyphenated status keys
  protected getInProgressCount(metrics: ProjectMetrics): number {
    return metrics.byStatus['in-progress'];
  }
}

// Add signal import
import { signal } from '@angular/core';
