import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
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

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getTasks(): Observable<TaskResponse[]> {
    return this.http.get<TaskResponse[]>(`${this.baseUrl}/tasks`);
  }

  getTaskById(id: string): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(`${this.baseUrl}/tasks/${id}`);
  }

  createTask(payload: CreateTaskRequest): Observable<TaskResponse> {
    return this.http.post<TaskResponse>(`${this.baseUrl}/tasks`, payload);
  }

  updateTask(id: string, payload: UpdateTaskRequest): Observable<TaskResponse> {
    return this.http.put<TaskResponse>(`${this.baseUrl}/tasks/${id}`, payload);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tasks/${id}`);
  }

  getCategories(): Observable<CategoryResponse[]> {
    return this.http.get<CategoryResponse[]>(`${this.baseUrl}/categories`);
  }

  createCategory(
    payload: CreateCategoryRequest,
  ): Observable<CategoryResponse> {
    return this.http.post<CategoryResponse>(
      `${this.baseUrl}/categories`,
      payload,
    );
  }

  updateCategory(
    id: string,
    payload: UpdateCategoryRequest,
  ): Observable<CategoryResponse> {
    return this.http.put<CategoryResponse>(
      `${this.baseUrl}/categories/${id}`,
      payload,
    );
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/categories/${id}`);
  }

  getTags(): Observable<TagResponse[]> {
    return this.http.get<TagResponse[]>(`${this.baseUrl}/tags`);
  }

  createTag(payload: CreateTagRequest): Observable<TagResponse> {
    return this.http.post<TagResponse>(`${this.baseUrl}/tags`, payload);
  }

  deleteTag(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tags/${id}`);
  }
}
