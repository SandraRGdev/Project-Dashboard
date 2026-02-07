import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

// Stores (singleton services)
import { ProjectStore } from './core/services/signal-store/project.store';
import { TaskStore } from './core/services/signal-store/task.store';
import { TeamStore } from './core/services/signal-store/team.store';
import { ProjectOpsService } from './core/services/project-ops.service';

export const appConfig: ApplicationConfig = {
  providers: [
    // Router
    provideRouter(routes),

    // HTTP Client
    provideHttpClient(),

    // Signal Stores (State Management)
    ProjectStore,
    TaskStore,
    TeamStore,

    // Centralized Service
    ProjectOpsService
  ]
};
