# ProjectOps Dashboard

[![Angular](https://img.shields.io/badge/Angular-20.0.0-red?logo=angular)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Semantic Versioning](https://img.shields.io/badge/SemVer-2.0.0-blue)](https://semver.org/)

> Dashboard de gestión de proyectos interno construido con Angular 20, Signals y Zoneless Change Detection.

![ProjectOps Dashboard](https://img.shields.io/badge/ProjectOps-Dashboard-purple)

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Arquitectura](#arquitectura)
- [Instalación](#instalación)
- [Uso](#uso)
- [Despliegue](#despliegue)
- [Contributing](#contributing)
- [Licencia](#licencia)

## ✨ Características

### Gestión de Proyectos
- **Tablero Kanban** con vista de grid y lista
- **Métricas en tiempo real**: proyectos activos, completados, progreso promedio
- **Filtrado** por estado, prioridad y fecha de inicio
- **Visualización de progreso** con barras de progreso coloridas

### Gestión de Tareas
- **Vista de tablero** con columnas por estado (Pendientes, En Progreso, Completadas)
- **Vista de lista** con tabla detallada
- **Filtrado** por proyecto, estado y búsqueda
- **Indicadores** de prioridad y vencimiento

### Gestión de Equipo
- **Métricas de equipo**: miembros activos, carga de trabajo, top performers
- **Indicadores de utilización**: disponible, óptimo, ocupado, sobrecargado
- **Filtrado** por rol y ordenamiento flexible
- **Avatares** con gradientes únicos

### Dashboard Global
- **KPIs globales**: proyectos totales, tareas totales, miembros de equipo, progreso general
- **Salud del proyecto**: health score con indicadores visuales
- **Distribución de carga de trabajo**: visualización por miembro
- **Vencimientos próximos** y actividad reciente

### UI/UX
- **Tema claro/oscuro** con persistencia y detección de preferencia del sistema
- **Sidebar colapsable** para maximizar espacio de trabajo
- **Diseño responsive** adaptado a diferentes tamaños de pantalla
- **Animaciones suaves** y transiciones

## 🛠 Tecnologías

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Angular | 20.0.0 | Framework frontend |
| TypeScript | 5.8.0 | Lenguaje de programación |
| Zone.js | ^0.15.0 | Change detection |
| SCSS | ^1.83.0 | Preprocesador CSS |

## 🏗 Arquitectura

```
src/
├── app/
│   ├── core/                    # Módulo principal
│   │   ├── models/              # Modelos de datos
│   │   │   ├── project.model.ts
│   │   │   ├── task.model.ts
│   │   │   ├── team-member.model.ts
│   │   │   └── status.enum.ts
│   │   └── services/            # Servicios centrales
│   │       ├── signal-store/    # Signal Stores (state management)
│   │       │   ├── project.store.ts
│   │       │   ├── task.store.ts
│   │       │   └── team.store.ts
│   │       ├── project-ops.service.ts  # Servicio centralizado
│   │       └── theme/           # Sistema de temas
│   │           └── theme.service.ts
│   ├── features/                # Feature modules
│   │   ├── metrics-dashboard/   # Dashboard global
│   │   ├── projects-board/      # Gestión de proyectos
│   │   ├── tasks-list/          # Gestión de tareas
│   │   └── team-overview/       # Gestión de equipo
│   ├── layout/                  # Componentes de layout
│   │   ├── shell/               # Contenedor principal
│   │   ├── sidebar/             # Navegación lateral
│   │   ├── header/              # Cabecera
│   │   └── navigation-items.ts  # Configuración de navegación
│   ├── shared/                  # Componentes compartidos
│   │   └── ui/                  # UI components
│   │       ├── avatar/
│   │       ├── card/
│   │       ├── loading-spinner/
│   │       ├── status-badge/
│   │       └── theme-toggle/
│   ├── app.config.ts            # Configuración de la aplicación
│   ├── app.routes.ts            # Rutas
│   └── app.component.ts         # Componente raíz
├── styles/
│   └── theme.scss               # Variables CSS globales
├── main.ts                      # Bootstrapping
└── index.html                   # HTML principal
```

### State Management con Signals

El dashboard utiliza **Signals** de Angular para la gestión de estado reactiva:

```typescript
// Ejemplo de Signal Store
export class ProjectStore {
  private readonly _projects = signal<Project[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _filters = signal<ProjectFilters>({});

  // Señales de solo lectura
  readonly projects = this._projects.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly filteredProjects = computed(() => {
    // Lógica de filtrado reactivo
  });

  // Métodos para modificar el estado
  loadProjects(): void { /* ... */ }
  updateFilters(filters: Partial<ProjectFilters>): void { /* ... */ }
}
```

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/Project-Dashboard.git
cd Project-Dashboard

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

La aplicación estará disponible en [http://localhost:4200](http://localhost:4200).

## 🚀 Uso

### Scripts disponibles

```bash
# Desarrollo
npm start                # Inicia servidor en puerto 4200
npm run build            # Compila para producción
npm run watch            # Modo watch para desarrollo

# Testing
npm test                 # Ejecuta tests unitarios
npm run e2e              # Ejecuta tests e2e

# Linting
npm run lint             # Ejecuta ESLint
```

### Navegación

| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/dashboard` | MetricsDashboard | Vista general con KPIs |
| `/projects` | ProjectsBoard | Gestión de proyectos |
| `/tasks` | TasksList | Gestión de tareas |
| `/team` | TeamOverview | Gestión de equipo |

### Cambiar Tema

El tema se puede cambiar mediante el `ThemeService`:

```typescript
constructor(private themeService: ThemeService) {
  // Cambiar a tema oscuro
  this.themeService.setTheme('dark');

  // Alternar tema
  this.themeService.toggleTheme();

  // Detectar preferencia del sistema
  this.themeService.setTheme('system');
}
```

## 🌐 Despliegue

### GitHub Pages

```bash
# Instalar angular-cli-ghpages
npm install -g angular-cli-ghpages

# Construir y desplegar
ng deploy --base-href=/Project-Dashboard/
```

### Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel --prod
```

### Netlify

```bash
# Construir
npm run build

# Desplegar la carpeta dist/
netlify deploy --prod --dir=dist/projectops-dashboard
```

## 📝 Versionado (Semantic Versioning)

Este proyecto utiliza [Semantic Versioning 2.0.0](https://semver.org/lang/es/).

Formato: `MAJOR.MINOR.PATCH`

- **MAJOR**: Cambios incompatibles en la API
- **MINOR**: Funcionalidades backwards-compatible
- **PATCH**: Correcciones de errores backwards-compatible

Ejemplos:
- `1.0.0` → `1.0.1`: Bug fix
- `1.0.0` → `1.1.0`: Nueva feature
- `1.0.0` → `2.0.0`: Breaking changes

Consultar [CHANGELOG.md](CHANGELOG.md) para el historial completo.

## 🤝 Contributing

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/NuevaFeature`)
3. Commit tus cambios (`git commit -m 'Add: nueva feature'`)
4. Push a la rama (`git push origin feature/NuevaFeature`)
5. Abre un Pull Request

### Convenciones de Commit

```
Add:    Nuevas funcionalidades
Fix:    Correcciones de errores
Refactor: Cambios de refactorización
Docs:   Cambios en documentación
Style:  Cambios de formato/estilo
Test:   Adición o modificación de tests
Chore:  Cambios en procesos de build o herramientas
```

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Autores

- **Sandra** - *Trabajo inicial* - [GitHub](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- Angular Team por el excelente framework
- Comunidad de desarrolladores de Angular
- Diseño inspirado en las mejores prácticas de dashboard modernos

---

**ProjectOps Dashboard** © 2026. Built with ❤️ using Angular 20.
