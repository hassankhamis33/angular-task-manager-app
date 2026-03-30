import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TaskStateService } from '../../core/services/task-state.service';
import { Task } from '../../core/models/task.model';

/**
 * Task Manager Container Component
 * Root component for the task management feature
 * Implements OnDestroy to properly manage subscriptions and prevent memory leaks
 */
@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-manager.component.html',
  styleUrl: './task-manager.component.css'
})
export class TaskManagerComponent implements OnInit, OnDestroy {
  taskForm: FormGroup;
  tasks: Task[] = [];
  tasks$ = this.taskStateService.tasks$;
  loading$ = this.taskStateService.loading$;
  error$ = this.taskStateService.error$;

  viewAll = true;
  viewCompleted = false;

  /**
   * Subject to manage component cleanup
   * Used with takeUntil to unsubscribe from observables when component is destroyed
   */
  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private taskStateService: TaskStateService
  ) {
    this.taskForm = this.createTaskForm();
  }

  ngOnInit(): void {
    // Subscribe to task changes
    this.tasks$
      .pipe(takeUntil(this.destroy$))
      .subscribe(tasks => {
        this.tasks = tasks;
      });

    // Subscribe to error changes and auto-clear after 5 seconds
    this.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: string) => {
        if (error) {
          setTimeout(() => this.clearError(), 5000);
        }
      });
  }

  /**
   * Create and initialize the reactive form
   */
  private createTaskForm(): FormGroup {
    return this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      priority: ['medium'],
      dueDate: ['']
    });
  }

  /**
   * Handle form submission to add a new task
   */
  onAddTask(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      this.taskStateService.addTask({
        title: formValue.title,
        description: formValue.description,
        priority: formValue.priority,
        dueDate: formValue.dueDate ? new Date(formValue.dueDate) : undefined
      });

      // Reset form after successful submission
      this.taskForm.reset({ priority: 'medium' });
    }
  }

  /**
   * Handle task completion toggle
   * @param task - Task to toggle
   */
  onToggleTask(task: Task): void {
    this.taskStateService.updateTask(task.id, {
      completed: !task.completed
    });
  }

  /**
   * Handle task deletion
   * @param taskId - ID of task to delete
   */
  onDeleteTask(taskId: string | number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskStateService.deleteTask(taskId);
    }
  }

  /**
   * Clear error message
   */
  clearError(): void {
    this.taskStateService.clearError();
  }

  /**
   * Filter and return tasks based on view settings
   * Demonstrates filtering with async pipe and component logic
   */
  getFilteredTasks(): Task[] {
    if (this.viewAll) {
      return this.tasks;
    }
    return this.tasks.filter((task: Task) => task.completed === this.viewCompleted);
  }

  /**
   * Angular lifecycle hook - cleanup
   * Unsubscribe from all observables to prevent memory leaks
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
