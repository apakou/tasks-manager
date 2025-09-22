import { createClient } from '@/lib/supabase/browser'
import { Task, TaskPriority, CreateTaskInput, UpdateTaskInput } from '@/types'

export interface SupabaseTask {
  id: string
  title: string
  description: string | null
  completed: boolean
  priority: TaskPriority
  category: string | null
  due_date: string | null
  tags: string[]
  created_at: string
  updated_at: string
  user_id: string
}

// Convert Supabase task to our Task type
export const mapSupabaseTaskToTask = (supabaseTask: SupabaseTask): Task => ({
  id: supabaseTask.id,
  title: supabaseTask.title,
  description: supabaseTask.description || undefined,
  completed: supabaseTask.completed,
  priority: supabaseTask.priority,
  category: supabaseTask.category || undefined,
  dueDate: supabaseTask.due_date ? new Date(supabaseTask.due_date) : undefined,
  tags: supabaseTask.tags || [],
  createdAt: new Date(supabaseTask.created_at),
  updatedAt: new Date(supabaseTask.updated_at),
  userId: supabaseTask.user_id,
})

// Convert our Task type to Supabase insert format
export const mapTaskToSupabaseInsert = (task: CreateTaskInput, userId: string) => ({
  title: task.title,
  description: task.description || null,
  priority: task.priority,
  category: task.category || null,
  due_date: task.dueDate ? task.dueDate.toISOString() : null,
  tags: task.tags || [],
  user_id: userId,
})

// Convert our Task type to Supabase update format
export const mapTaskToSupabaseUpdate = (task: Partial<UpdateTaskInput>) => {
  const update: Partial<SupabaseTask> = {}
  
  if (task.title !== undefined) update.title = task.title
  if (task.description !== undefined) update.description = task.description || null
  if (task.completed !== undefined) update.completed = task.completed
  if (task.priority !== undefined) update.priority = task.priority
  if (task.category !== undefined) update.category = task.category || null
  if (task.dueDate !== undefined) update.due_date = task.dueDate ? task.dueDate.toISOString() : null
  if (task.tags !== undefined) update.tags = task.tags || []
  
  return update
}

export class TaskService {
  private supabase = createClient()

  async getTasks(filters?: {
    completed?: boolean
    priority?: TaskPriority[]
    category?: string[]
    dateRange?: { start: Date; end: Date }
  }): Promise<Task[]> {
    let query = this.supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply filters
    if (filters?.completed !== undefined) {
      query = query.eq('completed', filters.completed)
    }

    if (filters?.priority && filters.priority.length > 0) {
      query = query.in('priority', filters.priority)
    }

    if (filters?.category && filters.category.length > 0) {
      query = query.in('category', filters.category)
    }

    if (filters?.dateRange) {
      query = query
        .gte('due_date', filters.dateRange.start.toISOString())
        .lte('due_date', filters.dateRange.end.toISOString())
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch tasks: ${error.message}`)
    }

    return (data as SupabaseTask[]).map(mapSupabaseTaskToTask)
  }

  async getTaskById(id: string): Promise<Task | null> {
    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Task not found
      }
      throw new Error(`Failed to fetch task: ${error.message}`)
    }

    return mapSupabaseTaskToTask(data as SupabaseTask)
  }

  async createTask(taskData: CreateTaskInput, userId: string): Promise<Task> {
    const supabaseTask = mapTaskToSupabaseInsert(taskData, userId)

    const { data, error } = await this.supabase
      .from('tasks')
      .insert(supabaseTask)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create task: ${error.message}`)
    }

    return mapSupabaseTaskToTask(data as SupabaseTask)
  }

  async updateTask(id: string, updates: Partial<UpdateTaskInput>): Promise<Task> {
    console.log('🔄 TaskService.updateTask called with:', { id, updates });
    
    const supabaseUpdate = mapTaskToSupabaseUpdate(updates)
    console.log('🔄 Supabase update data:', supabaseUpdate);

    const { data, error } = await this.supabase
      .from('tasks')
      .update(supabaseUpdate)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('❌ Update error:', error);
      throw new Error(`Failed to update task: ${error.message}`)
    }

    console.log('✅ Update successful, returned data:', data);
    return mapSupabaseTaskToTask(data as SupabaseTask)
  }

  async deleteTask(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete task: ${error.message}`)
    }
  }

  async toggleTaskCompletion(id: string): Promise<Task> {
    // First get the current task to know its completion status
    const task = await this.getTaskById(id)
    if (!task) {
      throw new Error('Task not found')
    }

    return this.updateTask(id, { completed: !task.completed })
  }

  async getTasksByDate(date: Date): Promise<Task[]> {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .gte('due_date', startOfDay.toISOString())
      .lte('due_date', endOfDay.toISOString())
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch tasks by date: ${error.message}`)
    }

    return (data as SupabaseTask[]).map(mapSupabaseTaskToTask)
  }

  async getTaskStats(): Promise<{
    total: number
    completed: number
    pending: number
    overdue: number
    today: number
  }> {
    const now = new Date()
    const today = new Date(now)
    today.setHours(0, 0, 0, 0)
    const endOfToday = new Date(now)
    endOfToday.setHours(23, 59, 59, 999)

    // Get all tasks for stats
    const { data: allTasks, error } = await this.supabase
      .from('tasks')
      .select('*')

    if (error) {
      throw new Error(`Failed to fetch task stats: ${error.message}`)
    }

    const tasks = (allTasks as SupabaseTask[]).map(mapSupabaseTaskToTask)

    const total = tasks.length
    const completed = tasks.filter(task => task.completed).length
    const pending = tasks.filter(task => !task.completed).length
    const overdue = tasks.filter(task => 
      task.dueDate && 
      task.dueDate < today && 
      !task.completed
    ).length
    const todayTasks = tasks.filter(task =>
      task.dueDate &&
      task.dueDate >= today &&
      task.dueDate <= endOfToday
    ).length

    return {
      total,
      completed,
      pending,
      overdue,
      today: todayTasks,
    }
  }
}

// Create a singleton instance
export const taskService = new TaskService()