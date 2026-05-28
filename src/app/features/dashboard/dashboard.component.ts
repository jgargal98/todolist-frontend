import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SelectModule } from 'primeng/select';
import { SplitterModule } from 'primeng/splitter';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';

interface FilterItem {
  label: string;
  icon: string;
  count: number;
  selected: boolean;
}

interface CategoryItem {
  label: string;
  color: string;
  count: number;
}

interface TaskItem {
  title: string;
  date: string;
  subtaskCount: number;
  category: string;
  categoryColor: string;
}

interface SelectOption {
  label: string;
  value: string;
}

interface SubtaskItem {
  description: string;
  done: boolean;
}

@Component({
  selector: 'app-dashboard',
  host: {
    style: 'height: 100vh; width: 100vw; overflow: hidden; display: block;',
  },
  imports: [
    FormsModule,
    BadgeModule,
    ButtonModule,
    CheckboxModule,
    ChipModule,
    DatePickerModule,
    DialogModule,
    DividerModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    MultiSelectModule,
    ScrollPanelModule,
    SelectModule,
    SplitterModule,
    TagModule,
    TextareaModule,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  readonly filters: FilterItem[] = [
    { label: 'All Tasks', icon: 'pi-list', count: 12, selected: true },
    { label: 'Today', icon: 'pi-calendar', count: 3, selected: false },
    { label: 'Important', icon: 'pi-star', count: 5, selected: false },
    { label: 'Planned', icon: 'pi-calendar-clock', count: 7, selected: false },
    { label: 'Assigned', icon: 'pi-user', count: 2, selected: false },
  ];

  readonly categories: CategoryItem[] = [
    { label: 'General', color: '#6366f1', count: 4 },
    { label: 'Work', color: '#f97316', count: 6 },
    { label: 'Personal', color: '#22c55e', count: 2 },
  ];

  readonly statusItems: { label: string; icon: string; count: number }[] = [
    { label: 'Non Started', icon: 'pi-circle', count: 3 },
    { label: 'In Progress', icon: 'pi-spinner', count: 5 },
    { label: 'Paused', icon: 'pi-pause', count: 2 },
    { label: 'Late', icon: 'pi-exclamation-triangle', count: 1 },
    { label: 'Finished', icon: 'pi-check-circle', count: 6 },
  ];

  readonly tags: string[] = ['Development', 'Design', 'Meetings'];

  readonly tasks: TaskItem[] = [
    { title: 'Design landing page mockup', date: 'Jun 5, 2026', subtaskCount: 3, category: 'Design', categoryColor: '#6366f1' },
    { title: 'Implement auth module', date: 'Jun 8, 2026', subtaskCount: 5, category: 'Development', categoryColor: '#f97316' },
    { title: 'Fix login validation bug', date: 'May 30, 2026', subtaskCount: 1, category: 'Work', categoryColor: '#22c55e' },
    { title: 'Write API documentation', date: 'Jun 12, 2026', subtaskCount: 2, category: 'General', categoryColor: '#6366f1' },
  ];

  readonly statusOptions: SelectOption[] = [
    { label: 'Non Started', value: 'non-started' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Paused', value: 'paused' },
    { label: 'Late', value: 'late' },
    { label: 'Finished', value: 'finished' },
  ];

  readonly categoryOptions: SelectOption[] = [
    { label: 'General', value: 'general' },
    { label: 'Work', value: 'work' },
    { label: 'Personal', value: 'personal' },
  ];

  readonly tagOptions: SelectOption[] = [
    { label: 'Development', value: 'development' },
    { label: 'Design', value: 'design' },
    { label: 'Meetings', value: 'meetings' },
    { label: 'Urgent', value: 'urgent' },
  ];

  selectedTags: string[] = [];

  readonly subtasks: SubtaskItem[] = [
    { description: 'Research UI patterns', done: false },
    { description: 'Create wireframes', done: true },
    { description: 'Prepare presentation', done: false },
  ];
}
