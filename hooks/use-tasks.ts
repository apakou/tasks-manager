import { useState, useCallback } from 'react';
import { Task, TaskFilters, TaskSortOptions } from '@/types';

// Mock data for development - replace with API calls
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project setup',
    description: 'Set up the initial project structure and dependencies',
    completed: false,
    priority: 'high' as any,
    category: 'Development',
    dueDate: new Date(Date.now() + 86400000), // Tomorrow
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'user1',
    tags: ['setup', 'project'],
  },
  {
    id: '2',
    title: 'Design database schema',
    description: 'Create the database schema for users and tasks',
    completed: true,
    priority: 'medium' as any,
    category: 'Database',
    dueDate: new Date(),
    createdAt: new Date(Date.now() - 86400000), // Yesterday
    updatedAt: new Date(),
    userId: 'user1',
    tags: ['database', 'design'],
  },
];

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (filters?: TaskFilters) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      let filteredTasks = mockTasks;

      if (filters) {
        filteredTasks = mockTasks.filter(task => {
          if (filters.completed !== undefined && task.completed !== filters.completed) {
            return false;
          }
          if (filters.priority && !filters.priority.includes(task.priority)) {
            return false;
          }
          if (filters.category && !filters.category.includes(task.category || '')) {
            return false;
          }
          return true;
        });
      }

      setTasks(filteredTasks);
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      const newTask: Task = {
        ...taskData,
        id: Math.random().toString(36),
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'user1', // TODO: Get from auth context
      };
      
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError('Failed to create task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      ));
    } catch (err) {
      setError('Failed to update task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (taskId: string) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      setError('Failed to delete task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleTaskCompletion = useCallback(async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      await updateTask(taskId, { completed: !task.completed });
    }
  }, [tasks, updateTask]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
  };
}