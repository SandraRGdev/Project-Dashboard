import { Status } from './status.enum';

export interface Project {
  id: number;
  name: string;
  description: string;
  status: Status;
  startDate: Date;
  endDate?: Date;
  teamMembers: number[];
  progress: number;
  priority: 'low' | 'medium' | 'high';
}

export interface ProjectFilters {
  status?: Status | 'all';
  priority?: 'low' | 'medium' | 'high' | 'all';
  search?: string;
}

export interface ProjectMetrics {
  total: number;
  byStatus: Record<Status, number>;
  byPriority: Record<'low' | 'medium' | 'high', number>;
  averageProgress: number;
}
