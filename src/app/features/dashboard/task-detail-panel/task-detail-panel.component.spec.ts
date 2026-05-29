import { TestBed } from '@angular/core/testing';
import { TaskDetailPanelComponent } from './task-detail-panel.component';
import { TaskStatus } from '../../../shared/enums/task-status.enum';
import type { TaskResponse } from '../../../shared/models/dto';

describe('TaskDetailPanelComponent', () => {
  let component: TaskDetailPanelComponent;

  function createMockTask(overrides?: Partial<TaskResponse>): TaskResponse {
    return {
      id: 'test-id-1',
      title: 'Test Task',
      description: 'A description',
      dueDate: new Date('2026-06-01'),
      status: TaskStatus.InProgress,
      categoryId: 'cat-1',
      subTasks: [
        { title: 'Subtask 1', isDone: false },
        { title: 'Subtask 2', isDone: true },
      ],
      tags: [{ id: 'tag-1', name: 'Design', userId: 'user-1' }],
      ...overrides,
    };
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDetailPanelComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TaskDetailPanelComponent);
    component = fixture.componentInstance;
  });

  describe('initial state', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have an invalid form when empty', () => {
      expect(component.form.valid).toBe(false);
    });

    it('should have a disabled save button when form is invalid', () => {
      expect(component.canSave).toBe(false);
    });
  });

  describe('title validation', () => {
    it('should be invalid when title is empty', () => {
      const title = component.form.controls.title;
      title.markAsTouched();
      expect(title.hasError('required')).toBe(true);
      expect(component.form.valid).toBe(false);
    });

    it('should be valid with a non-empty title', () => {
      component.form.controls.title.setValue('My Task');
      expect(component.form.controls.title.valid).toBe(true);
    });

    it('should be invalid when title exceeds 200 characters', () => {
      const longTitle = 'x'.repeat(201);
      component.form.controls.title.setValue(longTitle);
      expect(component.form.controls.title.hasError('maxlength')).toBe(true);
    });

    it('should be valid when title is exactly 200 characters', () => {
      const exactTitle = 'x'.repeat(200);
      component.form.controls.title.setValue(exactTitle);
      expect(component.form.controls.title.valid).toBe(true);
    });
  });

  describe('description validation', () => {
    it('should be valid when description is empty (optional)', () => {
      expect(component.form.controls.description.valid).toBe(true);
    });

    it('should be invalid when description exceeds 1000 characters', () => {
      component.form.controls.description.setValue('x'.repeat(1001));
      expect(component.form.controls.description.hasError('maxlength')).toBe(true);
    });

    it('should be valid when description is exactly 1000 characters', () => {
      component.form.controls.description.setValue('x'.repeat(1000));
      expect(component.form.controls.description.valid).toBe(true);
    });
  });

  describe('dueDate validation', () => {
    it('should be valid when dueDate is null (optional)', () => {
      component.form.controls.title.setValue('Task');
      component.form.controls.dueDate.setValue(null);
      expect(component.form.controls.dueDate.valid).toBe(true);
      expect(component.form.valid).toBe(true);
    });

    it('should be invalid when dueDate is in the past', () => {
      component.form.controls.title.setValue('Task');
      const past = new Date();
      past.setDate(past.getDate() - 1);
      component.form.controls.dueDate.setValue(past);
      component.form.controls.dueDate.markAsTouched();
      expect(component.form.controls.dueDate.hasError('futureDate')).toBe(true);
      expect(component.form.valid).toBe(false);
    });

    it('should be valid when dueDate is in the future', () => {
      component.form.controls.title.setValue('Task');
      const future = new Date();
      future.setDate(future.getDate() + 1);
      component.form.controls.dueDate.setValue(future);
      expect(component.form.controls.dueDate.valid).toBe(true);
      expect(component.form.valid).toBe(true);
    });

    it('should be invalid when dueDate is today', () => {
      component.form.controls.title.setValue('Task');
      component.form.controls.dueDate.setValue(new Date());
      component.form.controls.dueDate.markAsTouched();
      expect(component.form.controls.dueDate.hasError('futureDate')).toBe(true);
      expect(component.form.valid).toBe(false);
    });
  });

  describe('canSave', () => {
    it('should be true when form is valid', () => {
      component.form.controls.title.setValue('Valid Task');
      expect(component.canSave).toBe(true);
    });

    it('should be false when title is empty', () => {
      component.form.controls.title.setValue('');
      expect(component.canSave).toBe(false);
    });

    it('should be false when title exceeds max length', () => {
      component.form.controls.title.setValue('x'.repeat(201));
      expect(component.canSave).toBe(false);
    });

    it('should be false when dueDate is in the past', () => {
      component.form.controls.title.setValue('Valid Task');
      const past = new Date();
      past.setDate(past.getDate() - 1);
      component.form.controls.dueDate.setValue(past);
      expect(component.canSave).toBe(false);
    });
  });

  describe('subtask FormArray', () => {
    it('should start with an empty FormArray', () => {
      expect(component.subTasksFormArray.length).toBe(0);
    });

    it('should add a subtask group when addSubtask is called', () => {
      component.addSubtask();
      expect(component.subTasksFormArray.length).toBe(1);
      const group = component.subTasksFormArray.at(0);
      expect(group.get('title')?.value).toBe('');
      expect(group.get('isDone')?.value).toBe(false);
    });

    it('should add multiple subtasks', () => {
      component.addSubtask();
      component.addSubtask();
      component.addSubtask();
      expect(component.subTasksFormArray.length).toBe(3);
    });

    it('should remove a subtask group when removeSubtask is called', () => {
      component.addSubtask();
      component.addSubtask();
      component.addSubtask();
      component.removeSubtask(1);
      expect(component.subTasksFormArray.length).toBe(2);
    });

    it('should validate subtask title as required', () => {
      component.addSubtask();
      const titleControl = component.subTasksFormArray.at(0).get('title')!;
      titleControl.markAsTouched();
      expect(titleControl.hasError('required')).toBe(true);
    });

    it('should make form invalid when a subtask title is empty', () => {
      component.form.controls.title.setValue('Valid Task');
      component.addSubtask();
      expect(component.form.valid).toBe(false);
    });

    it('should make form valid when all subtask titles are filled', () => {
      component.form.controls.title.setValue('Valid Task');
      component.addSubtask();
      component.subTasksFormArray.at(0).get('title')!.setValue('Subtask');
      expect(component.form.valid).toBe(true);
    });
  });

  describe('isEditing', () => {
    it('should be false when no task is provided', () => {
      expect(component.isEditing).toBe(false);
    });

    it('should be true when a task is provided', () => {
      component.task = createMockTask();
      expect(component.isEditing).toBe(true);
    });
  });

  describe('task input', () => {
    it('should populate form fields when a task is provided', () => {
      const task = createMockTask();
      component.task = task;

      expect(component.form.controls.title.value).toBe('Test Task');
      expect(component.form.controls.description.value).toBe('A description');
      expect(component.form.controls.status.value).toBe(TaskStatus.InProgress);
      expect(component.form.controls.categoryId.value).toBe('cat-1');
      expect(component.form.controls.tagIds.value).toEqual(['tag-1']);
    });

    it('should populate subtasks when a task is provided', () => {
      const task = createMockTask();
      component.task = task;

      expect(component.subTasksFormArray.length).toBe(2);
      expect(component.subTasksFormArray.at(0).get('title')!.value).toBe('Subtask 1');
      expect(component.subTasksFormArray.at(0).get('isDone')!.value).toBe(false);
      expect(component.subTasksFormArray.at(1).get('title')!.value).toBe('Subtask 2');
      expect(component.subTasksFormArray.at(1).get('isDone')!.value).toBe(true);
    });

    it('should handle null description', () => {
      const task = createMockTask({ description: null });
      component.task = task;
      expect(component.form.controls.description.value).toBe('');
    });

    it('should handle null categoryId', () => {
      const task = createMockTask({ categoryId: null });
      component.task = task;
      expect(component.form.controls.categoryId.value).toBeNull();
    });

    it('should reset form when task is set to null', () => {
      component.form.controls.title.setValue('Something');
      component.form.controls.description.setValue('Desc');

      component.task = null;

      expect(component.form.controls.title.value).toBe('');
      expect(component.form.controls.description.value).toBe('');
      expect(component.form.controls.status.value).toBe(TaskStatus.NonStarted);
      expect(component.form.controls.categoryId.value).toBeNull();
      expect(component.form.controls.dueDate.value).toBeNull();
      expect(component.form.controls.tagIds.value).toEqual([]);
      expect(component.subTasksFormArray.length).toBe(0);
    });
  });

  describe('save output', () => {
    it('should emit a CreateTaskRequest when onSave is called', () => {
      const spy = vi.fn();
      component.save.subscribe(spy);

      component.form.controls.title.setValue('New Task');
      component.addSubtask();
      component.subTasksFormArray.at(0).get('title')!.setValue('Sub A');
      component.onSave();

      expect(spy).toHaveBeenCalledTimes(1);
      const emitted = spy.mock.calls[0][0];
      expect(emitted.title).toBe('New Task');
      expect(emitted.subTasks).toEqual([{ title: 'Sub A', isDone: false }]);
      expect(emitted.tagIds).toEqual([]);
    });

    it('should include all form values in the emitted request', () => {
      const spy = vi.fn();
      component.save.subscribe(spy);

      component.form.controls.title.setValue('Task Title');
      component.form.controls.description.setValue('Desc');
      component.form.controls.status.setValue(TaskStatus.Finished);
      component.form.controls.categoryId.setValue('cat-1');
      component.form.controls.tagIds.setValue(['tag-1']);
      component.addSubtask();
      component.subTasksFormArray.at(0).get('title')!.setValue('Sub');
      component.onSave();

      const emitted = spy.mock.calls[0][0];
      expect(emitted.title).toBe('Task Title');
      expect(emitted.description).toBe('Desc');
      expect(emitted.status).toBe(TaskStatus.Finished);
      expect(emitted.categoryId).toBe('cat-1');
      expect(emitted.tagIds).toEqual(['tag-1']);
    });

    it('should emit null description when empty', () => {
      const spy = vi.fn();
      component.save.subscribe(spy);

      component.form.controls.title.setValue('Task');
      component.onSave();

      expect(spy.mock.calls[0][0].description).toBeNull();
    });

    it('should emit empty subTasks array when no subtasks exist', () => {
      const spy = vi.fn();
      component.save.subscribe(spy);

      component.form.controls.title.setValue('Task');
      component.onSave();

      expect(spy.mock.calls[0][0].subTasks).toEqual([]);
    });
  });

  describe('deleteTask output', () => {
    it('should emit the task id when onDeleteClick is called', () => {
      const spy = vi.fn();
      component.deleteTask.subscribe(spy);

      component.task = createMockTask({ id: 'task-to-delete' });
      component.onDeleteClick();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('task-to-delete');
    });

    it('should not emit when no task is set', () => {
      const spy = vi.fn();
      component.deleteTask.subscribe(spy);

      component.onDeleteClick();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('getErrorMessage', () => {
    it('should return empty string for a valid control', () => {
      const control = component.form.controls.title;
      control.setValue('Valid');
      control.markAsTouched();
      expect(component.getErrorMessage(control)).toBe('');
    });

    it('should return empty string when control is null', () => {
      expect(component.getErrorMessage(null)).toBe('');
    });

    it('should return empty string when control is not touched', () => {
      const control = component.form.controls.title;
      control.setValue('');
      expect(component.getErrorMessage(control)).toBe('');
    });

    it('should return required message for empty touched required field', () => {
      const control = component.form.controls.title;
      control.markAsTouched();
      expect(component.getErrorMessage(control)).toBe('This field is required');
    });

    it('should return maxlength message for too-long value', () => {
      const control = component.form.controls.description;
      control.setValue('x'.repeat(1001));
      control.markAsTouched();
      expect(component.getErrorMessage(control)).toBe('Must not exceed 1000 characters');
    });

    it('should work with a subtask title control', () => {
      component.addSubtask();
      const control = component.subTasksFormArray.at(0).get('title')!;
      control.markAsTouched();
      expect(component.getErrorMessage(control)).toBe('This field is required');
    });

    it('should return futureDate message for a past due date', () => {
      const control = component.form.controls.dueDate;
      const past = new Date();
      past.setDate(past.getDate() - 1);
      control.setValue(past);
      control.markAsTouched();
      expect(component.getErrorMessage(control)).toBe('Due date must be in the future');
    });
  });
});
