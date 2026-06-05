import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { TaskStatus } from '../../shared/enums/task-status.enum';
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
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), TaskService],
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getTasks', () => {
    it('should GET /tasks', () => {
      const mock: TaskResponse[] = [
        {
          id: '1',
          title: 'Test',
          description: null,
          dueDate: null,
          status: TaskStatus.NonStarted,
          categoryId: null,
          subTasks: [],
          tags: [],
        },
      ];

      service.getTasks().subscribe((res) => expect(res).toEqual(mock));

      const req = httpMock.expectOne(`${apiUrl}/tasks`);
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('getTaskById', () => {
    it('should GET /tasks/{id}', () => {
      const mock: TaskResponse = {
        id: '42',
        title: 'Single task',
        description: 'desc',
        dueDate: null,
        status: TaskStatus.InProgress,
        categoryId: null,
        subTasks: [],
        tags: [],
      };

      service.getTaskById('42').subscribe((res) => expect(res).toEqual(mock));

      const req = httpMock.expectOne(`${apiUrl}/tasks/42`);
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('createTask', () => {
    it('should POST /tasks with payload', () => {
      const payload: CreateTaskRequest = {
        title: 'New task',
        description: null,
        dueDate: null,
        status: TaskStatus.NonStarted,
        categoryId: null,
        subTasks: [],
        tagIds: [],
      };
      const mock: TaskResponse = { ...payload, id: '99', subTasks: [], tags: [] };

      service.createTask(payload).subscribe((res) => expect(res).toEqual(mock));

      const req = httpMock.expectOne(`${apiUrl}/tasks`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush(mock);
    });
  });

  describe('updateTask', () => {
    it('should PUT /tasks/{id} with payload', () => {
      const payload: UpdateTaskRequest = {
        title: 'Updated',
        description: null,
        dueDate: null,
        status: TaskStatus.Finished,
        categoryId: null,
        subTasks: [],
        tagIds: [],
      };
      const mock: TaskResponse = { ...payload, id: '7', subTasks: [], tags: [] };

      service.updateTask('7', payload).subscribe((res) => expect(res).toEqual(mock));

      const req = httpMock.expectOne(`${apiUrl}/tasks/7`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(payload);
      req.flush(mock);
    });
  });

  describe('deleteTask', () => {
    it('should DELETE /tasks/{id}', () => {
      service.deleteTask('5').subscribe();

      const req = httpMock.expectOne(`${apiUrl}/tasks/5`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('getCategories', () => {
    it('should GET /categories', () => {
      const mock: CategoryResponse[] = [
        { id: 'c1', name: 'Work' },
        { id: 'c2', name: 'Personal' },
      ];

      service.getCategories().subscribe((res) => expect(res).toEqual(mock));

      const req = httpMock.expectOne(`${apiUrl}/categories`);
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('createCategory', () => {
    it('should POST /categories with payload', () => {
      const payload: CreateCategoryRequest = { name: 'Health' };
      const mock: CategoryResponse = { id: 'c3', name: 'Health' };

      service
        .createCategory(payload)
        .subscribe((res) => expect(res).toEqual(mock));

      const req = httpMock.expectOne(`${apiUrl}/categories`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush(mock);
    });
  });

  describe('updateCategory', () => {
    it('should PUT /categories/{id} with payload', () => {
      const payload: UpdateCategoryRequest = { name: 'Renamed' };
      const mock: CategoryResponse = { id: 'c1', name: 'Renamed' };

      service
        .updateCategory('c1', payload)
        .subscribe((res) => expect(res).toEqual(mock));

      const req = httpMock.expectOne(`${apiUrl}/categories/c1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(payload);
      req.flush(mock);
    });
  });

  describe('deleteCategory', () => {
    it('should DELETE /categories/{id}', () => {
      service.deleteCategory('c99').subscribe();

      const req = httpMock.expectOne(`${apiUrl}/categories/c99`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('getTags', () => {
    it('should GET /tags', () => {
      const mock: TagResponse[] = [
        { id: 't1', name: 'Dev' },
        { id: 't2', name: 'Design' },
      ];

      service.getTags().subscribe((res) => expect(res).toEqual(mock));

      const req = httpMock.expectOne(`${apiUrl}/tags`);
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('createTag', () => {
    it('should POST /tags with payload', () => {
      const payload: CreateTagRequest = { name: 'Testing' };
      const mock: TagResponse = { id: 't3', name: 'Testing' };

      service.createTag(payload).subscribe((res) => expect(res).toEqual(mock));

      const req = httpMock.expectOne(`${apiUrl}/tags`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush(mock);
    });
  });

  describe('deleteTag', () => {
    it('should DELETE /tags/{id}', () => {
      service.deleteTag('t5').subscribe();

      const req = httpMock.expectOne(`${apiUrl}/tags/t5`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
