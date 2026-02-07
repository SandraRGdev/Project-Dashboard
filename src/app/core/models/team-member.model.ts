export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  activeProjects: number[];
  tasksCount: number;
}
