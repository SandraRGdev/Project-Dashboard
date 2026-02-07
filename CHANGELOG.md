# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Integration with real REST API
- User authentication
- Real-time updates with WebSockets
- Export data to CSV/PDF
- Advanced analytics and reporting

## [1.0.0] - 2026-02-07

### Added
- Initial release of ProjectOps Dashboard
- **Features**
  - Dashboard global con métricas KPI
  - Tablero de proyectos con vista grid/lista
  - Gestión de tareas con vista Kanban
  - Vista de equipo con métricas de utilización
- **Architecture**
  - Angular 20 with Zoneless Change Detection
  - Signals-based state management (ProjectStore, TaskStore, TeamStore)
  - Standalone components architecture
  - Lazy loading con loadComponent()
- **UI/UX**
  - Dark/Light theme system with ThemeService
  - Collapsible sidebar navigation
  - Responsive design
  - CSS variables theming (60+ variables)
- **Components**
  - 4 feature modules: MetricsDashboard, ProjectsBoard, TasksList, TeamOverview
  - Shared UI components: Avatar, Card, LoadingSpinner, StatusBadge, ThemeToggle
  - Layout components: Shell, Sidebar, Header
- **Mock Data**
  - 8 sample projects with full metadata
  - 24 tasks across projects
  - 8 team members with roles and assignments

### Technical Details
- TypeScript 5.8.0
- SCSS with deprecation warnings handled
- Zone.js 0.15.0 for change detection
- ProjectOpsService as centralized state manager

## [0.1.0] - 2026-02-07

### Added
- Project initialization
- Angular 20 setup with standalone components
- Basic folder structure
- Core models: Project, Task, TeamMember, Status enum

---

## Versioning Guidelines

### MAJOR (X.0.0)
- Breaking changes in API
- Architectural redesigns
- Database schema changes
- Major UI/UX overhauls

### MINOR (0.X.0)
- New features (backwards compatible)
- New components or modules
- Enhanced functionality
- Performance improvements

### PATCH (0.0.X)
- Bug fixes
- Hotfixes
- Documentation updates
- Minor styling fixes
- Dependency updates (non-breaking)

---

## Release Workflow

1. Update version in `package.json`
2. Update this `CHANGELOG.md`
3. Commit: `chore: release version X.X.X`
4. Create git tag: `git tag vX.X.X`
5. Push: `git push && git push --tags`
6. Create GitHub Release
7. Deploy to production
