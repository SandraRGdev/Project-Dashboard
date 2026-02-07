import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell.component')
      .then(m => m.ShellComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/metrics-dashboard/metrics-dashboard.component')
          .then(m => m.MetricsDashboardComponent),
        title: 'Dashboard - ProjectOps'
      },
      {
        path: 'projects',
        loadComponent: () => import('./features/projects-board/projects-board.component')
          .then(m => m.ProjectsBoardComponent),
        title: 'Proyectos - ProjectOps'
      },
      {
        path: 'tasks',
        loadComponent: () => import('./features/tasks-list/tasks-list.component')
          .then(m => m.TasksListComponent),
        title: 'Tareas - ProjectOps'
      },
      {
        path: 'team',
        loadComponent: () => import('./features/team-overview/team-overview.component')
          .then(m => m.TeamOverviewComponent),
        title: 'Equipo - ProjectOps'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
