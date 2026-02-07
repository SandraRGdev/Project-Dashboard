import { signal, computed, inject, Injectable } from '@angular/core';
import { Project, ProjectFilters, ProjectMetrics } from '../../models/project.model';
import { Status } from '../../models/status.enum';

const MOCK_PROJECTS: Project[] = [
  {
    id: 1,
    name: 'Rediseño de Portal Corporativo',
    description: 'Modernización completa del portal web con nuevas funcionalidades y diseño responsive',
    status: Status.IN_PROGRESS,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-06-30'),
    teamMembers: [1, 2, 3, 4],
    progress: 65,
    priority: 'high'
  },
  {
    id: 2,
    name: 'Sistema de Gestión Documental',
    description: 'Implementación de solución para gestión centralizada de documentos',
    status: Status.IN_PROGRESS,
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-08-15'),
    teamMembers: [2, 5, 6],
    progress: 40,
    priority: 'medium'
  },
  {
    id: 3,
    name: 'Integración API Pagos',
    description: 'Desarrollo de pasarela de pagos multi-monedas',
    status: Status.PENDING,
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-07-31'),
    teamMembers: [3, 7],
    progress: 0,
    priority: 'high'
  },
  {
    id: 4,
    name: 'Dashboard Analítico',
    description: 'Panel de control para visualización de métricas de negocio en tiempo real',
    status: Status.COMPLETED,
    startDate: new Date('2023-10-01'),
    endDate: new Date('2024-01-31'),
    teamMembers: [1, 4, 5],
    progress: 100,
    priority: 'medium'
  },
  {
    id: 5,
    name: 'Migración Cloud AWS',
    description: 'Migración completa de infraestructura on-premise a AWS',
    status: Status.IN_PROGRESS,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    teamMembers: [1, 2, 3, 4, 5, 6],
    progress: 35,
    priority: 'high'
  },
  {
    id: 6,
    name: 'App Móvil Clientes',
    description: 'Desarrollo aplicación móvil nativa para gestión de servicios por clientes',
    status: Status.PENDING,
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-12-15'),
    teamMembers: [7, 8],
    progress: 0,
    priority: 'medium'
  },
  {
    id: 7,
    name: 'Sistema de Notificaciones',
    description: 'Implementación de sistema de notificaciones push y email',
    status: Status.COMPLETED,
    startDate: new Date('2023-11-01'),
    endDate: new Date('2024-02-28'),
    teamMembers: [3, 4],
    progress: 100,
    priority: 'low'
  },
  {
    id: 8,
    name: 'Auditoría de Seguridad',
    description: 'Auditoría completa de seguridad y hardening de sistemas',
    status: Status.CANCELLED,
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-04-30'),
    teamMembers: [1, 6],
    progress: 20,
    priority: 'high'
  }
];

@Injectable({
  providedIn: 'root'
})
export class ProjectStore {
  // ============ STATE SIGNALS ============
  private readonly _projects = signal<Project[]>(MOCK_PROJECTS);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _selectedProjectId = signal<number | null>(null);
  private readonly _filters = signal<ProjectFilters>({});

  // ============ READ-ONLY SIGNALS ============
  readonly projects = this._projects.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly selectedProjectId = this._selectedProjectId.asReadonly();
  readonly filters = this._filters.asReadonly();

  // ============ COMPUTED SIGNALS ============
  readonly filteredProjects = computed(() => {
    const projects = this._projects();
    const filters = this._filters();

    return projects.filter(project => {
      // Status filter
      if (filters.status && filters.status !== 'all') {
        if (project.status !== filters.status) return false;
      }

      // Priority filter
      if (filters.priority && filters.priority !== 'all') {
        if (project.priority !== filters.priority) return false;
      }

      // Search filter
      if (filters.search) {
        const search = filters.search.toLowerCase();
        return (
          project.name.toLowerCase().includes(search) ||
          project.description.toLowerCase().includes(search)
        );
      }

      return true;
    });
  });

  readonly selectedProject = computed(() => {
    const id = this._selectedProjectId();
    const projects = this._projects();
    return projects.find(p => p.id === id) || null;
  });

  readonly metrics = computed((): ProjectMetrics => {
    const projects = this._projects();

    const byStatus: Record<Status, number> = {
      [Status.PENDING]: 0,
      [Status.IN_PROGRESS]: 0,
      [Status.COMPLETED]: 0,
      [Status.CANCELLED]: 0
    };

    const byPriority = { low: 0, medium: 0, high: 0 };
    let totalProgress = 0;

    for (const project of projects) {
      byStatus[project.status]++;
      byPriority[project.priority]++;
      totalProgress += project.progress;
    }

    return {
      total: projects.length,
      byStatus,
      byPriority,
      averageProgress: projects.length ? Math.round(totalProgress / projects.length) : 0
    };
  });

  readonly activeProjectsCount = computed(() => {
    const projects = this._projects();
    return projects.filter(p => p.status === Status.IN_PROGRESS).length;
  });

  readonly pendingProjectsCount = computed(() => {
    const projects = this._projects();
    return projects.filter(p => p.status === Status.PENDING).length;
  });

  readonly highPriorityCount = computed(() => {
    const projects = this._projects();
    return projects.filter(p => p.priority === 'high' && p.status !== Status.COMPLETED).length;
  });

  // ============ METHODS ============
  loadProjects(): void {
    this._loading.set(true);
    this._error.set(null);

    // Simulate API call
    setTimeout(() => {
      this._projects.set(MOCK_PROJECTS);
      this._loading.set(false);
    }, 300);
  }

  selectProject(id: number | null): void {
    this._selectedProjectId.set(id);
  }

  updateFilters(filters: Partial<ProjectFilters>): void {
    this._filters.update(current => ({ ...current, ...filters }));
  }

  clearFilters(): void {
    this._filters.set({});
  }

  async createProject(project: Omit<Project, 'id'>): Promise<void> {
    this._loading.set(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const newProject: Project = {
      ...project,
      id: Math.max(...this._projects().map(p => p.id)) + 1
    };

    this._projects.update(projects => [...projects, newProject]);
    this._loading.set(false);
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<void> {
    this._loading.set(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));

    this._projects.update(projects =>
      projects.map(p => (p.id === id ? { ...p, ...updates } : p))
    );

    this._loading.set(false);
  }

  async deleteProject(id: number): Promise<void> {
    this._loading.set(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));

    this._projects.update(projects => projects.filter(p => p.id !== id));

    if (this._selectedProjectId() === id) {
      this._selectedProjectId.set(null);
    }

    this._loading.set(false);
  }
}
