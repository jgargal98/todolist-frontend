import { Component, input, output } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { TaskStatusIconPipe, TaskStatusLabelPipe } from '../../../shared/pipes';
import type { TagResponse } from '../../../shared/models/dto';
import type { CategoryDisplayItem, StatusSummaryItem } from '../dashboard.mockdata';
import { TaskStatus } from '../../../shared/enums/task-status.enum';

@Component({
  selector: 'app-dashboard-sidebar',
  imports: [BadgeModule, ButtonModule, ChipModule, TaskStatusIconPipe, TaskStatusLabelPipe],
  templateUrl: './dashboard-sidebar.component.html',
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }
    `,
  ],
})
export class DashboardSidebarComponent {
  readonly statusItems = input.required<readonly StatusSummaryItem[]>();
  readonly categories = input.required<readonly CategoryDisplayItem[]>();
  readonly tags = input.required<readonly TagResponse[]>();
  readonly activeStatus = input<TaskStatus | null>();
  readonly activeCategory = input<string | null>();

  readonly filterByStatus = output<TaskStatus>();
  readonly filterByCategory = output<string>();
  readonly addCategory = output<void>();
  readonly addTag = output<void>();
  readonly openCalendar = output<void>();
  readonly logout = output<void>();
}
