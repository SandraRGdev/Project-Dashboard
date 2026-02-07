import { Injectable, signal, computed } from '@angular/core';
import { ProjectStore } from './signal-store/project.store';
import { TaskStore } from './signal-store/task.store';
import { TeamStore } from './signal-store/team.store';
import { Project } from '../models/project.model';
import { Task } from '../models/task.model';
import { TeamMember } from '../models/team-member.model';

// ============ GLOBAL METRICS INTERFACE ============
export interface GlobalMetrics {
  // Overview
  totalProjects: number;
  totalTasks: number;
  totalTeamMembers: number;

  // Projects breakdown
  activeProjects: number;
  completedProjects: number;
  pendingProjects: number;

  // Tasks breakdown
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  overdueTasks: number;

  // Team stats
  averageTasksPerMember: number;
  availableMembers: number;
  overloadedMembers: number;

  // Progress metrics
  overallProgress: number;
  tasksCompletedThisWeek: number;

  // Health indicators
  projectHealthScore: number; // 0-100
  teamUtilization: number;    // 0-100
  onTimeDeliveryRate: number; // 0-100
}

export interface ProjectOpsFilters {
  search?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

@Injectable({ providedIn: 'root' })
export class ProjectOpsService {
  // ============ INJECTED STORES ============
  private readonly projectStore = inject(ProjectStore);
  private readonly taskStore = inject(TaskStore);
  private readonly teamStore = inject(TeamStore);

  // ============ EXPOSED STORE SIGNALS (SETTERS) ============
  // Projects
  readonly projects = this.projectStore.projects;
  readonly filteredProjects = this.projectStore.filteredProjects;
  readonly projectMetrics = this.projectStore.metrics;

  setProjectFilters(filters: any): void {
    this.projectStore.updateFilters(filters);
  }
  clearProjectFilters(): void {
    this.projectStore.clearFilters();
  }

  // Tasks
  readonly tasks = this.taskStore.tasks;
  readonly filteredTasks = this.taskStore.filteredTasks;
  readonly taskMetrics = this.taskStore.metrics;

  setTaskFilters(filters: any): void {
    this.taskStore.updateFilters(filters);
  }
  clearTaskFilters(): void {
    this.taskStore.clearFilters();
  }

  // Team
  readonly members = this.teamStore.members;
  readonly teamStats = this.teamStore.stats;

  // ============ GLOBAL COMPUTED METRICS ============
  readonly globalMetrics = computed((): GlobalMetrics => {
    const projMetrics = this.projectStore.metrics();
    const taskMetrics = this.taskStore.metrics();
    const teamStats = this.teamStore.stats();

    // Calculate health scores
    const projectHealthScore = this.calculateProjectHealthScore(projMetrics);
    const teamUtilization = this.calculateTeamUtilization(teamStats);
    const onTimeDeliveryRate = this.calculateOnTimeDeliveryRate(taskMetrics);

    // Overall progress (weighted)
    const overallProgress = Math.round(
      (projMetrics.averageProgress * 0.6) +
      ((taskMetrics.byStatus.completed / taskMetrics.total) * 100 * 0.4)
    );

    return {
      // Overview
      totalProjects: projMetrics.total,
      totalTasks: taskMetrics.total,
      totalTeamMembers: teamStats.totalMembers,

      // Projects breakdown
      activeProjects: projMetrics.byStatus['in-progress'],
      completedProjects: projMetrics.byStatus.completed,
      pendingProjects: projMetrics.byStatus.pending,

      // Tasks breakdown
      completedTasks: taskMetrics.byStatus.completed,
      inProgressTasks: taskMetrics.byStatus['in-progress'],
      pendingTasks: taskMetrics.byStatus.pending,
      overdueTasks: taskMetrics.overdue,

      // Team stats
      averageTasksPerMember: teamStats.averageTasksPerMember,
      availableMembers: teamStats.availableMembers,
      overloadedMembers: teamStats.topPerformers.filter(m => m.tasksCount >= 7).length,

      // Progress metrics
      overallProgress,
      tasksCompletedThisWeek: taskMetrics.completedThisWeek,

      // Health indicators
      projectHealthScore,
      teamUtilization,
      onTimeDeliveryRate
    };
  });

  // ============ COMPUTED: RECENT ACTIVITY ============
  readonly recentActivity = computed(() => {
    const tasks = this.taskStore.tasks();

    return tasks
      .filter(t => t.status === 'completed' || t.status === 'in-progress')
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 5)
      .map(task => ({
        type: 'task',
        id: task.id,
        title: task.title,
        status: task.status,
        updatedAt: task.updatedAt,
        projectId: task.projectId
      }));
  });

  // ============ COMPUTED: UPCOMING DEADLINES ============
  readonly upcomingDeadlines = computed(() => {
    const tasks = this.taskStore.tasks();
    const now = new Date();
    const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    return tasks
      .filter(t => t.dueDate && t.status !== 'completed' && t.dueDate >= now && t.dueDate <= twoWeeksFromNow)
      .sort((a, b) => a.dueDate!.getTime() - b.dueDate!.getTime())
      .slice(0, 5)
      .map(task => ({
        taskId: task.id,
        title: task.title,
        dueDate: task.dueDate!,
        projectId: task.projectId,
        priority: task.priority,
        assigneeId: task.assigneeId
      }));
  });

  // ============ COMPUTED: TOP PRIORITY ITEMS ============
  readonly topPriorityItems = computed(() => {
    const projects = this.projectStore.projects();
    const tasks = this.taskStore.tasks();

    const highPriorityProjects = projects
      .filter(p => p.priority === 'high' && p.status !== 'completed')
      .slice(0, 3)
      .map(p => ({ type: 'project' as const, item: p, name: p.name }));

    const highPriorityTasks = tasks
      .filter(t => t.priority === 'high' && t.status !== 'completed')
      .slice(0, 3)
      .map(t => ({ type: 'task' as const, item: t, name: t.title }));

    return [...highPriorityProjects, ...highPriorityTasks].slice(0, 5);
  });

  // ============ COMPUTED: WORKLOAD DISTRIBUTION ============
  readonly workloadDistribution = computed(() => {
    const members = this.teamStore.members();

    return members.map(member => ({
      memberId: member.id,
      name: member.name,
      tasksCount: member.tasksCount,
      projectsCount: member.activeProjects.length,
      utilization: Math.min(100, Math.round((member.tasksCount / 8) * 100))
    })).sort((a, b) => b.tasksCount - a.tasksCount);
  });

  // ============ COMPUTED: PROJECT WITH TASKS ============
  readonly projectsWithTaskCount = computed(() => {
    const projects = this.projectStore.projects();
    const tasksByProject = this.taskStore.tasksByProject();

    return projects.map(project => ({
      ...project,
      taskCount: tasksByProject.get(project.id)?.length || 0,
      completedTaskCount: tasksByProject.get(project.id)?.filter(t => t.status === 'completed').length || 0
    }));
  });

  // ============ METHODS ============

  // Initialize all data
  async initialize(): Promise<void> {
    this.projectStore.loadProjects();
    this.taskStore.loadTasks();
    this.teamStore.loadTeam();
  }

  // Refresh all data
  async refresh(): Promise<void> {
    await this.initialize();
  }

  // Get project with related data
  getProjectDetail(projectId: number): {
    project: Project | null;
    tasks: Task[];
    team: TeamMember[];
  } {
    const project = this.projectStore.projects().find(p => p.id === projectId) || null;
    const tasks = this.taskStore.getTasksByProject(projectId);
    const team = this.teamStore.getMembersByProject(projectId);

    return { project, tasks, team };
  }

  // Get member workload
  getMemberWorkload(memberId: number): {
    member: TeamMember | undefined;
    tasks: Task[];
    projects: Project[];
  } {
    const member = this.teamStore.getMemberById(memberId);
    const tasks = this.taskStore.getTasksByAssignee(memberId);
    const projectIds = member?.activeProjects || [];
    const projects = this.projectStore.projects().filter(p => projectIds.includes(p.id));

    return { member, tasks, projects };
  }

  // Quick actions
  async updateTaskStatus(taskId: number, status: string): Promise<void> {
    await this.taskStore.updateTaskStatus(taskId, status as any);
  }

  async updateProjectProgress(projectId: number, progress: number): Promise<void> {
    await this.projectStore.updateProject(projectId, { progress: progress as any });
  }

  // ============ PRIVATE HELPERS ============

  private calculateProjectHealthScore(metrics: any): number {
    const { total, byStatus, averageProgress } = metrics;
    if (total === 0) return 100;

    const completionRate = (byStatus.completed / total) * 40;
    const progressScore = (averageProgress / 100) * 40;
    const onTrackScore = (byStatus.inProgress / total) * 20;

    return Math.round(completionRate + progressScore + onTrackScore);
  }

  private calculateTeamUtilization(stats: any): number {
    const { totalMembers, totalTasks } = stats;
    if (totalMembers === 0) return 0;

    const idealCapacity = totalMembers * 6; // 6 tasks per member is ideal
    return Math.round(Math.min(100, (totalTasks / idealCapacity) * 100));
  }

  private calculateOnTimeDeliveryRate(metrics: any): number {
    const { total, byStatus, overdue } = metrics;
    if (total === 0) return 100;

    const completedOnTime = byStatus.completed;
    const totalActive = total - byStatus.pending;
    const totalCompleted = totalActive;

    if (totalCompleted === 0) return 100;

    const baseRate = (completedOnTime / totalCompleted) * 100;
    const overduePenalty = (overdue / totalCompleted) * 20;

    return Math.round(Math.max(0, baseRate - overduePenalty));
  }
}

// Add inject import
import { inject } from '@angular/core';
