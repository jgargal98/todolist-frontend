import { Pipe, PipeTransform } from '@angular/core';
import { TaskStatus } from '../enums/task-status.enum';

@Pipe({
  name: 'taskStatusSeverity',
  standalone: true,
})
export class TaskStatusSeverityPipe implements PipeTransform {
  transform(value: TaskStatus | undefined | null): string {
    switch (value) {
      case TaskStatus.NonStarted: return 'secondary';
      case TaskStatus.InProgress: return 'info';
      case TaskStatus.Paused: return 'warn';
      case TaskStatus.Late: return 'danger';
      case TaskStatus.Finished: return 'success';
      default: return 'secondary';
    }
  }
}
