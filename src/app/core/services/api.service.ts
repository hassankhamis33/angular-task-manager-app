import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap, delay } from 'rxjs/operators';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../models/task.model';

/**
 * API Service
 * Handles mock HTTP requests for tasks
 * Can be replaced with real backend API by changing BASE_URL and mock data generation
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private BASE_URL = 'api/tasks'; // Mock API endpoint

  constructor(private http: HttpClient) {
    this.initializeMockData();
  }

  /**
   * Initialize mock tasks in localStorage for demonstration
   */
  private initializeMockData(): void {
    const mockTasks: Task[] = [
      {
        id: 1,
        title: 'Complete Angular Project',
        description: 'Build a task manager with RxJS',
        completed: false,
        createdAt: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        priority: 'high'
      },
      {
        id: 2,
        title: 'Learn RxJS Operators',
        description: 'Study advanced RxJS operators like combineLatest, mergeMap',
        completed: false,
        createdAt: new Date(),
        priority: 'medium'
      },
      {
        id: 3,
        title: 'Set up Docker',
        description: 'Create Dockerfile and docker-compose configuration',
        completed: false,
        createdAt: new Date(),
        priority: 'high'
      }
    ];

    if (!localStorage.getItem('tasks')) {
      localStorage.setItem('tasks', JSON.stringify(mockTasks));
    }
  }

  /**
   * Fetch all tasks from storage
   * Simulates HTTP GET request with delay
   */
  getTasks(): Observable<Task[]> {
    return new Observable(observer => {
      setTimeout(() => {
        const tasks = localStorage.getItem('tasks');
        observer.next(tasks ? JSON.parse(tasks) : []);
        observer.complete();
      }, 300);
    });
  }

  /**
   * Fetch a single task by ID
   * @param id - Task ID
   */
  getTaskById(id: string | number): Observable<Task | undefined> {
    return this.getTasks().pipe(
      map(tasks => tasks.find(task => task.id === id))
    );
  }

  /**
   * Create a new task
   * @param request - Create task request payload
   */
  createTask(request: CreateTaskRequest): Observable<Task> {
    return new Observable(observer => {
      setTimeout(() => {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const newTask: Task = {
          id: Math.max(0, ...tasks.map((t: Task) => typeof t.id === 'number' ? t.id : 0)) + 1,
          ...request,
          completed: false,
          createdAt: new Date()
        };
        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        observer.next(newTask);
        observer.complete();
      }, 300);
    });
  }

  /**
   * Update an existing task
   * @param id - Task ID
   * @param request - Update task request payload
   */
  updateTask(id: string | number, request: UpdateTaskRequest): Observable<Task | undefined> {
    return new Observable(observer => {
      setTimeout(() => {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const taskIndex = tasks.findIndex((t: Task) => t.id === id);
        if (taskIndex !== -1) {
          tasks[taskIndex] = { ...tasks[taskIndex], ...request };
          localStorage.setItem('tasks', JSON.stringify(tasks));
          observer.next(tasks[taskIndex]);
        } else {
          observer.error('Task not found');
        }
        observer.complete();
      }, 300);
    });
  }

  /**
   * Delete a task
   * @param id - Task ID
   */
  deleteTask(id: string | number): Observable<void> {
    return new Observable(observer => {
      setTimeout(() => {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const filteredTasks = tasks.filter((t: Task) => t.id !== id);
        localStorage.setItem('tasks', JSON.stringify(filteredTasks));
        observer.next();
        observer.complete();
      }, 300);
    });
  }
}
