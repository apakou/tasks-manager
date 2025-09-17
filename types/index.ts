// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Task-related types
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: TaskPriority;
  category?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  tags: string[];
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Daily tasks view specific types
export interface DailyTasksView {
  date: Date;
  tasks: Task[];
  completedCount: number;
  totalCount: number;
}

// Form types
export interface CreateTaskInput {
  title: string;
  description?: string;
  priority: TaskPriority;
  category?: string;
  dueDate?: Date;
  tags: string[];
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  id: string;
  completed?: boolean;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Filter and sorting types
export interface TaskFilters {
  priority?: TaskPriority[];
  category?: string[];
  completed?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
}

export interface TaskSortOptions {
  field: 'createdAt' | 'dueDate' | 'priority' | 'title';
  direction: 'asc' | 'desc';
}

// Dashboard types
export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  todaysTasks: number;
}