import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamStore } from '../../core/services/signal-store/team.store';
import { TaskStore } from '../../core/services/signal-store/task.store';
import { ProjectStore } from '../../core/services/signal-store/project.store';
import { TeamMember } from '../../core/models/team-member.model';

@Component({
  selector: 'app-team-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-overview.component.html',
  styleUrls: ['./team-overview.component.scss']
})
export class TeamOverviewComponent implements OnInit {
  protected readonly teamStore = inject(TeamStore);
  protected readonly taskStore = inject(TaskStore);
  protected readonly projectStore = inject(ProjectStore);

  // Signals from stores
  protected readonly members = this.teamStore.members;
  protected readonly loading = this.teamStore.loading;
  protected readonly stats = this.teamStore.stats;

  // Computed: stats with overloadedMembers
  protected readonly statsWithOverloaded = computed(() => {
    const baseStats = this.stats();
    const overloadedCount = this.sortedMembers().filter(m => m.tasksCount >= 7).length;
    return {
      ...baseStats,
      overloadedMembers: { length: overloadedCount }
    };
  });
  protected readonly availableMembers = this.teamStore.availableMembers;
  // Note: overloadedMembers getter is defined below
  protected readonly membersByRole = this.teamStore.membersByRole;

  // Local signals
  protected readonly selectedRole = signal<string>('all');
  protected readonly sortBy = signal<'name' | 'tasks' | 'projects'>('tasks');
  protected readonly searchQuery = signal<string>('');

  // Computed: members with project names
  protected readonly membersWithDetails = computed(() => {
    const members = this.members();
    const projects = this.projectStore.projects();

    return members.map(member => ({
      ...member,
      projectNames: member.activeProjects
        .map(id => projects.find(p => p.id === id)?.name)
        .filter(Boolean) as string[]
    }));
  });

  // Computed: filtered members
  protected readonly filteredMembers = computed(() => {
    let members = this.membersWithDetails();

    // Role filter
    if (this.selectedRole() !== 'all') {
      members = members.filter(m => m.role === this.selectedRole());
    }

    // Search filter
    const search = this.searchQuery().toLowerCase();
    if (search) {
      members = members.filter(m =>
        m.name.toLowerCase().includes(search) ||
        m.email.toLowerCase().includes(search) ||
        m.role.toLowerCase().includes(search)
      );
    }

    return members;
  });

  // Computed: sorted members
  protected readonly sortedMembers = computed(() => {
    const members = this.filteredMembers();
    const sortBy = this.sortBy();

    return [...members].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'tasks':
          return b.tasksCount - a.tasksCount;
        case 'projects':
          return b.activeProjects.length - a.activeProjects.length;
        default:
          return 0;
      }
    });
  });

  // Computed: role options
  protected readonly roleOptions = computed(() => {
    const roles = this.teamStore.rolesList();
    return ['all', ...roles];
  });

  // Computed: members with utilization
  protected readonly membersWithUtilization = computed(() => {
    return this.sortedMembers().map(member => ({
      ...member,
      utilization: Math.min(100, Math.round((member.tasksCount / 8) * 100)),
      status: this.getMemberStatus(member.tasksCount)
    }));
  });

  // Computed: top performers
  protected readonly topPerformers = computed(() => {
    return this.sortedMembers()
      .filter(m => m.tasksCount > 0)
      .slice(0, 5);
  });

  // Getter for overloadedMembers (template compatibility)
  protected get overloadedMembers(): number {
    return this.sortedMembers().filter(m => m.tasksCount >= 7).length;
  }

  // Expose overloadedMembers as computed for template
  protected readonly overloadedMembersCount = computed(() => this.overloadedMembers);

  ngOnInit(): void {
    this.teamStore.loadTeam();
    this.projectStore.loadProjects();
  }

  // ============ ACTIONS ============
  protected selectMember(memberId: number): void {
    this.teamStore.selectMember(memberId);
  }

  protected setSortBy(field: 'name' | 'tasks' | 'projects'): void {
    if (this.sortBy() === field) {
      // Toggle order could be added here
    } else {
      this.sortBy.set(field);
    }
  }

  protected getMemberStatus(tasksCount: number): 'available' | 'optimal' | 'busy' | 'overloaded' {
    if (tasksCount <= 2) return 'available';
    if (tasksCount <= 5) return 'optimal';
    if (tasksCount <= 7) return 'busy';
    return 'overloaded';
  }

  protected getStatusColor(status: string): string {
    const colors = {
      available: '#10b981',
      optimal: '#3b82f6',
      busy: '#f59e0b',
      overloaded: '#ef4444'
    };
    return colors[status as keyof typeof colors] || '#6b7280';
  }

  protected getStatusLabel(status: string): string {
    const labels = {
      available: 'Disponible',
      optimal: 'Óptimo',
      busy: 'Ocupado',
      overloaded: 'Sobrecargado'
    };
    return labels[status as keyof typeof labels] || status;
  }

  protected getAvatarGradient(memberId: number): string {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    ];
    return gradients[memberId % gradients.length];
  }
}
