import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

import { TaskStatus } from '../../../shared/enums/task-status.enum';
import type { CreateSubTaskRequest, CreateTaskRequest, SubTaskResponse } from '../../../shared/models/dto';

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
    FormsModule,
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
export class TaskDetailPanelComponent {
  @Input() visible = false;
  @Input() statusOptions: SelectOption<number>[] = [];
  @Input() categoryOptions: SelectOption[] = [];
  @Input() tagOptions: SelectOption[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreateTaskRequest>();

  title = '';
  description = '';
  selectedStatus: number | null = null;
  selectedCategory: string | null = null;
  selectedDate: Date | null = null;
  selectedTags: string[] = [];
  subtasks: SubTaskResponse[] = [];

  addSubtask(): void {
    this.subtasks = [...this.subtasks, { title: '', isDone: false }];
  }

  removeSubtask(index: number): void {
    this.subtasks = this.subtasks.filter((_, i) => i !== index);
  }

  onSave(): void {
    this.save.emit({
      title: this.title,
      description: this.description || null,
      dueDate: this.selectedDate,
      status: this.selectedStatus ?? TaskStatus.NonStarted,
      categoryId: this.selectedCategory,
      subTasks: this.subtasks.map(s => ({ title: s.title, isDone: s.isDone }) as CreateSubTaskRequest),
      tagIds: this.selectedTags,
    });
  }
}
