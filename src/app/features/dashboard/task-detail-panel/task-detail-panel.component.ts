import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

import { TaskStatus } from '../../../shared/enums/task-status.enum';
import type { CreateTaskRequest, SubTaskResponse, TaskResponse } from '../../../shared/models/dto';

function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    if (!control.value) return null;
    const date = new Date(control.value);
    return date > new Date() ? null : { futureDate: 'Due date must be in the future' };
  };
}

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
    ButtonModule,
    CheckboxModule,
    DatePickerModule,
    DividerModule,
    InputTextModule,
    MultiSelectModule,
    SelectModule,
    TextareaModule,
  ],
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
// Dumb/presentational component: receives task data, renders a form, emits events
// No external dependencies — testable by setting @Input() and spying on @Output()
export class TaskDetailPanelComponent {
  @Input() visible = false;
  @Input() statusOptions: SelectOption<number>[] = [];
  @Input() categoryOptions: SelectOption[] = [];
  @Input() tagOptions: SelectOption[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreateTaskRequest>();
  @Output() deleteTask = new EventEmitter<string>();

  private _task: TaskResponse | null = null;

  @Input() set task(value: TaskResponse | null) {
    this._task = value;
    this.subTasksFormArray.clear();
    if (value) {
      this.form.patchValue({
        title: value.title,
        description: value.description ?? '',
        status: value.status,
        categoryId: value.categoryId,
        dueDate: value.dueDate,
        tagIds: value.tags.map(t => t.id),
      });
      value.subTasks.forEach(s => this.subTasksFormArray.push(this.createSubTaskGroup(s)));
    } else {
      this.form.reset({
        title: '',
        description: '',
        status: TaskStatus.NonStarted,
        categoryId: null,
        dueDate: null,
        tagIds: [],
      });
    }
  }

  get task(): TaskResponse | null {
    return this._task;
  }

  readonly form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(200)] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(1000)] }),
    status: new FormControl(TaskStatus.NonStarted, { nonNullable: true }),
    categoryId: new FormControl<string | null>(null),
    dueDate: new FormControl<Date | null>(null, { validators: [futureDateValidator()] }),
    tagIds: new FormControl<string[]>([], { nonNullable: true }),
    subTasks: new FormArray<FormGroup>([], { validators: [] }),
  });

  get subTasksFormArray(): FormArray<FormGroup> {
    return this.form.controls.subTasks;
  }

  get isEditing(): boolean {
    return this._task !== null;
  }

  get canSave(): boolean {
    return this.form.valid;
  }

  private createSubTaskGroup(subtask?: SubTaskResponse): FormGroup {
    return new FormGroup({
      title: new FormControl(subtask?.title ?? '', { nonNullable: true, validators: [Validators.required] }),
      isDone: new FormControl(subtask?.isDone ?? false, { nonNullable: true }),
    });
  }

  addSubtask(): void {
    this.subTasksFormArray.push(this.createSubTaskGroup());
  }

  removeSubtask(index: number): void {
    this.subTasksFormArray.removeAt(index);
  }

  onDeleteClick(): void {
    if (this._task) {
      this.deleteTask.emit(this._task.id);
    }
  }

  // Centralized error messages — only shows after the control is touched
  getErrorMessage(control: AbstractControl | null): string {
    if (!control || !control.errors || !control.touched) return '';
    if (control.hasError('required')) return 'This field is required';
    if (control.hasError('maxlength')) {
      return `Must not exceed ${control.getError('maxlength').requiredLength} characters`;
    }
    if (control.hasError('futureDate')) return 'Due date must be in the future';
    return '';
  }

  // Emits the raw form value as a CreateTaskRequest (nullable fields mapped correctly)
  onSave(): void {
    const raw = this.form.getRawValue();
    this.save.emit({
      title: raw.title,
      description: raw.description || null,
      dueDate: raw.dueDate ?? null,
      status: raw.status,
      categoryId: raw.categoryId ?? null,
      subTasks: ((raw.subTasks ?? []) as { title: string; isDone: boolean }[]).map(s => ({ title: s.title, isDone: s.isDone })),
      tagIds: raw.tagIds,
    });
  }
}
