import type { TaskStatus } from '../../enums/task-status.enum';
import type { TagResponse } from './tag.dto';

// Mirror the backend .NET DTOs 1:1 — these are the API contracts

export interface SubTaskResponse {
  title: string;
  isDone: boolean;
}

export interface TaskResponse {
  id: string;
  title: string;
  description: string | null;
  dueDate: Date | null;
  status: TaskStatus;
  categoryId: string | null;
  subTasks: SubTaskResponse[];
  tags: TagResponse[];
}

export interface CreateSubTaskRequest {
  title: string;
  isDone: boolean;
}

export interface CreateTaskRequest {
  title: string;
  description: string | null;
  dueDate: Date | null;
  status: number;
  categoryId: string | null;
  subTasks: CreateSubTaskRequest[];
  tagIds: string[];
}

export interface UpdateSubTaskRequest {
  title: string;
  isDone: boolean;
}

export interface UpdateTaskRequest {
  title: string;
  description: string | null;
  dueDate: Date | null;
  status: number;
  categoryId: string | null;
  subTasks: UpdateSubTaskRequest[];
  tagIds: string[];
}
