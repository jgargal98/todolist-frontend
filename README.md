# TaskFlow — Frontend

Aplicación Angular 19+ de gestión de tareas con PrimeNG y tema Nora en modo oscuro. Sigue una arquitectura de componentes standalone con tipado estricto alineado a los DTOs del backend .NET.

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Angular 21.1 |
| UI | PrimeNG 21.1 + Nora theme |
| Estado | NGXS (@ngxs/store) |
| Formularios | ReactiveForms |
| Testing | Vitest 4 |
| Build | @angular/build 21 |

## Arquitectura

```
src/
├── app/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── login/           # LoginComponent — tarjeta centrada, p-password toggle
│   │   │   └── register/        # RegisterComponent — misma simetría, confirmPassword
│   │   └── dashboard/           # DashboardComponent — splitter 3 paneles, tareas
│   └── shared/
│       ├── enums/
│       │   └── task-status.enum.ts
│       ├── models/
│       │   └── dto/             # Interfaces TypeScript 1:1 con DTOs del backend
│       └── pipes/
│           ├── task-status-label.pipe.ts
│           ├── task-status-severity.pipe.ts
│           └── task-status-icon.pipe.ts
```

### DTOs del backend replicados (`shared/models/dto/`)

| Archivo | DTOs |
|---------|------|
| `auth.dto.ts` | `RegisterRequest`, `LoginRequest`, `AuthResponse`, `RefreshRequest` |
| `category.dto.ts` | `CategoryResponse`, `CreateCategoryRequest`, `UpdateCategoryRequest` |
| `tag.dto.ts` | `TagResponse`, `CreateTagRequest` |
| `task.dto.ts` | `TaskResponse`, `SubTaskResponse`, `CreateTaskRequest`, `UpdateTaskRequest` |
| `user.dto.ts` | `UserResponseDto` |

### Enumeraciones (`shared/enums/`)

| Enum | Valores |
|------|---------|
| `TaskStatus` | `NonStarted=1`, `InProgress=2`, `Paused=3`, `Late=4`, `Finished=5` |

## Componentes

### Dashboard (`/dashboard`)

Layout de 3 paneles con `p-splitter`:
- **Izquierdo (20%)**: Filtros, categorías, tags, estados
- **Central (55%)**: Lista de tareas con fecha, subtareas y categoría
- **Derecho (25%)**: Detalle de tarea (título, descripción, clasificación, subtareas)

Todas las entidades usan **GUIDs** como identificadores. Las fechas son objetos `Date` nativos formateados con `date` pipe. Los estados usan el enum `TaskStatus` con valores numéricos 1–5 mapeados directamente a la API.

### Login (`/login`)

Tarjeta centrada (max-width 28rem) sobre fondo oscuro. Campos fluidos con `p-password` + `toggleMask`. Enlace "Forgot password?" y navegación a registro. Sin lógica de autenticación simulada — `onSubmit()` preparado para despachar acción NGXS.

### Register (`/register`)

Misma simetría visual que Login. Incluye `confirmPassword` con validador cruzado de coincidencia. Enlace de navegación a inicio de sesión.

## Comandos

```bash
ng serve          # Servidor de desarrollo (http://localhost:4200)
ng build          # Build producción → dist/
ng test           # Tests unitarios (Vitest) — 30 tests, 3 suites
```

## Tests

Suite actual: **30 tests / 3 archivos** — todos en verde.

| Archivo | Tests |
|---------|-------|
| `app.spec.ts` | 2 |
| `login.component.spec.ts` | 12 |
| `register.component.spec.ts` | 16 |

## Progreso actual

- [x] Layout Dashboard con splitter, filtros, tareas y detalle
- [x] DTOs del backend replicados fielmente en TypeScript
- [x] Enumeraciones estrictas para estados (TaskStatus)
- [x] Pipes de presentación (status → label/icon/severity)
- [x] Login y Register con diseño oscuro centrado y simétrico
- [x] 0 estilos inline en templates (CSS clase-based)
- [x] Build limpio (0 warnings) + 30 tests verdes
- [ ] Conexión con API REST (servicios + NGXS store)
- [ ] Autenticación real con JWT
