import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import type { CategoryResponse, TagResponse, TaskResponse } from '../../shared/models/dto';

export interface TasksStateModel {
  tasks: TaskResponse[];
  categories: CategoryResponse[];
  tags: TagResponse[];
  loading: boolean;
}

@State<TasksStateModel>({
  name: 'tasks',
  defaults: {
    tasks: [],
    categories: [],
    tags: [],
    loading: false,
  },
})
@Injectable()
export class TasksState {}
