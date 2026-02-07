import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectOpsService } from '../../core/services/project-ops.service';
import { GlobalMetrics } from '../../core/services/project-ops.service';

@Component({
  selector: 'app-metrics-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metrics-dashboard.component.html',
  styleUrls: ['./metrics-dashboard.component.scss']
})
export class MetricsDashboardComponent implements OnInit {
  protected readonly projectOps = inject(ProjectOpsService);

  // Signals from service
  protected readonly globalMetrics = this.projectOps.globalMetrics;
  protected readonly recentActivity = this.projectOps.recentActivity;
  protected readonly upcomingDeadlines = this.projectOps.upcomingDeadlines;
  protected readonly topPriorityItems = this.projectOps.topPriorityItems;
  protected readonly workloadDistribution = this.projectOps.workloadDistribution;
  protected readonly projectsWithTaskCount = this.projectOps.projectsWithTaskCount;

  // Local state
  protected readonly loading = computed(() => false); // Could be derived from stores

  ngOnInit(): void {
    this.projectOps.initialize();
  }

  protected get currentDate(): Date {
    return new Date();
  }

  // ============ HELPERS ============
  protected getHealthScoreColor(score: number): string {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  }

  protected getHealthScoreLabel(score: number): string {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bueno';
    if (score >= 40) return 'Regular';
    return 'Crítico';
  }

  protected getUtilizationColor(utilization: number): string {
    if (utilization >= 90) return '#ef4444';
    if (utilization >= 70) return '#f59e0b';
    if (utilization >= 40) return '#10b981';
    return '#6b7280';
  }

  protected formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(date));
  }

  protected formatRelativeDate(date: Date): string {
    const now = new Date();
    const target = new Date(date);
    const diffDays = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Mañana';
    if (diffDays === -1) return 'Ayer';
    if (diffDays < 0) return `Hace ${Math.abs(diffDays)} días`;
    if (diffDays <= 7) return `En ${diffDays} días`;
    return this.formatDate(date);
  }

  protected getProgressColor(value: number): string {
    if (value >= 80) return '#10b981';
    if (value >= 60) return '#3b82f6';
    if (value >= 40) return '#f59e0b';
    return '#ef4444';
  }

  protected getDonutSegments(metrics: GlobalMetrics) {
    const completed = metrics.completedTasks;
    const inProgress = metrics.inProgressTasks;
    const pending = metrics.pendingTasks;
    const total = metrics.totalTasks;

    return {
      completed: total > 0 ? (completed / total) * 100 : 0,
      inProgress: total > 0 ? (inProgress / total) * 100 : 0,
      pending: total > 0 ? (pending / total) * 100 : 0
    };
  }
}
