/**
 * Task Model
 * Represents a single task item in the application
 */
export interface Task {
  id: string | number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
}

/**
 * CreateTaskRequest Model
 * Used for creating new tasks
 */
export interface CreateTaskRequest {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
}

/**
 * UpdateTaskRequest Model
 * Used for updating existing tasks
 */
export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
}
