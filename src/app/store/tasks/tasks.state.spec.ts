import { TestBed } from '@angular/core/testing';
import { provideStore, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { TaskService } from '../../core/services/task.service';
import { TaskStatus } from '../../shared/enums/task-status.enum';
import type {
  CategoryResponse,
  CreateTaskRequest,
  TagResponse,
  TaskResponse,
  UpdateTaskRequest,
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
import { TasksState, type TasksStateModel } from './tasks.state';

describe('TasksState', () => {
  let store: Store;
  let taskServiceMock: {
    getTasks: ReturnType<typeof vi.fn>;
    getTaskById: ReturnType<typeof vi.fn>;
    createTask: ReturnType<typeof vi.fn>;
    updateTask: ReturnType<typeof vi.fn>;
    deleteTask: ReturnType<typeof vi.fn>;
    getCategories: ReturnType<typeof vi.fn>;
    createCategory: ReturnType<typeof vi.fn>;
    updateCategory: ReturnType<typeof vi.fn>;
    deleteCategory: ReturnType<typeof vi.fn>;
    getTags: ReturnType<typeof vi.fn>;
    createTag: ReturnType<typeof vi.fn>;
    deleteTag: ReturnType<typeof vi.fn>;
  };

  function mockTask(overrides?: Partial<TaskResponse>): TaskResponse {
    return {
      id: 't1',
      title: 'Test task',
      description: null,
      dueDate: null,
      status: TaskStatus.NonStarted,
      categoryId: null,
      subTasks: [],
      tags: [],
      ...overrides,
    };
  }

  function mockCategory(
    overrides?: Partial<CategoryResponse>,
  ): CategoryResponse {
    return { id: 'c1', name: 'Work', ...overrides };
  }

  function mockTag(overrides?: Partial<TagResponse>): TagResponse {
    return { id: 'g1', name: 'Dev', ...overrides };
  }

  function configureStore(): void {
    taskServiceMock = {
      getTasks: vi.fn(),
      getTaskById: vi.fn(),
      createTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
      getCategories: vi.fn(),
      createCategory: vi.fn(),
      updateCategory: vi.fn(),
      deleteCategory: vi.fn(),
      getTags: vi.fn(),
      createTag: vi.fn(),
      deleteTag: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideStore([TasksState]),
        { provide: TaskService, useValue: taskServiceMock },
      ],
    }).compileComponents();
    store = TestBed.inject(Store);
  }

  function snapshot(): TasksStateModel {
    return store.selectSnapshot<TasksStateModel>((s) => s.tasks);
  }

  beforeEach(() => {
    configureStore();
  });

  describe('initial state', () => {
    it('should have default values', () => {
      const state = snapshot();
      expect(state.tasks).toEqual([]);
      expect(state.categories).toEqual([]);
      expect(state.tags).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('selectors', () => {
    it('TasksState.tasks should return empty array initially', () => {
      expect(TasksState.tasks(snapshot())).toEqual([]);
    });

    it('TasksState.categories should return empty array initially', () => {
      expect(TasksState.categories(snapshot())).toEqual([]);
    });

    it('TasksState.tags should return empty array initially', () => {
      expect(TasksState.tags(snapshot())).toEqual([]);
    });

    it('TasksState.loading should return false initially', () => {
      expect(TasksState.loading(snapshot())).toBe(false);
    });

    it('TasksState.error should return null initially', () => {
      expect(TasksState.error(snapshot())).toBeNull();
    });
  });

  // ─── Tasks ───────────────────────────────────────

  describe('LoadTasks', () => {
    it('should call taskService.getTasks', () => {
      taskServiceMock.getTasks.mockReturnValue(of([mockTask()]));
      store.dispatch(new LoadTasks());
      expect(taskServiceMock.getTasks).toHaveBeenCalled();
    });

    it('should populate tasks on success', () => {
      const tasks = [mockTask({ id: '1' }), mockTask({ id: '2' })];
      store.dispatch(new LoadTasksSuccess(tasks));

      expect(TasksState.tasks(snapshot())).toEqual(tasks);
      expect(TasksState.loading(snapshot())).toBe(false);
    });

    it('should set error on failure', () => {
      store.dispatch(new LoadTasksFailure({ error: 'Network error' }));

      expect(TasksState.error(snapshot())).toBe('Network error');
      expect(TasksState.loading(snapshot())).toBe(false);
    });
  });

  describe('CreateTask', () => {
    it('should call taskService.createTask with payload', () => {
      const payload: CreateTaskRequest = {
        title: 'New',
        description: null,
        dueDate: null,
        status: TaskStatus.NonStarted,
        categoryId: null,
        subTasks: [],
        tagIds: [],
      };
      taskServiceMock.createTask.mockReturnValue(of(mockTask({ id: 'new' })));
      store.dispatch(new CreateTask(payload));
      expect(taskServiceMock.createTask).toHaveBeenCalledWith(payload);
    });

    it('should append task to list on success', () => {
      const existing = mockTask({ id: '1', title: 'Existing' });
      store.dispatch(new LoadTasksSuccess([existing]));

      const created = mockTask({ id: '2', title: 'Created' });
      store.dispatch(new CreateTaskSuccess(created));

      expect(TasksState.tasks(snapshot())).toEqual([existing, created]);
    });

    it('should set error on failure', () => {
      store.dispatch(new CreateTaskFailure({ error: 'Create failed' }));
      expect(TasksState.error(snapshot())).toBe('Create failed');
    });
  });

  describe('UpdateTask', () => {
    it('should call taskService.updateTask with id and payload', () => {
      const payload: UpdateTaskRequest = {
        title: 'Updated',
        description: null,
        dueDate: null,
        status: TaskStatus.Finished,
        categoryId: null,
        subTasks: [],
        tagIds: [],
      };
      taskServiceMock.updateTask.mockReturnValue(
        of(mockTask({ id: 't1', title: 'Updated' })),
      );
      store.dispatch(new UpdateTask('t1', payload));
      expect(taskServiceMock.updateTask).toHaveBeenCalledWith('t1', payload);
    });

    it('should replace task in list on success', () => {
      store.dispatch(new LoadTasksSuccess([mockTask({ id: 't1', title: 'Old' })]));
      store.dispatch(
        new UpdateTaskSuccess(mockTask({ id: 't1', title: 'New' })),
      );

      expect(TasksState.tasks(snapshot())).toEqual([
        mockTask({ id: 't1', title: 'New' }),
      ]);
    });
  });

  describe('DeleteTask', () => {
    it('should call taskService.deleteTask with id', () => {
      taskServiceMock.deleteTask.mockReturnValue(of(void 0));
      store.dispatch(new DeleteTask('t1'));
      expect(taskServiceMock.deleteTask).toHaveBeenCalledWith('t1');
    });

    it('should remove task from list on success', () => {
      store.dispatch(
        new LoadTasksSuccess([
          mockTask({ id: 'a' }),
          mockTask({ id: 'b' }),
        ]),
      );
      store.dispatch(new DeleteTaskSuccess('a'));

      expect(TasksState.tasks(snapshot())).toEqual([mockTask({ id: 'b' })]);
    });

    it('should set error on failure', () => {
      store.dispatch(new DeleteTaskFailure({ error: 'Delete failed' }));
      expect(TasksState.error(snapshot())).toBe('Delete failed');
    });
  });

  // ─── Categories ──────────────────────────────────

  describe('LoadCategories', () => {
    it('should call taskService.getCategories', () => {
      taskServiceMock.getCategories.mockReturnValue(of([mockCategory()]));
      store.dispatch(new LoadCategories());
      expect(taskServiceMock.getCategories).toHaveBeenCalled();
    });

    it('should populate categories on success', () => {
      const cats = [mockCategory({ id: 'c1' }), mockCategory({ id: 'c2' })];
      store.dispatch(new LoadCategoriesSuccess(cats));

      expect(TasksState.categories(snapshot())).toEqual(cats);
    });

    it('should set error on failure', () => {
      store.dispatch(new LoadCategoriesFailure({ error: 'Oops' }));
      expect(TasksState.error(snapshot())).toBe('Oops');
    });
  });

  describe('CreateCategory', () => {
    it('should call taskService.createCategory with payload', () => {
      taskServiceMock.createCategory.mockReturnValue(
        of(mockCategory({ id: 'new' })),
      );
      store.dispatch(new CreateCategory({ name: 'Health' }));
      expect(taskServiceMock.createCategory).toHaveBeenCalledWith({
        name: 'Health',
      });
    });

    it('should append category on success', () => {
      store.dispatch(new CreateCategorySuccess(mockCategory({ id: 'c2' })));
      expect(TasksState.categories(snapshot())).toEqual([
        mockCategory({ id: 'c2' }),
      ]);
    });

    it('should set error on failure', () => {
      store.dispatch(new CreateCategoryFailure({ error: 'Fail' }));
      expect(TasksState.error(snapshot())).toBe('Fail');
    });
  });

  describe('UpdateCategory', () => {
    it('should call taskService.updateCategory with id and payload', () => {
      taskServiceMock.updateCategory.mockReturnValue(
        of(mockCategory({ id: 'c1', name: 'Renamed' })),
      );
      store.dispatch(new UpdateCategory('c1', { name: 'Renamed' }));
      expect(taskServiceMock.updateCategory).toHaveBeenCalledWith('c1', {
        name: 'Renamed',
      });
    });

    it('should replace category in list on success', () => {
      store.dispatch(
        new LoadCategoriesSuccess([mockCategory({ id: 'c1', name: 'Old' })]),
      );
      store.dispatch(
        new UpdateCategorySuccess(mockCategory({ id: 'c1', name: 'New' })),
      );

      expect(TasksState.categories(snapshot())).toEqual([
        mockCategory({ id: 'c1', name: 'New' }),
      ]);
    });
  });

  describe('DeleteCategory', () => {
    it('should remove category from list on success', () => {
      store.dispatch(
        new LoadCategoriesSuccess([
          mockCategory({ id: 'a' }),
          mockCategory({ id: 'b' }),
        ]),
      );
      store.dispatch(new DeleteCategorySuccess('a'));

      expect(TasksState.categories(snapshot())).toEqual([
        mockCategory({ id: 'b' }),
      ]);
    });
  });

  // ─── Tags ─────────────────────────────────────────

  describe('LoadTags', () => {
    it('should call taskService.getTags', () => {
      taskServiceMock.getTags.mockReturnValue(of([mockTag()]));
      store.dispatch(new LoadTags());
      expect(taskServiceMock.getTags).toHaveBeenCalled();
    });

    it('should populate tags on success', () => {
      const tags = [mockTag({ id: 'g1' }), mockTag({ id: 'g2' })];
      store.dispatch(new LoadTagsSuccess(tags));

      expect(TasksState.tags(snapshot())).toEqual(tags);
    });
  });

  describe('CreateTag', () => {
    it('should append tag on success', () => {
      store.dispatch(new CreateTagSuccess(mockTag({ id: 'g2' })));
      expect(TasksState.tags(snapshot())).toEqual([mockTag({ id: 'g2' })]);
    });

    it('should set error on failure', () => {
      store.dispatch(new CreateTagFailure({ error: 'Tag fail' }));
      expect(TasksState.error(snapshot())).toBe('Tag fail');
    });
  });

  describe('DeleteTag', () => {
    it('should remove tag from list on success', () => {
      store.dispatch(
        new LoadTagsSuccess([mockTag({ id: 'a' }), mockTag({ id: 'b' })]),
      );
      store.dispatch(new DeleteTagSuccess('a'));

      expect(TasksState.tags(snapshot())).toEqual([mockTag({ id: 'b' })]);
    });
  });

  describe('state transitions with mocked service', () => {
    it('should go through full load → create → update → delete flow', () => {
      taskServiceMock.getTasks.mockReturnValue(of([mockTask({ id: '1' })]));
      taskServiceMock.createTask.mockReturnValue(
        of(mockTask({ id: '2', title: 'New' })),
      );
      taskServiceMock.updateTask.mockReturnValue(
        of(mockTask({ id: '1', title: 'Updated' })),
      );
      taskServiceMock.deleteTask.mockReturnValue(of(void 0));

      store.dispatch(new LoadTasks());
      store.dispatch(new LoadTasksSuccess([mockTask({ id: '1' })]));
      expect(TasksState.tasks(snapshot()).length).toBe(1);

      store.dispatch(new CreateTaskSuccess(mockTask({ id: '2', title: 'New' })));
      expect(TasksState.tasks(snapshot()).length).toBe(2);

      store.dispatch(
        new UpdateTaskSuccess(mockTask({ id: '1', title: 'Updated' })),
      );
      expect(TasksState.tasks(snapshot())[0].title).toBe('Updated');

      store.dispatch(new DeleteTaskSuccess('2'));
      expect(TasksState.tasks(snapshot()).length).toBe(1);
    });
  });
});
