import { NextRequest, NextResponse } from "next/server";
import { createTaskSchema } from "@/lib/validations/schemas";
import { ApiResponse } from "@/types";

// Mock database - replace with actual database integration
const tasks: any[] = [];

export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check
    // TODO: Add user-specific task filtering
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const completed = searchParams.get('completed');

    let filteredTasks = tasks;

    // Apply filters
    if (userId) {
      filteredTasks = filteredTasks.filter(task => task.userId === userId);
    }
    if (category) {
      filteredTasks = filteredTasks.filter(task => task.category === category);
    }
    if (priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === priority);
    }
    if (completed !== null) {
      filteredTasks = filteredTasks.filter(task => 
        task.completed === (completed === 'true')
      );
    }

    const response: ApiResponse = {
      success: true,
      data: filteredTasks,
      message: "Tasks retrieved successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: "Failed to fetch tasks",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = createTaskSchema.parse(body);

    // TODO: Add authentication check and get user ID from session
    const userId = "temp-user-id";

    const newTask = {
      id: Math.random().toString(36),
      ...validatedData,
      userId,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // TODO: Save to actual database
    tasks.push(newTask);

    const response: ApiResponse = {
      success: true,
      data: newTask,
      message: "Task created successfully",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create task",
    };
    return NextResponse.json(response, { status: 400 });
  }
}