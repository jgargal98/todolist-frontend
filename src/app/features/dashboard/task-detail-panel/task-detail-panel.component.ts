import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

import { TaskStatus } from '../../../shared/enums/task-status.enum';
import type { CreateTaskRequest, SubTaskResponse, TaskResponse } from '../../../shared/models/dto';

export interface SelectOption<T = string> {
  label: string;
  value: T;
}

@Component({
  selector: 'task-detail-panel',
  host: {
    style: 'display: block; width: 25%; height: 100%; flex-shrink: 0; border-left: 1px solid var(--p-content-border-color);',
  },
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    CheckboxModule,
    ConfirmDialogModule,
    DatePickerModule,
    DividerModule,
    InputTextModule,
    MultiSelectModule,
    SelectModule,
    TextareaModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './task-detail-panel.component.html',
  styles: [`
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .panel-enter {
      animation: slideInRight 0.25s ease-out;
    }
  `],
})
export class TaskDetailPanelComponent {
  @Input() visible = false;
  @Input() statusOptions: SelectOption<number>[] = [];
  @Input() categoryOptions: SelectOption[] = [];
  @Input() tagOptions: SelectOption[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreateTaskRequest>();

  private _task: TaskResponse | null = null;

  @Input() set task(value: TaskResponse | null) {
    this._task = value;
    if (value) {
      this.form.patchValue({
        title: value.title,
        description: value.description ?? '',
        status: value.status,
        categoryId: value.categoryId,
        dueDate: value.dueDate,
        tagIds: value.tags.map(t => t.id),
      });
      this.subTasks = value.subTasks.map(s => ({ ...s }));
    } else {
      this.form.reset({
        title: '',
        description: '',
        status: null,
        categoryId: null,
        dueDate: null,
        tagIds: [],
      });
      this.subTasks = [];
    }
  }

  get task(): TaskResponse | null {
    return this._task;
  }

  readonly form = new FormGroup({
    title: new FormControl('', { nonNullable: true }),
    description: new FormControl('', { nonNullable: true }),
    status: new FormControl<number | null>(null),
    categoryId: new FormControl<string | null>(null),
    dueDate: new FormControl<Date | null>(null),
    tagIds: new FormControl<string[]>([], { nonNullable: true }),
  });

  subTasks: SubTaskResponse[] = [];

  get isEditing(): boolean {
    return this._task !== null;
  }

  constructor(private confirmationService: ConfirmationService) {}

  addSubtask(): void {
    this.subTasks = [...this.subTasks, { title: '', isDone: false }];
  }

  removeSubtask(index: number): void {
    this.subTasks = this.subTasks.filter((_, i) => i !== index);
  }

  confirmDelete(): void {
    this.confirmationService.confirm({
      message: 'This action cannot be undone.',
      header: 'Delete Task',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes, Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteConfirmed();
      },
    });
  }

  private deleteConfirmed(): void {
    // Visual only — to be wired with NGXS
  }

  onSave(): void {
    const raw = this.form.getRawValue();
    this.save.emit({
      title: raw.title,
      description: raw.description || null,
      dueDate: raw.dueDate ?? null,
      status: raw.status ?? TaskStatus.NonStarted,
      categoryId: raw.categoryId ?? null,
      subTasks: this.subTasks.map(s => ({ title: s.title, isDone: s.isDone })),
      tagIds: raw.tagIds,
    });
  }
}
