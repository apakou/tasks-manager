"use client";

import { useState, useEffect } from "react";
import { useTasks } from "@/hooks/use-tasks";
import { Task } from "@/types";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskForm } from "@/components/forms/task-form";
import { PageHeader, PageHeaderHeading, PageHeaderActions } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, AlertCircle } from "lucide-react";
import { CreateTaskInput } from "@/lib/validations/schemas";
import { taskService } from "@/lib/services/task-service";
import { useAuth } from "@/lib/auth/auth-context";

export default function DashboardPage() {
  const { user } = useAuth();
  const { tasks, loading, error, createTask, updateTask, deleteTask, toggleTaskCompletion } = useTasks();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    today: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Fetch task stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      try {
        setLoadingStats(true);
        const taskStats = await taskService.getTaskStats();
        setStats(taskStats);
      } catch (error) {
        console.error('Failed to fetch task stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [user, tasks]); // Refetch stats when tasks change

  const handleCreateTask = async (data: CreateTaskInput) => {
    await createTask(data);
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
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate);
    return taskDate.toDateString() === today.toDateString();
  });

  if (loading && tasks.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

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

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">
            {loadingStats ? "..." : stats.total}
          </div>
          <p className="text-muted-foreground">Total Tasks</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">
            {loadingStats ? "..." : stats.completed}
          </div>
          <p className="text-muted-foreground">Completed</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="text-2xl font-bold text-orange-600">
            {loadingStats ? "..." : stats.pending}
          </div>
          <p className="text-muted-foreground">Pending</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="text-2xl font-bold text-red-600">
            {loadingStats ? "..." : stats.overdue}
          </div>
          <p className="text-muted-foreground">Overdue</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="text-2xl font-bold text-purple-600">
            {loadingStats ? "..." : stats.today}
          </div>
          <p className="text-muted-foreground">Due Today</p>
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