import { Pipe, PipeTransform } from '@angular/core';
import { TaskStatus } from '../enums/task-status.enum';

@Pipe({
  name: 'taskStatusLabel',
  standalone: true,
})
// Maps the numeric TaskStatus enum to a human-readable label for display
export class TaskStatusLabelPipe implements PipeTransform {
  transform(value: TaskStatus | undefined | null): string {
    switch (value) {
      case TaskStatus.NonStarted: return 'Non Started';
      case TaskStatus.InProgress: return 'In Progress';
      case TaskStatus.Paused: return 'Paused';
      case TaskStatus.Late: return 'Late';
      case TaskStatus.Finished: return 'Finished';
      default: return 'Unknown';
    }
  }
}
