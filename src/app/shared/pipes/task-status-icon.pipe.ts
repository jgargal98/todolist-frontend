import { Pipe, PipeTransform } from '@angular/core';
import { TaskStatus } from '../enums/task-status.enum';

@Pipe({
  name: 'taskStatusIcon',
  standalone: true,
})
// Maps TaskStatus to a PrimeIcon class for the sidebar status list
export class TaskStatusIconPipe implements PipeTransform {
  transform(value: TaskStatus | undefined | null): string {
    switch (value) {
      case TaskStatus.NonStarted: return 'pi-circle';
      case TaskStatus.InProgress: return 'pi-spinner';
      case TaskStatus.Paused: return 'pi-pause';
      case TaskStatus.Late: return 'pi-exclamation-triangle';
      case TaskStatus.Finished: return 'pi-check-circle';
      default: return 'pi-circle';
    }
  }
}
