# Todo List

Angular 21 task management app with PrimeNG and Nora theme. Standalone components, Reactive Forms, feature-based architecture.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Angular 21.1 |
| UI | PrimeNG 21.1 + PrimeUIX Nora + PrimeIcons |
| Forms | ReactiveForms (FormGroup + FormArray) |
| Testing | Vitest 4 |
| Build | @angular/build 21 |

## Architecture

```
src/
├── app/
│   ├── core/                    # Guards, interceptors, NGXS store (empty — ready)
│   ├── features/
│   │   ├── auth/
│   │   │   ├── login/           # LoginComponent
│   │   │   └── register/        # RegisterComponent
│   │   └── dashboard/
│   │       ├── dashboard.component.ts       # Smart component (state + orchestration)
│   │       └── task-detail-panel/           # Dumb component (form + validation)
│   └── shared/
│       ├── enums/
│       │   └── task-status.enum.ts
│       ├── models/dto/          # 1:1 interfaces with backend DTOs
│       └── pipes/               # Presentation pipes (status → label/icon/severity)
├── styles.css                   # Global reset + @layer primeng
└── main.ts                      # bootstrapApplication
```

### Smart / Dumb Component Pattern

- **DashboardComponent** (Smart): owns data, controls panel visibility, orchestrates confirmations with `ConfirmationService`.
- **TaskDetailPanelComponent** (Dumb): receives data via `@Input()`, emits events via `@Output()`, no external dependencies.

### Reactive Forms

- `FormGroup` with synchronous validators (`required`, `maxlength`, `futureDate`).
- `FormArray` for dynamic subtasks (add / remove).
- Error messages use PrimeNG semantic class `.p-error`.

## Tests

**75 tests / 4 files — all green.**

| File | Tests |
|------|-------|
| `app.spec.ts` | 2 |
| `login.component.spec.ts` | 17 |
| `register.component.spec.ts` | 17 |
| `task-detail-panel.component.spec.ts` | 39 |

## Commands

```bash
ng serve          # Dev server (http://localhost:4200)
ng build          # Production build → dist/
ng test           # Unit tests (Vitest)
```

## Progress

- [x] Dashboard layout with splitter (sidebar + task list + detail panel)
- [x] Task form with Reactive Forms + full validation
- [x] Dynamic subtasks with FormArray
- [x] Backend DTOs replicated in TypeScript
- [x] Presentation pipes (status → label / icon / severity)
- [x] Delete confirmation with p-confirmDialog
- [x] Login and Register centered layout
- [x] 75 unit tests passing
- [ ] API REST connection (NGXS store + HTTP services)
- [ ] JWT authentication
