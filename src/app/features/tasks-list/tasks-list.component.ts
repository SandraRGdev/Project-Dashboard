import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskStore } from '../../core/services/signal-store/task.store';
import { ProjectStore } from '../../core/services/signal-store/project.store';
import { Task } from '../../core/models/task.model';
import { Status, STATUS_COLORS, STATUS_LABELS } from '../../core/models/status.enum';

interface TaskWithProject extends Task {
  projectName: string;
}

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent implements OnInit {
  protected readonly taskStore = inject(TaskStore);
  protected readonly projectStore = inject(ProjectStore);

  // Signals from stores
  protected readonly filteredTasks = this.taskStore.filteredTasks;
  protected readonly loading = this.taskStore.loading;
  protected readonly metrics = this.taskStore.metrics;
  protected readonly projects = this.projectStore.projects;
  protected readonly tasksByStatus = this.taskStore.tasksByStatus;

  // Local signals
  protected readonly viewMode = signal<'board' | 'list'>('board');
  protected readonly selectedStatus = signal<Status | 'all'>('all');
  protected readonly selectedProject = signal<number | 'all'>('all');
  protected readonly searchQuery = signal<string>('');

  // Computed: tasks with project names
  protected readonly tasksWithProject = computed(() => {
    const tasks = this.filteredTasks();
    const projects = this.projects();

    return tasks.map(task => ({
      ...task,
      projectName: projects.find(p => p.id === task.projectId)?.name || 'Proyecto desconocido'
    }));
  });

  // Computed: sorted tasks
  protected readonly sortedTasks = computed<TaskWithProject[]>(() => {
    const tasks = this.tasksWithProject();

    return [...tasks].sort((a, b) => {
      // Sort by status priority
      const statusOrder = { [Status.IN_PROGRESS]: 0, [Status.PENDING]: 1, [Status.CANCELLED]: 2, [Status.COMPLETED]: 3 };
      const statusComparison = statusOrder[a.status] - statusOrder[b.status];

      if (statusComparison !== 0) return statusComparison;

      // Then by due date
      if (a.dueDate && b.dueDate) {
        return a.dueDate.getTime() - b.dueDate.getTime();
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;

      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });
  });

  // Computed: tasks grouped by status for board view
  protected readonly boardColumns = computed(() => {
    const tasksWithProject = this.tasksWithProject();

    // Group tasks by status
    const pending = tasksWithProject.filter(t => t.status === Status.PENDING);
    const inProgress = tasksWithProject.filter(t => t.status === Status.IN_PROGRESS);
    const completed = tasksWithProject.filter(t => t.status === Status.COMPLETED);

    return [
      { status: Status.PENDING, label: 'Pendientes', tasks: pending, color: STATUS_COLORS[Status.PENDING] },
      { status: Status.IN_PROGRESS, label: 'En Progreso', tasks: inProgress, color: STATUS_COLORS[Status.IN_PROGRESS] },
      { status: Status.COMPLETED, label: 'Completadas', tasks: completed, color: STATUS_COLORS[Status.COMPLETED] }
    ];
  });

  // Computed: project options for filter
  protected readonly projectOptions = computed(() => {
    const projects = this.projects();
    return [
      { value: 'all' as const, label: 'Todos los proyectos' },
      ...projects.map(p => ({ value: p.id, label: p.name }))
    ];
  });

  protected readonly Status = Status;
  protected readonly STATUS_COLORS = STATUS_COLORS;
  protected readonly STATUS_LABELS = STATUS_LABELS;

  ngOnInit(): void {
    this.taskStore.loadTasks();
    this.projectStore.loadProjects();

    // Apply filters when signals change
    effect(() => {
      this.taskStore.updateFilters({
        status: this.selectedStatus(),
        projectId: this.selectedProject(),
        search: this.searchQuery() || undefined
      });
    });
  }

  // ============ ACTIONS ============
  protected selectTask(taskId: number): void {
    this.taskStore.selectTask(taskId);
  }

  protected toggleViewMode(): void {
    this.viewMode.update(mode => mode === 'board' ? 'list' : 'board');
  }

  protected updateTaskStatus(taskId: number, newStatus: Status): void {
    this.taskStore.updateTaskStatus(taskId, newStatus);
  }

  protected isOverdue(task: Task): boolean {
    return task.dueDate !== undefined &&
           task.status !== Status.COMPLETED &&
           new Date() > task.dueDate;
  }

  protected formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short'
    }).format(new Date(date));
  }

  protected getPriorityColor(priority: string): string {
    const colors = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };
    return colors[priority as keyof typeof colors] || '#6b7280';
  }

  protected getPriorityLabel(priority: string): string {
    const labels = { high: 'Alta', medium: 'Media', low: 'Baja' };
    return labels[priority as keyof typeof labels] || priority;
  }

  // Helper method for metrics with hyphenated status keys
  protected getInProgressCount(): number {
    const metrics = this.metrics();
    return metrics.byStatus['in-progress'];
  }
}

import { effect } from '@angular/core';
