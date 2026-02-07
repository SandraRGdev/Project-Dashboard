# Contributing to ProjectOps Dashboard

¡Gracias por tu interés en contribuir a ProjectOps Dashboard!

## 📋 Contenido

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
- [Convenciones de Commit](#convenciones-de-commit)
- [Estándares de Código](#estándares-de-código)
- [Testing](#testing)

## 🤝 Código de Conducta

Al participar en este proyecto, te comprometes a mantener un ambiente respetuoso e inclusivo.

- Ser respetuoso con otros contribuyentes
- Aceptar críticas constructivas
- Enfocarse en lo que es mejor para la comunidad
- Mostrar empatía hacia otros miembros del proyecto

## 🚀 Cómo Contribuir

### Reporting Bugs

Antes de reportar un bug:

1. Verifica que el bug no haya sido reportado
2. Usa la plantilla de issue con:
   - Título descriptivo
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Entorno (OS, navegador, versión)
   - Capturas de pantalla si aplica

### Sugerencias de Features

1. Verifica que la feature no exista
2. Explica el caso de uso claramente
3. Propone una solución si es posible
4. Considera si beneficia a la mayoría de usuarios

## 🔄 Proceso de Desarrollo

### Fork y Clone

```bash
# Fork el repositorio en GitHub
# Clona tu fork
git clone https://github.com/tu-usuario/Project-Dashboard.git
cd Project-Dashboard

# Agrega el upstream
git remote add upstream https://github.com/original-owner/Project-Dashboard.git
```

### Crea una Rama

```bash
# Para features
git checkout -b feature/nombre-feature

# Para fixes
git checkout -b fix/nombre-bug

# Para documentation
git checkout -b docs/actualizacion-docs
```

### Haz tus Cambios

1. Sigue los estándares de código
2. Escribe tests para nuevas features
3. Actualiza la documentación
4. Commits con mensajes claros

### Sincroniza con Upstream

```bash
git fetch upstream
git rebase upstream/main
```

### Pull Request

1. Push a tu fork:
   ```bash
   git push origin feature/nombre-feature
   ```

2. Crea Pull Request en GitHub:
   - Título descriptivo
   - Describe los cambios
   - Referencia issues relacionados
   - Agrega capturas para cambios UI

3. Espera revisión y feedback

## 📝 Convenciones de Commit

Usa el formato conventional commits:

```
<tipo>(<alcance>): <descripción>

[opcional: cuerpo]

[opcional: footer]
```

### Tipos

| Tipo | Descripción |
|------|-------------|
| `feat` | Nueva feature |
| `fix` | Corrección de bug |
| `docs` | Cambios en documentación |
| `style` | Cambios de formato (espacios, comas, etc) |
| `refactor` | Refactorización de código |
| `perf` | Mejoras de performance |
| `test` | Adición o modificación de tests |
| `chore` | Cambios en procesos de build, herramientas |
| `ci` | Cambios en configuración de CI |
| `build` | Cambios en sistema de build o dependencias |

### Ejemplos

```bash
feat(tasks): add drag and drop for task cards

Fix: resolve issue with task filtering by project

docs: update installation instructions

refactor(auth): simplify login component logic

style: fix indentation in dashboard component

test: add unit tests for project store

chore: update angular to version 20.0.0
```

## 📏 Estándares de Código

### TypeScript

- Usar TypeScript strict mode
- Tipos explícitos para funciones públicas
- Interfaces para tipos de objetos
- Evitar `any` cuando sea posible

```typescript
// ✅ Bueno
interface Project {
  id: number;
  name: string;
  status: Status;
}

function getProjectById(id: number): Project | undefined {
  // ...
}

// ❌ Malo
function getProject(id: any): any {
  // ...
}
```

### Angular

- Usar Signals para estado reactivo
- Componentes standalone
- Inyección de dependencias con `inject()`
- OnPush change detection por defecto

```typescript
// ✅ Bueno
@Component({
  standalone: true,
  selector: 'app-dashboard',
  template: '...'
})
export class DashboardComponent {
  private readonly store = inject(ProjectStore);
  readonly projects = this.store.projects;
}
```

### Estilos

- Usar variables CSS del theme
- BEM methodology para clases
- SCSS para anidamiento limitado (max 3 niveles)

```scss
// ✅ Bueno
.dashboard-card {
  &__header {
    color: var(--text-primary);
  }

  &__content {
    // ...
  }
}
```

### Nombres

- **Componentes**: PascalCase + "Component"
- **Servicios**: PascalCase + "Service"
- **Models/Interfaces**: PascalCase
- **Functions/Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Files**: kebab-case

```typescript
// Componentes
export class ProjectsBoardComponent {}

// Servicios
export class ProjectOpsService {}

// Interfaces
export interface ProjectMetrics {}

// Funciones
function getProjectsList(): void {}

// Constantes
export const API_BASE_URL = 'https://api.example.com';

// Archivos
projects-board.component.ts
project.store.ts
```

## 🧪 Testing

### Unit Tests

```bash
# Ejecutar tests
npm test

# Con coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### E2E Tests

```bash
# Ejecutar E2E
npm run e2e
```

### Directrices

- Test unit tests para servicios y stores
- Test de componentes para interacciones de usuario
- Cobertura mínima: 70%
- Tests descriptivos con `describe` y `it`

```typescript
describe('ProjectStore', () => {
  it('should return filtered projects by status', () => {
    // Arrange
    const store = new ProjectStore();

    // Act
    store.updateFilters({ status: 'active' });

    // Assert
    expect(store.filteredProjects().length).toBe(3);
  });
});
```

## 📚 Recursos

- [Angular Documentation](https://angular.dev)
- [Angular Signals Guide](https://angular.dev/guide/signals)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## 💬 Preguntas

¿Tienes preguntas? Abre un issue con la etiqueta `question`.

---

¡Gracias por contribuir a ProjectOps Dashboard! 🎉
