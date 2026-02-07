import { signal, computed, Injectable } from '@angular/core';
import { Task, TaskFilters, TaskMetrics } from '../../models/task.model';
import { Status } from '../../models/status.enum';

const MOCK_TASKS: Task[] = [
  {
    id: 1,
    projectId: 1,
    title: 'Diseñar wireframes de la página principal',
    description: 'Crear wireframes de baja y alta fidelidad para el homepage',
    status: Status.COMPLETED,
    assigneeId: 1,
    dueDate: new Date('2024-02-15'),
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-14'),
    priority: 'high',
    estimatedHours: 8,
    actualHours: 7
  },
  {
    id: 2,
    projectId: 1,
    title: 'Implementar componente de navegación',
    description: 'Desarrollar el menú de navegación responsive con Angular',
    status: Status.IN_PROGRESS,
    assigneeId: 2,
    dueDate: new Date('2024-03-01'),
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-20'),
    priority: 'high',
    estimatedHours: 12,
    actualHours: 8
  },
  {
    id: 3,
    projectId: 1,
    title: 'Integrar API de autenticación',
    description: 'Conectar el frontend con el servicio de autenticación existente',
    status: Status.PENDING,
    assigneeId: 3,
    dueDate: new Date('2024-03-15'),
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
    priority: 'high',
    estimatedHours: 16
  },
  {
    id: 4,
    projectId: 1,
    title: 'Pruebas unitarias de componentes',
    description: 'Escribir tests unitarios para los componentes principales',
    status: Status.PENDING,
    assigneeId: 4,
    dueDate: new Date('2024-04-01'),
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
    priority: 'medium',
    estimatedHours: 20
  },
  {
    id: 5,
    projectId: 2,
    title: 'Analizar requisitos del sistema documental',
    description: 'Recopilar y analizar requerimientos con los stakeholders',
    status: Status.COMPLETED,
    assigneeId: 2,
    dueDate: new Date('2024-02-28'),
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-25'),
    priority: 'high',
    estimatedHours: 6,
    actualHours: 5
  },
  {
    id: 6,
    projectId: 2,
    title: 'Diseñar esquema de base de datos',
    description: 'Crear modelo de datos para el sistema de gestión documental',
    status: Status.IN_PROGRESS,
    assigneeId: 5,
    dueDate: new Date('2024-03-10'),
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-03-01'),
    priority: 'high',
    estimatedHours: 14,
    actualHours: 10
  },
  {
    id: 7,
    projectId: 2,
    title: 'Implementar upload de archivos',
    description: 'Desarrollar funcionalidad de carga de documentos con validaciones',
    status: Status.IN_PROGRESS,
    assigneeId: 6,
    dueDate: new Date('2024-03-20'),
    createdAt: new Date('2024-02-25'),
    updatedAt: new Date('2024-03-05'),
    priority: 'medium',
    estimatedHours: 18,
    actualHours: 12
  },
  {
    id: 8,
    projectId: 2,
    title: 'Configurar motor de búsqueda',
    description: 'Implementar Elasticsearch para búsqueda de documentos',
    status: Status.PENDING,
    assigneeId: 2,
    dueDate: new Date('2024-04-15'),
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
    priority: 'medium',
    estimatedHours: 24
  },
  {
    id: 9,
    projectId: 3,
    title: 'Investigar pasarelas de pago',
    description: 'Analizar opciones: Stripe, PayPal, Redsys',
    status: Status.COMPLETED,
    assigneeId: 3,
    dueDate: new Date('2024-04-15'),
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-04-10'),
    priority: 'high',
    estimatedHours: 10,
    actualHours: 8
  },
  {
    id: 10,
    projectId: 3,
    title: 'Diseñar API de pagos',
    description: 'Crear endpoints para procesar pagos y reembolsos',
    status: Status.IN_PROGRESS,
    assigneeId: 7,
    dueDate: new Date('2024-05-01'),
    createdAt: new Date('2024-04-15'),
    updatedAt: new Date('2024-04-25'),
    priority: 'high',
    estimatedHours: 20,
    actualHours: 15
  },
  {
    id: 11,
    projectId: 5,
    title: 'Inventario de activos actuales',
    description: 'Documentar todos los servidores y servicios a migrar',
    status: Status.COMPLETED,
    assigneeId: 1,
    dueDate: new Date('2024-01-31'),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-30'),
    priority: 'high',
    estimatedHours: 12,
    actualHours: 10
  },
  {
    id: 12,
    projectId: 5,
    title: 'Configurar VPC y subredes',
    description: 'Diseñar arquitectura de red en AWS',
    status: Status.COMPLETED,
    assigneeId: 2,
    dueDate: new Date('2024-02-28'),
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-25'),
    priority: 'high',
    estimatedHours: 16,
    actualHours: 14
  },
  {
    id: 13,
    projectId: 5,
    title: 'Migrar base de datos a RDS',
    description: 'Planificar y ejecutar migración de PostgreSQL',
    status: Status.IN_PROGRESS,
    assigneeId: 3,
    dueDate: new Date('2024-04-30'),
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-04-01'),
    priority: 'high',
    estimatedHours: 40,
    actualHours: 25
  },
  {
    id: 14,
    projectId: 5,
    title: 'Configurar Auto Scaling',
    description: 'Implementar escalado automático para aplicaciones',
    status: Status.PENDING,
    assigneeId: 4,
    dueDate: new Date('2024-06-15'),
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-04-01'),
    priority: 'medium',
    estimatedHours: 24
  },
  {
    id: 15,
    projectId: 5,
    title: 'Set up CloudFront CDN',
    description: 'Configurar distribución CloudFront para contenido estático',
    status: Status.PENDING,
    assigneeId: 5,
    dueDate: new Date('2024-07-31'),
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date('2024-05-01'),
    priority: 'low',
    estimatedHours: 8
  },
  {
    id: 16,
    projectId: 6,
    title: 'Diseñar UX/UI de la app',
    description: 'Crear mockups de todas las pantallas de la aplicación móvil',
    status: Status.IN_PROGRESS,
    assigneeId: 7,
    dueDate: new Date('2024-07-15'),
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-06-20'),
    priority: 'high',
    estimatedHours: 32,
    actualHours: 20
  },
  {
    id: 17,
    projectId: 6,
    title: 'Desarrollar módulo de autenticación móvil',
    description: 'Implementar login con biometría y redes sociales',
    status: Status.PENDING,
    assigneeId: 8,
    dueDate: new Date('2024-08-30'),
    createdAt: new Date('2024-07-01'),
    updatedAt: new Date('2024-07-01'),
    priority: 'high',
    estimatedHours: 40
  },
  {
    id: 18,
    projectId: 4,
    title: 'Reunión inicial con stakeholders',
    description: 'Definir requisitos y KPIs del dashboard',
    status: Status.COMPLETED,
    assigneeId: 1,
    dueDate: new Date('2023-10-15'),
    createdAt: new Date('2023-10-05'),
    updatedAt: new Date('2023-10-14'),
    priority: 'high',
    estimatedHours: 4,
    actualHours: 3
  },
  {
    id: 19,
    projectId: 4,
    title: 'Configurar entorno de desarrollo',
    description: 'Setup de proyecto Angular con herramientas de análisis',
    status: Status.COMPLETED,
    assigneeId: 4,
    dueDate: new Date('2023-10-30'),
    createdAt: new Date('2023-10-15'),
    updatedAt: new Date('2023-10-28'),
    priority: 'medium',
    estimatedHours: 8,
    actualHours: 6
  },
  {
    id: 20,
    projectId: 4,
    title: 'Implementar gráficas de métricas',
    description: 'Usar Chart.js para visualizar KPIs',
    status: Status.COMPLETED,
    assigneeId: 5,
    dueDate: new Date('2024-01-15'),
    createdAt: new Date('2023-11-01'),
    updatedAt: new Date('2024-01-10'),
    priority: 'medium',
    estimatedHours: 24,
    actualHours: 22
  },
  {
    id: 21,
    projectId: 1,
    title: 'Documentación de componentes',
    description: 'Crear documentación técnica de todos los componentes reutilizables',
    status: Status.PENDING,
    assigneeId: 4,
    dueDate: new Date('2024-05-15'),
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-04-01'),
    priority: 'low',
    estimatedHours: 16
  },
  {
    id: 22,
    projectId: 2,
    title: 'Implementar versión de documentos',
    description: 'Sistema de control de versiones para documentos',
    status: Status.PENDING,
    assigneeId: 6,
    dueDate: new Date('2024-06-30'),
    createdAt: new Date('2024-04-15'),
    updatedAt: new Date('2024-04-15'),
    priority: 'medium',
    estimatedHours: 28
  },
  {
    id: 23,
    projectId: 3,
    title: 'Implementar webhooks de pago',
    description: 'Configurar endpoints para recibir notificaciones de pasarelas',
    status: Status.PENDING,
    assigneeId: 7,
    dueDate: new Date('2024-06-01'),
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date('2024-05-01'),
    priority: 'high',
    estimatedHours: 12
  },
  {
    id: 24,
    projectId: 5,
    title: 'Script de migración de datos',
    description: 'Crear scripts ETL para migración masiva de datos',
    status: Status.IN_PROGRESS,
    assigneeId: 6,
    dueDate: new Date('2024-05-30'),
    createdAt: new Date('2024-04-15'),
    updatedAt: new Date('2024-05-01'),
    priority: 'high',
    estimatedHours: 35,
    actualHours: 20
  }
];

@Injectable({ providedIn: 'root' })
export class TaskStore {
  // ============ STATE SIGNALS ============
  private readonly _tasks = signal<Task[]>(MOCK_TASKS);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _selectedTaskId = signal<number | null>(null);
  private readonly _filters = signal<TaskFilters>({});

  // ============ READ-ONLY SIGNALS ============
  readonly tasks = this._tasks.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly selectedTaskId = this._selectedTaskId.asReadonly();
  readonly filters = this._filters.asReadonly();

  // ============ COMPUTED SIGNALS ============
  readonly filteredTasks = computed(() => {
    const tasks = this._tasks();
    const filters = this._filters();

    return tasks.filter(task => {
      if (filters.status && filters.status !== 'all') {
        if (task.status !== filters.status) return false;
      }
      if (filters.projectId && filters.projectId !== 'all') {
        if (task.projectId !== filters.projectId) return false;
      }
      if (filters.assigneeId && filters.assigneeId !== 'all') {
        if (task.assigneeId !== filters.assigneeId) return false;
      }
      if (filters.priority && filters.priority !== 'all') {
        if (task.priority !== filters.priority) return false;
      }
      if (filters.search) {
        const search = filters.search.toLowerCase();
        if (!task.title.toLowerCase().includes(search) &&
            !task.description.toLowerCase().includes(search)) {
          return false;
        }
      }
      return true;
    });
  });

  readonly selectedTask = computed(() => {
    const id = this._selectedTaskId();
    const tasks = this._tasks();
    return tasks.find(t => t.id === id) || null;
  });

  readonly metrics = computed((): TaskMetrics => {
    const tasks = this._tasks();

    const byStatus: Record<Status, number> = {
      [Status.PENDING]: 0,
      [Status.IN_PROGRESS]: 0,
      [Status.COMPLETED]: 0,
      [Status.CANCELLED]: 0
    };

    const byPriority = { low: 0, medium: 0, high: 0 };
    let completedThisWeek = 0;
    let overdue = 0;
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    for (const task of tasks) {
      byStatus[task.status]++;
      byPriority[task.priority]++;

      if (task.status === Status.COMPLETED && task.updatedAt >= weekAgo) {
        completedThisWeek++;
      }

      if (task.dueDate && task.status !== Status.COMPLETED && task.dueDate < now) {
        overdue++;
      }
    }

    const completedTasks = tasks.filter(t => t.status === Status.COMPLETED && t.actualHours && t.createdAt);
    const avgCompletionTime = completedTasks.length > 0
      ? Math.round(completedTasks.reduce((sum, t) => {
          const days = Math.ceil((t.updatedAt.getTime() - t.createdAt.getTime()) / (1000 * 60 * 60 * 24));
          return sum + days;
        }, 0) / completedTasks.length)
      : 0;

    return {
      total: tasks.length,
      byStatus,
      byPriority,
      completedThisWeek,
      overdue,
      averageCompletionTime: avgCompletionTime
    };
  });

  readonly tasksByStatus = computed(() => {
    const tasks = this._tasks();
    return {
      [Status.PENDING]: tasks.filter(t => t.status === Status.PENDING),
      [Status.IN_PROGRESS]: tasks.filter(t => t.status === Status.IN_PROGRESS),
      [Status.COMPLETED]: tasks.filter(t => t.status === Status.COMPLETED),
      [Status.CANCELLED]: tasks.filter(t => t.status === Status.CANCELLED)
    };
  });

  readonly tasksByProject = computed(() => {
    const tasks = this._tasks();
    const grouped = new Map<number, Task[]>();

    for (const task of tasks) {
      const existing = grouped.get(task.projectId) || [];
      grouped.set(task.projectId, [...existing, task]);
    }

    return grouped;
  });

  readonly myTasksCount = computed(() => {
    // Simulate current user ID = 1
    const currentUserId = 1;
    return this._tasks().filter(t => t.assigneeId === currentUserId && t.status !== Status.COMPLETED).length;
  });

  // ============ METHODS ============
  loadTasks(): void {
    this._loading.set(true);
    this._error.set(null);

    setTimeout(() => {
      this._tasks.set(MOCK_TASKS);
      this._loading.set(false);
    }, 300);
  }

  selectTask(id: number | null): void {
    this._selectedTaskId.set(id);
  }

  updateFilters(filters: Partial<TaskFilters>): void {
    this._filters.update(current => ({ ...current, ...filters }));
  }

  clearFilters(): void {
    this._filters.set({});
  }

  getTasksByProject(projectId: number): Task[] {
    return this._tasks().filter(t => t.projectId === projectId);
  }

  getTasksByAssignee(assigneeId: number): Task[] {
    return this._tasks().filter(t => t.assigneeId === assigneeId);
  }

  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    this._loading.set(true);

    await new Promise(resolve => setTimeout(resolve, 300));

    const newTask: Task = {
      ...task,
      id: Math.max(...this._tasks().map(t => t.id)) + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this._tasks.update(tasks => [...tasks, newTask]);
    this._loading.set(false);
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<void> {
    this._loading.set(true);

    await new Promise(resolve => setTimeout(resolve, 200));

    this._tasks.update(tasks =>
      tasks.map(t => (t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t))
    );

    this._loading.set(false);
  }

  async updateTaskStatus(id: number, status: Status): Promise<void> {
    await this.updateTask(id, { status });
  }

  async deleteTask(id: number): Promise<void> {
    this._loading.set(true);

    await new Promise(resolve => setTimeout(resolve, 200));

    this._tasks.update(tasks => tasks.filter(t => t.id !== id));

    if (this._selectedTaskId() === id) {
      this._selectedTaskId.set(null);
    }

    this._loading.set(false);
  }
}
