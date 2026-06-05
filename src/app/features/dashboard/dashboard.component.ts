import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
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
  TaskStatusIconPipe,
  TaskStatusLabelPipe,
  TaskStatusSeverityPipe,
} from '../../shared/pipes';
import {
  TaskDetailPanelComponent,
  type SelectOption,
} from './task-detail-panel/task-detail-panel.component';

// Local view-models extending API DTOs with computed display data
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
// Smart component: owns all data, controls panel visibility, orchestrates confirmations
// The child TaskDetailPanelComponent receives data via @Input and emits events via @Output
export class DashboardComponent {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  constructor(private confirmationService: ConfirmationService) {}

  // Mock data — will be replaced by NGXS store selectors when the backend is connected
  private readonly rawCategories: CategoryDisplayItem[] = [
    { id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', name: 'General', count: 4 },
    { id: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', name: 'Work', count: 6 },
    { id: 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', name: 'Personal', count: 2 },
  ];

  private readonly rawTags: TagResponse[] = [
    {
      id: 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a',
      name: 'Development',
    },
    {
      id: 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b',
      name: 'Design',
    },
    {
      id: 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c',
      name: 'Meetings',
    },
  ];

  private readonly rawTasks: TaskResponse[] = [
    {
      id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
      title: 'Design landing page mockup',
      description: 'Hola que tal buenas tardes',
      dueDate: new Date('2026-06-05'),
      status: TaskStatus.InProgress,
      categoryId: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
      subTasks: [
        { title: 'Research UI patterns', isDone: false },
        { title: 'Create wireframes', isDone: true },
        { title: 'Prepare presentation', isDone: false },
      ],
      tags: [
        {
          id: 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b',
          name: 'Design',
        },
      ],
    },
    {
      id: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
      title: 'Implement auth module',
      description: null,
      dueDate: new Date('2026-06-08'),
      status: TaskStatus.NonStarted,
      categoryId: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
      subTasks: [
        { title: 'Set up JWT service', isDone: false },
        { title: 'Create login endpoint', isDone: false },
        { title: 'Add token refresh', isDone: false },
        { title: 'Write integration tests', isDone: false },
        { title: 'Document API', isDone: false },
      ],
      tags: [
        {
          id: 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a',
          name: 'Development',
        },
      ],
    },
    {
      id: 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
      title: 'Fix login validation bug',
      description:
        'Investigate and resolve the edge case causing false negatives on email validation.',
      dueDate: new Date('2026-05-30'),
      status: TaskStatus.Late,
      categoryId: 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
      subTasks: [{ title: 'Reproduce bug', isDone: true }],
      tags: [],
    },
    {
      id: 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a',
      title: 'Write API documentation',
      description: null,
      dueDate: new Date('2026-06-12'),
      status: TaskStatus.Paused,
      categoryId: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
      subTasks: [
        { title: 'Document endpoints', isDone: false },
        { title: 'Add code examples', isDone: false },
      ],
      tags: [
        {
          id: 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c',
          name: 'Meetings',
        },
      ],
    },
  ];

  readonly categories: readonly CategoryDisplayItem[] = this.rawCategories;

  readonly tags: readonly TagResponse[] = this.rawTags;

  readonly statusItems: StatusSummaryItem[] = [
    { status: TaskStatus.NonStarted, count: 3 },
    { status: TaskStatus.InProgress, count: 5 },
    { status: TaskStatus.Paused, count: 2 },
    { status: TaskStatus.Late, count: 1 },
    { status: TaskStatus.Finished, count: 6 },
  ];

  // Enrich tasks with resolved category names for display
  readonly tasks: TaskDisplayItem[] = this.rawTasks.map((task) => {
    const cat = this.rawCategories.find((c) => c.id === task.categoryId);
    return {
      ...task,
      categoryName: cat?.name ?? '',
    };
  });

  // Form options for the child panel's select/multiselect dropdowns
  readonly statusOptions: SelectOption<number>[] = [
    { label: 'Non Started', value: TaskStatus.NonStarted },
    { label: 'In Progress', value: TaskStatus.InProgress },
    { label: 'Paused', value: TaskStatus.Paused },
    { label: 'Late', value: TaskStatus.Late },
    { label: 'Finished', value: TaskStatus.Finished },
  ];

  readonly categoryOptions: SelectOption[] = this.rawCategories.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  readonly tagOptions: SelectOption[] = this.rawTags.map((t) => ({
    label: t.name,
    value: t.id,
  }));

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

  // Called when the child panel emits a save event
  // Will dispatch a NGXS action when the store is connected
  onSaveTask(request: CreateTaskRequest): void {
    console.log('Task to save:', request);
    this.closeRightPanel();
  }

  // Delete confirmation is handled here (smart component), not in the child panel
  // This keeps the task-detail-panel pure — no dependencies on ConfirmationService
  onDeleteTask(id: string): void {
    this.confirmationService.confirm({
      header: 'Delete Task',
      message: 'Are you sure you want to delete this task?',
      accept: () => {
        console.log('Delete task:', id);
        this.closeRightPanel();
      },
    });
  }
}
