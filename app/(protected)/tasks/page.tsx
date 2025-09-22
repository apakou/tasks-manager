"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskForm } from "@/components/forms/task-form";
import { useTasks } from "@/hooks/use-tasks";
import { Plus, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskPriority, TaskStatus, CreateTaskInput, Task } from "@/types";

export default function TasksPage() {
  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const handleCreateTask = async (data: CreateTaskInput) => {
    console.log('➕ Creating new task with data:', data);
    await createTask(data);
  };

  const handleEditTask = async (data: CreateTaskInput) => {
    if (editingTask) {
      console.log('🎯 Editing task:', editingTask.id, 'with data:', data);
      
      // Convert CreateTaskInput to the format expected by updateTask
      const updateData: Partial<Task> = {
        title: data.title,
        description: data.description,
        priority: data.priority,
        category: data.category,
        dueDate: data.dueDate,
        tags: data.tags,
      };
      
      console.log('🎯 Calling updateTask with:', editingTask.id, updateData);
      await updateTask(editingTask.id, updateData);
    } else {
      console.log('❌ No editingTask found!');
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    await updateTask(taskId, updates);
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
  };

  const handleToggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      await updateTask(taskId, { 
        completed: !task.completed
      });
    }
  };

  const openCreateForm = () => {
    console.log('🆕 Opening create form');
    setEditingTask(undefined);
    setIsFormOpen(true);
  };

  const openEditForm = (task: Task) => {
    console.log('✏️ Opening edit form for task:', task.id, task);
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleFormClose = (open: boolean) => {
    console.log('🚪 Form close called with open:', open);
    setIsFormOpen(open);
    if (!open) {
      // Clear editing task when form closes
      console.log('🧹 Clearing editingTask');
      setEditingTask(undefined);
    }
  };

  const handleFormSubmit = async (data: CreateTaskInput) => {
    console.log('📝 Form submitted with editingTask:', editingTask?.id, 'data:', data);
    
    if (editingTask) {
      console.log('📝 Calling handleEditTask');
      await handleEditTask(data);
    } else {
      console.log('📝 Calling handleCreateTask');
      await handleCreateTask(data);
    }
  };

  // Filter tasks based on search query and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    
    // Convert completed boolean to status for filtering
    let taskStatus = task.completed ? TaskStatus.COMPLETED : TaskStatus.TODO;
    const matchesStatus = filterStatus === "all" || taskStatus === filterStatus;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="text-xl font-semibold text-destructive mb-2">Error loading tasks</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">
            Manage and organize your daily tasks
          </p>
        </div>
        <Button onClick={openCreateForm}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value={TaskPriority.LOW}>Low</SelectItem>
            <SelectItem value={TaskPriority.MEDIUM}>Medium</SelectItem>
            <SelectItem value={TaskPriority.HIGH}>High</SelectItem>
            <SelectItem value={TaskPriority.URGENT}>Urgent</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
            <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
            <SelectItem value={TaskStatus.COMPLETED}>Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {tasks.length === 0 ? "No tasks yet" : "No tasks match your filters"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {tasks.length === 0 
              ? "Create your first task to get started." 
              : "Try adjusting your search or filter criteria."
            }
          </p>
          {tasks.length === 0 && (
            <Button onClick={openCreateForm}>
              <Plus className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={() => handleToggleTask(task.id)}
              onEdit={(task) => openEditForm(task)}
              onDelete={() => handleDeleteTask(task.id)}
            />
          ))}
        </div>
      )}

      <TaskForm
        task={editingTask}
        open={isFormOpen}
        onOpenChange={handleFormClose}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}