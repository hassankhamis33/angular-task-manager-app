import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../models/task.model';
import { ApiService } from './api.service';

/**
 * Task State Service
 * Manages task state using RxJS Subjects and Observables
 * Implements a single source of truth pattern for task data
 */
@Injectable({
  providedIn: 'root'
})
export class TaskStateService {
  /**
   * BehaviorSubject to hold the entire task list
   * BehaviorSubject emits the current value to new subscribers immediately
   */
  private tasksSubject = new BehaviorSubject<Task[]>([]);

  /**
   * BehaviorSubject to manage loading state
   */
  private loadingSubject = new BehaviorSubject<boolean>(false);

  /**
   * Subject to handle errors
   * Subject doesn't emit current value to new subscribers
   */
  private errorSubject = new Subject<string>();

  /**
   * Public observable for components to subscribe to tasks
   */
  public tasks$ = this.tasksSubject.asObservable();

  /**
   * Public observable for loading state
   */
  public loading$ = this.loadingSubject.asObservable();

  /**
   * Public observable for errors
   */
  public error$ = this.errorSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadTasks();
  }

  /**
   * Load all tasks from the API
   * Demonstrates switchMap operator - cancels previous request if new one is made
   */
  loadTasks(): void {
    this.loadingSubject.next(true);
    this.apiService.getTasks()
      .pipe(
        tap(() => this.loadingSubject.next(false)),
        tap(tasks => this.tasksSubject.next(tasks))
      )
      .subscribe({
        error: (error) => {
          this.loadingSubject.next(false);
          this.errorSubject.next(error.message || 'Failed to load tasks');
        }
      });
  }

  /**
   * Add a new task
   * Updates the subject with the new task added to the list
   * @param request - Create task request
   */
  addTask(request: CreateTaskRequest): void {
    this.loadingSubject.next(true);
    this.apiService.createTask(request)
      .pipe(
        tap(newTask => {
          this.loadingSubject.next(false);
          const currentTasks = this.tasksSubject.value;
          this.tasksSubject.next([...currentTasks, newTask]);
        })
      )
      .subscribe({
        error: (error) => {
          this.loadingSubject.next(false);
          this.errorSubject.next(error.message || 'Failed to create task');
        }
      });
  }

  /**
   * Update an existing task
   * Demonstrates immutable state updates - creates new array
   * @param id - Task ID
   * @param request - Update task request
   */
  updateTask(id: string | number, request: UpdateTaskRequest): void {
    this.loadingSubject.next(true);
    this.apiService.updateTask(id, request)
      .pipe(
        tap(updatedTask => {
          this.loadingSubject.next(false);
          if (updatedTask) {
            const currentTasks = this.tasksSubject.value;
            const updatedTasks = currentTasks.map(task =>
              task.id === id ? updatedTask : task
            );
            this.tasksSubject.next(updatedTasks);
          }
        })
      )
      .subscribe({
        error: (error) => {
          this.loadingSubject.next(false);
          this.errorSubject.next(error.message || 'Failed to update task');
        }
      });
  }

  /**
   * Delete a task
   * Removes task from the state
   * @param id - Task ID
   */
  deleteTask(id: string | number): void {
    this.loadingSubject.next(true);
    this.apiService.deleteTask(id)
      .pipe(
        tap(() => {
          this.loadingSubject.next(false);
          const currentTasks = this.tasksSubject.value;
          const filteredTasks = currentTasks.filter(task => task.id !== id);
          this.tasksSubject.next(filteredTasks);
        })
      )
      .subscribe({
        error: (error) => {
          this.loadingSubject.next(false);
          this.errorSubject.next(error.message || 'Failed to delete task');
        }
      });
  }

  /**
   * Get filtered tasks by completion status
   * Demonstrates map operator - transforms the observable
   * @param completed - Filter by completion status
   */
  getFilteredTasks(completed: boolean): Observable<Task[]> {
    return this.tasks$.pipe(
      map(tasks => tasks.filter(task => task.completed === completed))
    );
  }

  /**
   * Get tasks sorted by priority
   * Demonstrates sorting transformation
   */
  getTasksSortedByPriority(): Observable<Task[]> {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    return this.tasks$.pipe(
      map(tasks => [...tasks].sort((a, b) =>
        priorityOrder[a.priority] - priorityOrder[b.priority]
      ))
    );
  }

  /**
   * Clear error messages
   */
  clearError(): void {
    this.errorSubject.next('');
  }
}
