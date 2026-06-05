import type {
  CategoryResponse,
  CreateCategoryRequest,
  CreateTagRequest,
  CreateTaskRequest,
  TagResponse,
  TaskResponse,
  UpdateCategoryRequest,
  UpdateTaskRequest,
} from '../../shared/models/dto';

// ─── Tasks ───────────────────────────────────────────

export class LoadTasks {
  static readonly type = '[Tasks] Load';
}

export class LoadTasksSuccess {
  static readonly type = '[Tasks] Load Success';
  constructor(public readonly payload: TaskResponse[]) {}
}

export class LoadTasksFailure {
  static readonly type = '[Tasks] Load Failure';
  constructor(public readonly payload: { error: string }) {}
}

export class CreateTask {
  static readonly type = '[Tasks] Create';
  constructor(public readonly payload: CreateTaskRequest) {}
}

export class CreateTaskSuccess {
  static readonly type = '[Tasks] Create Success';
  constructor(public readonly payload: TaskResponse) {}
}

export class CreateTaskFailure {
  static readonly type = '[Tasks] Create Failure';
  constructor(public readonly payload: { error: string }) {}
}

export class UpdateTask {
  static readonly type = '[Tasks] Update';
  constructor(
    public readonly id: string,
    public readonly payload: UpdateTaskRequest,
  ) {}
}

export class UpdateTaskSuccess {
  static readonly type = '[Tasks] Update Success';
  constructor(public readonly payload: TaskResponse) {}
}

export class UpdateTaskFailure {
  static readonly type = '[Tasks] Update Failure';
  constructor(public readonly payload: { error: string }) {}
}

export class DeleteTask {
  static readonly type = '[Tasks] Delete';
  constructor(public readonly id: string) {}
}

export class DeleteTaskSuccess {
  static readonly type = '[Tasks] Delete Success';
  constructor(public readonly id: string) {}
}

export class DeleteTaskFailure {
  static readonly type = '[Tasks] Delete Failure';
  constructor(public readonly payload: { error: string }) {}
}

// ─── Categories ──────────────────────────────────────

export class LoadCategories {
  static readonly type = '[Categories] Load';
}

export class LoadCategoriesSuccess {
  static readonly type = '[Categories] Load Success';
  constructor(public readonly payload: CategoryResponse[]) {}
}

export class LoadCategoriesFailure {
  static readonly type = '[Categories] Load Failure';
  constructor(public readonly payload: { error: string }) {}
}

export class CreateCategory {
  static readonly type = '[Categories] Create';
  constructor(public readonly payload: CreateCategoryRequest) {}
}

export class CreateCategorySuccess {
  static readonly type = '[Categories] Create Success';
  constructor(public readonly payload: CategoryResponse) {}
}

export class CreateCategoryFailure {
  static readonly type = '[Categories] Create Failure';
  constructor(public readonly payload: { error: string }) {}
}

export class UpdateCategory {
  static readonly type = '[Categories] Update';
  constructor(
    public readonly id: string,
    public readonly payload: UpdateCategoryRequest,
  ) {}
}

export class UpdateCategorySuccess {
  static readonly type = '[Categories] Update Success';
  constructor(public readonly payload: CategoryResponse) {}
}

export class UpdateCategoryFailure {
  static readonly type = '[Categories] Update Failure';
  constructor(public readonly payload: { error: string }) {}
}

export class DeleteCategory {
  static readonly type = '[Categories] Delete';
  constructor(public readonly id: string) {}
}

export class DeleteCategorySuccess {
  static readonly type = '[Categories] Delete Success';
  constructor(public readonly id: string) {}
}

export class DeleteCategoryFailure {
  static readonly type = '[Categories] Delete Failure';
  constructor(public readonly payload: { error: string }) {}
}

// ─── Tags ────────────────────────────────────────────

export class LoadTags {
  static readonly type = '[Tags] Load';
}

export class LoadTagsSuccess {
  static readonly type = '[Tags] Load Success';
  constructor(public readonly payload: TagResponse[]) {}
}

export class LoadTagsFailure {
  static readonly type = '[Tags] Load Failure';
  constructor(public readonly payload: { error: string }) {}
}

export class CreateTag {
  static readonly type = '[Tags] Create';
  constructor(public readonly payload: CreateTagRequest) {}
}

export class CreateTagSuccess {
  static readonly type = '[Tags] Create Success';
  constructor(public readonly payload: TagResponse) {}
}

export class CreateTagFailure {
  static readonly type = '[Tags] Create Failure';
  constructor(public readonly payload: { error: string }) {}
}

export class DeleteTag {
  static readonly type = '[Tags] Delete';
  constructor(public readonly id: string) {}
}

export class DeleteTagSuccess {
  static readonly type = '[Tags] Delete Success';
  constructor(public readonly id: string) {}
}

export class DeleteTagFailure {
  static readonly type = '[Tags] Delete Failure';
  constructor(public readonly payload: { error: string }) {}
}
