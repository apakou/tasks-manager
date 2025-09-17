"use client";

import { useState } from "react";
import { useTasks } from "@/hooks/use-tasks";
import { Task } from "@/types";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskForm } from "@/components/forms/task-form";
import { PageHeader, PageHeaderHeading, PageHeaderActions } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateTaskInput } from "@/lib/validations/schemas";

export default function DashboardPage() {
  const { tasks, loading, createTask, updateTask, deleteTask, toggleTaskCompletion } = useTasks();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  const handleCreateTask = async (data: CreateTaskInput) => {
    await createTask(data as any);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsTaskFormOpen(false);
    setEditingTask(undefined);
  };

  // Get today's tasks
  const today = new Date();
  const todaysTasks = tasks.filter(task => {
    const taskDate = task.dueDate ? new Date(task.dueDate) : null;
    return taskDate && taskDate.toDateString() === today.toDateString();
  });

  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;

  return (
    <div className="space-y-6">
      <PageHeader>
        <div>
          <PageHeaderHeading>Dashboard</PageHeaderHeading>
          <p className="text-muted-foreground">
            Manage your tasks and track your progress
          </p>
        </div>
        <PageHeaderActions>
          <Button onClick={() => setIsTaskFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </PageHeaderActions>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">{tasks.length}</div>
          <p className="text-muted-foreground">Total Tasks</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
          <p className="text-muted-foreground">Completed</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="text-2xl font-bold text-orange-600">{pendingTasks}</div>
          <p className="text-muted-foreground">Pending</p>
        </div>
      </div>

      {/* Today's Tasks */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Today's Tasks</h2>
        {todaysTasks.length > 0 ? (
          <div className="grid gap-4">
            {todaysTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={toggleTaskCompletion}
                onEdit={handleEditTask}
                onDelete={deleteTask}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No tasks scheduled for today
          </div>
        )}
      </div>

      {/* Recent Tasks */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Tasks</h2>
        {tasks.length > 0 ? (
          <div className="grid gap-4">
            {tasks.slice(0, 5).map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={toggleTaskCompletion}
                onEdit={handleEditTask}
                onDelete={deleteTask}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No tasks yet. Create your first task to get started!
          </div>
        )}
      </div>

      <TaskForm
        task={editingTask}
        open={isTaskFormOpen}
        onOpenChange={handleCloseForm}
        onSubmit={handleCreateTask}
      />
    </div>
  );
}