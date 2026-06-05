import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { catchError, Observable, switchMap } from 'rxjs';
import { TaskService } from '../../core/services/task.service';
import type {
  CategoryResponse,
  TagResponse,
  TaskResponse,
} from '../../shared/models/dto';
import {
  CreateCategory,
  CreateCategoryFailure,
  CreateCategorySuccess,
  CreateTag,
  CreateTagFailure,
  CreateTagSuccess,
  CreateTask,
  CreateTaskFailure,
  CreateTaskSuccess,
  DeleteCategory,
  DeleteCategoryFailure,
  DeleteCategorySuccess,
  DeleteTag,
  DeleteTagFailure,
  DeleteTagSuccess,
  DeleteTask,
  DeleteTaskFailure,
  DeleteTaskSuccess,
  LoadCategories,
  LoadCategoriesFailure,
  LoadCategoriesSuccess,
  LoadTags,
  LoadTagsFailure,
  LoadTagsSuccess,
  LoadTasks,
  LoadTasksFailure,
  LoadTasksSuccess,
  UpdateCategory,
  UpdateCategoryFailure,
  UpdateCategorySuccess,
  UpdateTask,
  UpdateTaskFailure,
  UpdateTaskSuccess,
} from './tasks.actions';

export interface TasksStateModel {
  tasks: TaskResponse[];
  categories: CategoryResponse[];
  tags: TagResponse[];
  loading: boolean;
  error: string | null;
}

const defaults: TasksStateModel = {
  tasks: [],
  categories: [],
  tags: [],
  loading: false,
  error: null,
};

@State<TasksStateModel>({
  name: 'tasks',
  defaults,
})
@Injectable()
export class TasksState {
  constructor(private readonly taskService: TaskService) {}

  // ─── Selectors ─────────────────────────────────────

  @Selector()
  static tasks(state: TasksStateModel): TaskResponse[] {
    return state.tasks;
  }

  @Selector()
  static categories(state: TasksStateModel): CategoryResponse[] {
    return state.categories;
  }

  @Selector()
  static tags(state: TasksStateModel): TagResponse[] {
    return state.tags;
  }

  @Selector()
  static loading(state: TasksStateModel): boolean {
    return state.loading;
  }

  @Selector()
  static error(state: TasksStateModel): string | null {
    return state.error;
  }

  // ─── Tasks ─────────────────────────────────────────

  @Action(LoadTasks)
  loadTasks(ctx: StateContext<TasksStateModel>): Observable<unknown> {
    ctx.patchState({ loading: true, error: null });
    return this.taskService.getTasks().pipe(
      switchMap((response) => ctx.dispatch(new LoadTasksSuccess(response))),
      catchError((err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'Failed to load tasks';
        return ctx.dispatch(new LoadTasksFailure({ error: message }));
      }),
    );
  }

  @Action(LoadTasksSuccess)
  loadTasksSuccess(
    ctx: StateContext<TasksStateModel>,
    action: LoadTasksSuccess,
  ): void {
    ctx.patchState({ tasks: action.payload, loading: false });
  }

  @Action(LoadTasksFailure)
  loadTasksFailure(
    ctx: StateContext<TasksStateModel>,
    action: LoadTasksFailure,
  ): void {
    ctx.patchState({ loading: false, error: action.payload.error });
  }

  @Action(CreateTask)
  createTask(
    ctx: StateContext<TasksStateModel>,
    action: CreateTask,
  ): Observable<unknown> {
    ctx.patchState({ loading: true, error: null });
    return this.taskService.createTask(action.payload).pipe(
      switchMap((response) => ctx.dispatch(new CreateTaskSuccess(response))),
      catchError((err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'Failed to create task';
        return ctx.dispatch(new CreateTaskFailure({ error: message }));
      }),
    );
  }

  @Action(CreateTaskSuccess)
  createTaskSuccess(
    ctx: StateContext<TasksStateModel>,
    action: CreateTaskSuccess,
  ): void {
    const { tasks } = ctx.getState();
    ctx.patchState({ tasks: [...tasks, action.payload], loading: false });
  }

  @Action(CreateTaskFailure)
  createTaskFailure(
    ctx: StateContext<TasksStateModel>,
    action: CreateTaskFailure,
  ): void {
    ctx.patchState({ loading: false, error: action.payload.error });
  }

  @Action(UpdateTask)
  updateTask(
    ctx: StateContext<TasksStateModel>,
    action: UpdateTask,
  ): Observable<unknown> {
    ctx.patchState({ loading: true, error: null });
    return this.taskService.updateTask(action.id, action.payload).pipe(
      switchMap((response) => ctx.dispatch(new UpdateTaskSuccess(response))),
      catchError((err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'Failed to update task';
        return ctx.dispatch(new UpdateTaskFailure({ error: message }));
      }),
    );
  }

  @Action(UpdateTaskSuccess)
  updateTaskSuccess(
    ctx: StateContext<TasksStateModel>,
    action: UpdateTaskSuccess,
  ): void {
    const { tasks } = ctx.getState();
    ctx.patchState({
      tasks: tasks.map((t) =>
        t.id === action.payload.id ? action.payload : t,
      ),
      loading: false,
    });
  }

  @Action(UpdateTaskFailure)
  updateTaskFailure(
    ctx: StateContext<TasksStateModel>,
    action: UpdateTaskFailure,
  ): void {
    ctx.patchState({ loading: false, error: action.payload.error });
  }

  @Action(DeleteTask)
  deleteTask(
    ctx: StateContext<TasksStateModel>,
    action: DeleteTask,
  ): Observable<unknown> {
    ctx.patchState({ loading: true, error: null });
    return this.taskService.deleteTask(action.id).pipe(
      switchMap(() => ctx.dispatch(new DeleteTaskSuccess(action.id))),
      catchError((err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'Failed to delete task';
        return ctx.dispatch(new DeleteTaskFailure({ error: message }));
      }),
    );
  }

  @Action(DeleteTaskSuccess)
  deleteTaskSuccess(
    ctx: StateContext<TasksStateModel>,
    action: DeleteTaskSuccess,
  ): void {
    const { tasks } = ctx.getState();
    ctx.patchState({
      tasks: tasks.filter((t) => t.id !== action.id),
      loading: false,
    });
  }

  @Action(DeleteTaskFailure)
  deleteTaskFailure(
    ctx: StateContext<TasksStateModel>,
    action: DeleteTaskFailure,
  ): void {
    ctx.patchState({ loading: false, error: action.payload.error });
  }

  // ─── Categories ────────────────────────────────────

  @Action(LoadCategories)
  loadCategories(ctx: StateContext<TasksStateModel>): Observable<unknown> {
    ctx.patchState({ loading: true, error: null });
    return this.taskService.getCategories().pipe(
      switchMap((response) =>
        ctx.dispatch(new LoadCategoriesSuccess(response)),
      ),
      catchError((err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'Failed to load categories';
        return ctx.dispatch(new LoadCategoriesFailure({ error: message }));
      }),
    );
  }

  @Action(LoadCategoriesSuccess)
  loadCategoriesSuccess(
    ctx: StateContext<TasksStateModel>,
    action: LoadCategoriesSuccess,
  ): void {
    ctx.patchState({ categories: action.payload, loading: false });
  }

  @Action(LoadCategoriesFailure)
  loadCategoriesFailure(
    ctx: StateContext<TasksStateModel>,
    action: LoadCategoriesFailure,
  ): void {
    ctx.patchState({ loading: false, error: action.payload.error });
  }

  @Action(CreateCategory)
  createCategory(
    ctx: StateContext<TasksStateModel>,
    action: CreateCategory,
  ): Observable<unknown> {
    ctx.patchState({ loading: true, error: null });
    return this.taskService.createCategory(action.payload).pipe(
      switchMap((response) =>
        ctx.dispatch(new CreateCategorySuccess(response)),
      ),
      catchError((err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'Failed to create category';
        return ctx.dispatch(new CreateCategoryFailure({ error: message }));
      }),
    );
  }

  @Action(CreateCategorySuccess)
  createCategorySuccess(
    ctx: StateContext<TasksStateModel>,
    action: CreateCategorySuccess,
  ): void {
    const { categories } = ctx.getState();
    ctx.patchState({
      categories: [...categories, action.payload],
      loading: false,
    });
  }

  @Action(CreateCategoryFailure)
  createCategoryFailure(
    ctx: StateContext<TasksStateModel>,
    action: CreateCategoryFailure,
  ): void {
    ctx.patchState({ loading: false, error: action.payload.error });
  }

  @Action(UpdateCategory)
  updateCategory(
    ctx: StateContext<TasksStateModel>,
    action: UpdateCategory,
  ): Observable<unknown> {
    ctx.patchState({ loading: true, error: null });
    return this.taskService.updateCategory(action.id, action.payload).pipe(
      switchMap((response) =>
        ctx.dispatch(new UpdateCategorySuccess(response)),
      ),
      catchError((err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'Failed to update category';
        return ctx.dispatch(new UpdateCategoryFailure({ error: message }));
      }),
    );
  }

  @Action(UpdateCategorySuccess)
  updateCategorySuccess(
    ctx: StateContext<TasksStateModel>,
    action: UpdateCategorySuccess,
  ): void {
    const { categories } = ctx.getState();
    ctx.patchState({
      categories: categories.map((c) =>
        c.id === action.payload.id ? action.payload : c,
      ),
      loading: false,
    });
  }

  @Action(UpdateCategoryFailure)
  updateCategoryFailure(
    ctx: StateContext<TasksStateModel>,
    action: UpdateCategoryFailure,
  ): void {
    ctx.patchState({ loading: false, error: action.payload.error });
  }

  @Action(DeleteCategory)
  deleteCategory(
    ctx: StateContext<TasksStateModel>,
    action: DeleteCategory,
  ): Observable<unknown> {
    ctx.patchState({ loading: true, error: null });
    return this.taskService.deleteCategory(action.id).pipe(
      switchMap(() => ctx.dispatch(new DeleteCategorySuccess(action.id))),
      catchError((err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'Failed to delete category';
        return ctx.dispatch(new DeleteCategoryFailure({ error: message }));
      }),
    );
  }

  @Action(DeleteCategorySuccess)
  deleteCategorySuccess(
    ctx: StateContext<TasksStateModel>,
    action: DeleteCategorySuccess,
  ): void {
    const { categories } = ctx.getState();
    ctx.patchState({
      categories: categories.filter((c) => c.id !== action.id),
      loading: false,
    });
  }

  @Action(DeleteCategoryFailure)
  deleteCategoryFailure(
    ctx: StateContext<TasksStateModel>,
    action: DeleteCategoryFailure,
  ): void {
    ctx.patchState({ loading: false, error: action.payload.error });
  }

  // ─── Tags ──────────────────────────────────────────

  @Action(LoadTags)
  loadTags(ctx: StateContext<TasksStateModel>): Observable<unknown> {
    ctx.patchState({ loading: true, error: null });
    return this.taskService.getTags().pipe(
      switchMap((response) => ctx.dispatch(new LoadTagsSuccess(response))),
      catchError((err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'Failed to load tags';
        return ctx.dispatch(new LoadTagsFailure({ error: message }));
      }),
    );
  }

  @Action(LoadTagsSuccess)
  loadTagsSuccess(
    ctx: StateContext<TasksStateModel>,
    action: LoadTagsSuccess,
  ): void {
    ctx.patchState({ tags: action.payload, loading: false });
  }

  @Action(LoadTagsFailure)
  loadTagsFailure(
    ctx: StateContext<TasksStateModel>,
    action: LoadTagsFailure,
  ): void {
    ctx.patchState({ loading: false, error: action.payload.error });
  }

  @Action(CreateTag)
  createTag(
    ctx: StateContext<TasksStateModel>,
    action: CreateTag,
  ): Observable<unknown> {
    ctx.patchState({ loading: true, error: null });
    return this.taskService.createTag(action.payload).pipe(
      switchMap((response) => ctx.dispatch(new CreateTagSuccess(response))),
      catchError((err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'Failed to create tag';
        return ctx.dispatch(new CreateTagFailure({ error: message }));
      }),
    );
  }

  @Action(CreateTagSuccess)
  createTagSuccess(
    ctx: StateContext<TasksStateModel>,
    action: CreateTagSuccess,
  ): void {
    const { tags } = ctx.getState();
    ctx.patchState({ tags: [...tags, action.payload], loading: false });
  }

  @Action(CreateTagFailure)
  createTagFailure(
    ctx: StateContext<TasksStateModel>,
    action: CreateTagFailure,
  ): void {
    ctx.patchState({ loading: false, error: action.payload.error });
  }

  @Action(DeleteTag)
  deleteTag(
    ctx: StateContext<TasksStateModel>,
    action: DeleteTag,
  ): Observable<unknown> {
    ctx.patchState({ loading: true, error: null });
    return this.taskService.deleteTag(action.id).pipe(
      switchMap(() => ctx.dispatch(new DeleteTagSuccess(action.id))),
      catchError((err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'Failed to delete tag';
        return ctx.dispatch(new DeleteTagFailure({ error: message }));
      }),
    );
  }

  @Action(DeleteTagSuccess)
  deleteTagSuccess(
    ctx: StateContext<TasksStateModel>,
    action: DeleteTagSuccess,
  ): void {
    const { tags } = ctx.getState();
    ctx.patchState({ tags: tags.filter((t) => t.id !== action.id), loading: false });
  }

  @Action(DeleteTagFailure)
  deleteTagFailure(
    ctx: StateContext<TasksStateModel>,
    action: DeleteTagFailure,
  ): void {
    ctx.patchState({ loading: false, error: action.payload.error });
  }
}
