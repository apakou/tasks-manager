import { z } from "zod";
import { TaskPriority } from "@/types";

// Task validation schemas
export const createTaskSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z.string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  priority: z.nativeEnum(TaskPriority, {
    message: "Priority is required",
  }),
  category: z.string()
    .max(50, "Category must be less than 50 characters")
    .optional(),
  dueDate: z.date().optional(),
  tags: z.array(z.string()).default([]),
});

export const updateTaskSchema = createTaskSchema.extend({
  id: z.string().min(1, "Task ID is required"),
  completed: z.boolean().optional(),
}).partial().required({ id: true });

export const deleteTaskSchema = z.object({
  id: z.string().min(1, "Task ID is required"),
});

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string()
    .min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export const resetPasswordSchema = z.object({
  password: z.string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string()
    .min(1, "Please confirm your password"),
  token: z.string().min(1, "Reset token is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Filter validation schemas
export const taskFiltersSchema = z.object({
  priority: z.array(z.nativeEnum(TaskPriority)).optional(),
  category: z.array(z.string()).optional(),
  completed: z.boolean().optional(),
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }).optional(),
  tags: z.array(z.string()).optional(),
});

export const taskSortSchema = z.object({
  field: z.enum(['createdAt', 'dueDate', 'priority', 'title']),
  direction: z.enum(['asc', 'desc']),
});

// Type exports
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type TaskFiltersInput = z.infer<typeof taskFiltersSchema>;
export type TaskSortInput = z.infer<typeof taskSortSchema>;