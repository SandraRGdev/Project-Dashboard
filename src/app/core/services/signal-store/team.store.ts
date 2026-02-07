import { signal, computed, Injectable } from '@angular/core';
import { TeamMember } from '../../models/team-member.model';

const MOCK_TEAM: TeamMember[] = [
  {
    id: 1,
    name: 'Ana Martínez',
    email: 'ana.martinez@projectops.com',
    role: 'Tech Lead',
    avatar: 'AM',
    activeProjects: [1, 4, 5, 8],
    tasksCount: 5
  },
  {
    id: 2,
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@projectops.com',
    role: 'Senior Backend Developer',
    avatar: 'CR',
    activeProjects: [1, 2, 3, 5],
    tasksCount: 7
  },
  {
    id: 3,
    name: 'María López',
    email: 'maria.lopez@projectops.com',
    role: 'Senior Frontend Developer',
    avatar: 'ML',
    activeProjects: [1, 3, 5],
    tasksCount: 4
  },
  {
    id: 4,
    name: 'Diego Sánchez',
    email: 'diego.sanchez@projectops.com',
    role: 'QA Engineer',
    avatar: 'DS',
    activeProjects: [1, 4, 5],
    tasksCount: 6
  },
  {
    id: 5,
    name: 'Laura García',
    email: 'laura.garcia@projectops.com',
    role: 'Database Administrator',
    avatar: 'LG',
    activeProjects: [2, 4, 5],
    tasksCount: 3
  },
  {
    id: 6,
    name: 'Pedro Fernández',
    email: 'pedro.fernandez@projectops.com',
    role: 'DevOps Engineer',
    avatar: 'PF',
    activeProjects: [2, 5, 7],
    tasksCount: 5
  },
  {
    id: 7,
    name: 'Sofia Ruiz',
    email: 'sofia.ruiz@projectops.com',
    role: 'Backend Developer',
    avatar: 'SR',
    activeProjects: [3, 6, 7],
    tasksCount: 4
  },
  {
    id: 8,
    name: 'Miguel Torres',
    email: 'miguel.torres@projectops.com',
    role: 'Mobile Developer',
    avatar: 'MT',
    activeProjects: [6],
    tasksCount: 2
  }
];

interface TeamStats {
  totalMembers: number;
  activeMembers: number;
  totalTasks: number;
  averageTasksPerMember: number;
  topPerformers: TeamMember[];
  availableMembers: number;
}

@Injectable({ providedIn: 'root' })
export class TeamStore {
  // ============ STATE SIGNALS ============
  private readonly _members = signal<TeamMember[]>(MOCK_TEAM);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _selectedMemberId = signal<number | null>(null);

  // ============ READ-ONLY SIGNALS ============
  readonly members = this._members.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly selectedMemberId = this._selectedMemberId.asReadonly();

  // ============ COMPUTED SIGNALS ============
  readonly selectedMember = computed(() => {
    const id = this._selectedMemberId();
    const members = this._members();
    return members.find(m => m.id === id) || null;
  });

  readonly stats = computed((): TeamStats => {
    const members = this._members();

    const totalMembers = members.length;
    const activeMembers = members.filter(m => m.activeProjects.length > 0).length;
    const totalTasks = members.reduce((sum, m) => sum + m.tasksCount, 0);
    const averageTasksPerMember = totalMembers > 0 ? Math.round(totalTasks / totalMembers) : 0;

    const topPerformers = [...members]
      .sort((a, b) => b.tasksCount - a.tasksCount)
      .slice(0, 3);

    const availableMembers = members.filter(m => m.tasksCount < 5).length;

    return {
      totalMembers,
      activeMembers,
      totalTasks,
      averageTasksPerMember,
      topPerformers,
      availableMembers
    };
  });

  readonly membersByRole = computed(() => {
    const members = this._members();
    const grouped = new Map<string, TeamMember[]>();

    for (const member of members) {
      const existing = grouped.get(member.role) || [];
      grouped.set(member.role, [...existing, member]);
    }

    return grouped;
  });

  readonly membersByProject = computed(() => {
    const members = this._members();
    const projectMembers = new Map<number, TeamMember[]>();

    for (const member of members) {
      for (const projectId of member.activeProjects) {
        const existing = projectMembers.get(projectId) || [];
        projectMembers.set(projectId, [...existing, member]);
      }
    }

    return projectMembers;
  });

  readonly availableMembers = computed(() => {
    return this._members().filter(m => m.tasksCount < 5);
  });

  readonly overloadedMembers = computed(() => {
    return this._members().filter(m => m.tasksCount >= 7);
  });

  readonly memberById = computed(() => {
    const members = this._members();
    return new Map(members.map(m => [m.id, m]));
  });

  readonly rolesList = computed(() => {
    const members = this._members();
    const roles = [...new Set(members.map(m => m.role))];
    return roles.sort();
  });

  // ============ METHODS ============
  loadTeam(): void {
    this._loading.set(true);
    this._error.set(null);

    setTimeout(() => {
      this._members.set(MOCK_TEAM);
      this._loading.set(false);
    }, 300);
  }

  selectMember(id: number | null): void {
    this._selectedMemberId.set(id);
  }

  getMemberById(id: number): TeamMember | undefined {
    return this._members().find(m => m.id === id);
  }

  getMembersByProject(projectId: number): TeamMember[] {
    return this._members().filter(m => m.activeProjects.includes(projectId));
  }

  async addMember(member: Omit<TeamMember, 'id'>): Promise<void> {
    this._loading.set(true);

    await new Promise(resolve => setTimeout(resolve, 300));

    const newMember: TeamMember = {
      ...member,
      id: Math.max(...this._members().map(m => m.id)) + 1
    };

    this._members.update(members => [...members, newMember]);
    this._loading.set(false);
  }

  async updateMember(id: number, updates: Partial<TeamMember>): Promise<void> {
    this._loading.set(true);

    await new Promise(resolve => setTimeout(resolve, 200));

    this._members.update(members =>
      members.map(m => (m.id === id ? { ...m, ...updates } : m))
    );

    this._loading.set(false);
  }

  async updateTasksCount(memberId: number, delta: number): Promise<void> {
    this._members.update(members =>
      members.map(m =>
        m.id === memberId ? { ...m, tasksCount: Math.max(0, m.tasksCount + delta) } : m
      )
    );
  }
}
