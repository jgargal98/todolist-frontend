import { TaskStatus } from '../../shared/enums/task-status.enum';
import type { CategoryResponse, TagResponse, TaskResponse } from '../../shared/models/dto';

export interface CategoryDisplayItem extends CategoryResponse {
  count: number;
}

export interface StatusSummaryItem {
  status: TaskStatus;
  count: number;
}

export interface TaskDisplayItem extends TaskResponse {
  categoryName: string;
}

export const MOCK_CATEGORIES: CategoryDisplayItem[] = [
  { id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', name: 'General', count: 4 },
  { id: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', name: 'Work', count: 6 },
  { id: 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', name: 'Personal', count: 2 },
];

export const MOCK_TAGS: TagResponse[] = [
  {
    id: 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a',
    name: 'Development',
    userId: '00000000-0000-0000-0000-000000000001',
  },
  {
    id: 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b',
    name: 'Design',
    userId: '00000000-0000-0000-0000-000000000001',
  },
  {
    id: 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c',
    name: 'Meetings',
    userId: '00000000-0000-0000-0000-000000000001',
  },
];

export const MOCK_TASKS: TaskResponse[] = [
  {
    id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    title: 'Design landing page mockup',
    description: 'Hola que tal buenas tardes',
    dueDate: new Date('2026-06-05'),
    status: TaskStatus.InProgress,
    categoryId: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    subTasks: [
      { title: 'Research UI patterns', isDone: false },
      { title: 'Create wireframes', isDone: true },
      { title: 'Prepare presentation', isDone: false },
    ],
    tags: [
      {
        id: 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b',
        name: 'Design',
        userId: '00000000-0000-0000-0000-000000000001',
      },
    ],
  },
  {
    id: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
    title: 'Implement auth module',
    description: null,
    dueDate: new Date('2026-06-08'),
    status: TaskStatus.NonStarted,
    categoryId: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
    subTasks: [
      { title: 'Set up JWT service', isDone: false },
      { title: 'Create login endpoint', isDone: false },
      { title: 'Add token refresh', isDone: false },
      { title: 'Write integration tests', isDone: false },
      { title: 'Document API', isDone: false },
    ],
    tags: [
      {
        id: 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a',
        name: 'Development',
        userId: '00000000-0000-0000-0000-000000000001',
      },
    ],
  },
  {
    id: 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
    title: 'Fix login validation bug',
    description:
      'Investigate and resolve the edge case causing false negatives on email validation.',
    dueDate: new Date('2026-05-30'),
    status: TaskStatus.Late,
    categoryId: 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
    subTasks: [{ title: 'Reproduce bug', isDone: true }],
    tags: [],
  },
  {
    id: 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a',
    title: 'Write API documentation',
    description: null,
    dueDate: new Date('2026-06-12'),
    status: TaskStatus.Paused,
    categoryId: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    subTasks: [
      { title: 'Document endpoints', isDone: false },
      { title: 'Add code examples', isDone: false },
    ],
    tags: [
      {
        id: 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c',
        name: 'Meetings',
        userId: '00000000-0000-0000-0000-000000000001',
      },
    ],
  },
];

export const MOCK_STATUS_ITEMS: StatusSummaryItem[] = [
  { status: TaskStatus.NonStarted, count: 3 },
  { status: TaskStatus.InProgress, count: 5 },
  { status: TaskStatus.Paused, count: 2 },
  { status: TaskStatus.Late, count: 1 },
  { status: TaskStatus.Finished, count: 6 },
];
