import { Component } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SelectModule } from 'primeng/select';
import { SplitterModule } from 'primeng/splitter';
import { TextareaModule } from 'primeng/textarea';

import { TaskStatus } from '../../shared/enums/task-status.enum';
import type { CreateTaskRequest } from '../../shared/models/dto';
import {
  TaskDetailPanelComponent,
  type SelectOption,
} from './task-detail-panel/task-detail-panel.component';
import { DashboardSidebarComponent } from './sidebar/dashboard-sidebar.component';
import { TaskRowComponent } from './task-row/task-row.component';
import {
  MOCK_CATEGORIES,
  MOCK_STATUS_ITEMS,
  MOCK_TAGS,
  MOCK_TASKS,
  type TaskDisplayItem,
} from './dashboard.mockdata';

@Component({
  selector: 'app-dashboard',
  host: {
    style: 'height: 100vh; width: 100vw; overflow: hidden; display: block;',
  },
  providers: [ConfirmationService],
  imports: [
    BadgeModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    DividerModule,
    InputTextModule,
    ScrollPanelModule,
    SelectModule,
    SplitterModule,
    TextareaModule,
    TaskDetailPanelComponent,
    DashboardSidebarComponent,
    TaskRowComponent,
  ],
  templateUrl: './dashboard.component.html',
})
// Smart component: owns all data, controls panel visibility, orchestrates confirmations
// The child TaskDetailPanelComponent receives data via @Input and emits events via @Output
export class DashboardComponent {
  constructor(private confirmationService: ConfirmationService) {}

  // Mock data — will be replaced by NGXS store selectors when the backend is connected
  readonly categories = MOCK_CATEGORIES;
  readonly tags = MOCK_TAGS;
  readonly statusItems = MOCK_STATUS_ITEMS;

  // Enrich tasks with resolved category names for display
  readonly tasks: TaskDisplayItem[] = MOCK_TASKS.map((task) => {
    const cat = MOCK_CATEGORIES.find((c) => c.id === task.categoryId);
    return { ...task, categoryName: cat?.name ?? '' };
  });

  selectedStatus: TaskStatus | null = null;
  selectedCategoryId: string | null = null;

  get visibleTasks(): TaskDisplayItem[] {
    return this.tasks.filter((task) => {
      const statusMatches = this.selectedStatus === null || task.status === this.selectedStatus;
      const categoryMatches =
        this.selectedCategoryId === null || task.categoryId === this.selectedCategoryId;
      return statusMatches && categoryMatches;
    });
  }

  get taskHeaderLabel(): string {
    if (this.selectedStatus === null && this.selectedCategoryId === null) {
      return 'All Tasks';
    }
    if (this.selectedStatus !== null && this.selectedCategoryId !== null) {
      return 'Filtered Tasks';
    }
    return 'Filtered Tasks';
  }

  // Form options for the child panel's select/multiselect dropdowns
  readonly statusOptions: SelectOption<number>[] = [
    { label: 'Non Started', value: TaskStatus.NonStarted },
    { label: 'In Progress', value: TaskStatus.InProgress },
    { label: 'Paused', value: TaskStatus.Paused },
    { label: 'Late', value: TaskStatus.Late },
    { label: 'Finished', value: TaskStatus.Finished },
  ];

  readonly categoryOptions: SelectOption[] = MOCK_CATEGORIES.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  readonly tagOptions: SelectOption[] = MOCK_TAGS.map((t) => ({
    label: t.name,
    value: t.id,
  }));

  showRightPanel = false;
  editingTask: TaskDisplayItem | null = null;

  filterByStatus(status: TaskStatus): void {
    this.selectedStatus = this.selectedStatus === status ? null : status;
  }

  filterByCategory(categoryId: string): void {
    this.selectedCategoryId = this.selectedCategoryId === categoryId ? null : categoryId;
  }

  addCategory(): void {
    // TODO: Open add category dialog or inline input
  }

  addTag(): void {
    // TODO: Open add tag dialog or inline input
  }

  openCalendar(): void {
    // TODO: Navigate to calendar view or open date picker
  }

  logout(): void {
    // TODO: Clear auth state and navigate to login
  }

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
