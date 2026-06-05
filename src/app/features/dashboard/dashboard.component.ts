import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';

import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';

import { InputTextModule } from 'primeng/inputtext';

import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SelectModule } from 'primeng/select';
import { SplitterModule } from 'primeng/splitter';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';

import { TaskStatus } from '../../shared/enums/task-status.enum';
import type { CategoryResponse, TagResponse, TaskResponse } from '../../shared/models/dto';
import type { CreateTaskRequest } from '../../shared/models/dto';
import { Logout } from '../../store/auth/auth.actions';
import {
  LoadTasks,
  LoadCategories,
  LoadTags,
  CreateTask,
  UpdateTask,
  DeleteTask,
} from '../../store/tasks/tasks.actions';
import { TasksState } from '../../store/tasks/tasks.state';
import {
  TaskStatusIconPipe,
  TaskStatusLabelPipe,
  TaskStatusSeverityPipe,
} from '../../shared/pipes';
import {
  TaskDetailPanelComponent,
  type SelectOption,
} from './task-detail-panel/task-detail-panel.component';

interface CategoryDisplayItem extends CategoryResponse {
  count: number;
}

interface StatusSummaryItem {
  status: TaskStatus;
  count: number;
}

interface TaskDisplayItem extends TaskResponse {
  categoryName: string;
}

@Component({
  selector: 'app-dashboard',
  host: {
    style: 'height: 100vh; width: 100vw; overflow: hidden; display: block;',
  },
  providers: [ConfirmationService],
  imports: [
    FormsModule,
    DatePipe,
    BadgeModule,
    ButtonModule,
    ChipModule,
    ConfirmDialogModule,
    DialogModule,
    DividerModule,
    InputTextModule,
    ScrollPanelModule,
    SelectModule,
    SplitterModule,
    TagModule,
    TextareaModule,
    TaskStatusLabelPipe,
    TaskStatusIconPipe,
    TaskStatusSeverityPipe,
    TaskDetailPanelComponent,
  ],
  templateUrl: './dashboard.component.html',
  styles: [
    `
      .task-row {
        cursor: pointer;
        border-radius: var(--p-border-radius);
        padding: 1rem 0.5rem;
        margin: 0 -0.5rem;
        transition: background-color 0.15s ease;
      }
      .task-row:hover {
        background-color: var(--p-content-hover-background);
      }
    `,
  ],
})
export class DashboardComponent {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  private readonly rawTasks = toSignal(this.store.select(TasksState.tasks), {
    initialValue: [],
  });
  private readonly rawCategories = toSignal(
    this.store.select(TasksState.categories),
    { initialValue: [] },
  );
  readonly tags = toSignal(this.store.select(TasksState.tags), {
    initialValue: [],
  });
  readonly loading = toSignal(this.store.select(TasksState.loading), {
    initialValue: false,
  });

  readonly categories = computed<CategoryDisplayItem[]>(() => {
    const cats = this.rawCategories();
    const tasks = this.rawTasks();
    return cats.map((cat) => ({
      ...cat,
      count: tasks.filter((t) => t.categoryId === cat.id).length,
    }));
  });

  readonly statusItems = computed<StatusSummaryItem[]>(() => {
    const tasks = this.rawTasks();
    return Object.values(TaskStatus)
      .filter((v): v is number => typeof v === 'number')
      .map((status) => ({
        status,
        count: tasks.filter((t) => t.status === status).length,
      }));
  });

  readonly tasks = computed<TaskDisplayItem[]>(() => {
    const tasks = this.rawTasks();
    const cats = this.rawCategories();
    return tasks.map((task) => {
      const cat = cats.find((c) => c.id === task.categoryId);
      return { ...task, categoryName: cat?.name ?? '' };
    });
  });

  readonly statusOptions: SelectOption<number>[] = [
    { label: 'Non Started', value: TaskStatus.NonStarted },
    { label: 'In Progress', value: TaskStatus.InProgress },
    { label: 'Paused', value: TaskStatus.Paused },
    { label: 'Late', value: TaskStatus.Late },
    { label: 'Finished', value: TaskStatus.Finished },
  ];

  readonly categoryOptions = computed<SelectOption[]>(() =>
    this.rawCategories().map((c) => ({ label: c.name, value: c.id })),
  );

  readonly tagOptions = computed<SelectOption[]>(() =>
    this.tags().map((t) => ({ label: t.name, value: t.id })),
  );

  constructor(private confirmationService: ConfirmationService) {
    this.store.dispatch(new LoadTasks());
    this.store.dispatch(new LoadCategories());
    this.store.dispatch(new LoadTags());
  }

  showRightPanel = false;
  editingTask: TaskDisplayItem | null = null;

  openNewTaskPanel(): void {
    this.editingTask = null;
    this.showRightPanel = true;
  }

  editTask(task: TaskDisplayItem): void {
    this.editingTask = task;
    this.showRightPanel = true;
  }

  closeRightPanel(): void {
    this.showRightPanel = false;
    this.editingTask = null;
  }

  logout(): void {
    this.store.dispatch(new Logout());
    this.router.navigate(['/login']);
  }

  onSaveTask(request: CreateTaskRequest): void {
    if (this.editingTask) {
      this.store.dispatch(new UpdateTask(this.editingTask.id, request));
    } else {
      this.store.dispatch(new CreateTask(request));
    }
    this.closeRightPanel();
  }

  onDeleteTask(id: string): void {
    this.confirmationService.confirm({
      header: 'Delete Task',
      message: 'Are you sure you want to delete this task?',
      accept: () => {
        this.store.dispatch(new DeleteTask(id));
        this.closeRightPanel();
      },
    });
  }
}
