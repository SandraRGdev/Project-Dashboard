import { Status } from './status.enum';

export interface Task {
  id: number;
  projectId: number;
  title: string;
  description: string;
  status: Status;
  assigneeId?: number;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  priority: 'low' | 'medium' | 'high';
  estimatedHours?: number;
  actualHours?: number;
}

export interface TaskFilters {
  status?: Status | 'all';
  projectId?: number | 'all';
  assigneeId?: number | 'all';
  priority?: 'low' | 'medium' | 'high' | 'all';
  search?: string;
}

export interface TaskMetrics {
  total: number;
  byStatus: Record<Status, number>;
  byPriority: Record<'low' | 'medium' | 'high', number>;
  completedThisWeek: number;
  overdue: number;
  averageCompletionTime: number; // in days
}
