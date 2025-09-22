import { useState, useCallback, useEffect } from 'react';
import { Task, TaskFilters, UpdateTaskInput } from '@/types';
import { taskService } from '@/lib/services/task-service';
import { useAuth } from '@/lib/auth/auth-context';
import { CreateTaskInput } from '@/lib/validations/schemas';

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (filters?: TaskFilters) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const fetchedTasks = await taskService.getTasks(filters);
      setTasks(fetchedTasks);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(errorMessage);
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createTask = useCallback(async (taskData: CreateTaskInput) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);
    try {
      const newTask = await taskService.createTask(taskData, user.id);
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    console.log('🪝 useTasks.updateTask called with:', { taskId, updates });

    setLoading(true);
    setError(null);
    try {
      // Convert Task updates to UpdateTaskInput format
      const updateInput: Partial<UpdateTaskInput> = {
        id: taskId,
        title: updates.title,
        description: updates.description,
        priority: updates.priority,
        category: updates.category,
        dueDate: updates.dueDate,
        tags: updates.tags,
        completed: updates.completed,
      };

      console.log('🪝 Calling taskService.updateTask with:', taskId, updateInput);
      const updatedTask = await taskService.updateTask(taskId, updateInput);
      
      console.log('🪝 Got updated task back:', updatedTask);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      return updatedTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      console.error('🪝 Update failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const deleteTask = useCallback(async (taskId: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);
    try {
      await taskService.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const toggleTaskCompletion = useCallback(async (taskId: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);
    try {
      const updatedTask = await taskService.toggleTaskCompletion(taskId);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      return updatedTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle task completion';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch tasks when user changes or component mounts
  useEffect(() => {
    if (user) {
      fetchTasks();
    } else {
      setTasks([]);
      setError(null);
    }
  }, [user, fetchTasks]);

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