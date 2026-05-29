import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TaskStatusLabelPipe, TaskStatusSeverityPipe } from '../../../shared/pipes';
import type { TaskDisplayItem } from '../dashboard.mockdata';

@Component({
  selector: 'app-task-row',
  imports: [
    DatePipe,
    ButtonModule,
    TagModule,
    TaskStatusLabelPipe,
    TaskStatusSeverityPipe,
  ],
  templateUrl: './task-row.component.html',
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
export class TaskRowComponent {
  readonly task = input.required<TaskDisplayItem>();
  readonly edit = output<TaskDisplayItem>();
}
