import { NextRequest, NextResponse } from "next/server";
import { updateTaskSchema, deleteTaskSchema } from "@/lib/validations/schemas";
import { ApiResponse } from "@/types";

// Mock database - replace with actual database integration
const tasks: any[] = [];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id;
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
      const response: ApiResponse = {
        success: false,
        error: "Task not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      data: task,
      message: "Task retrieved successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: "Failed to fetch task",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id;
    const body = await request.json();
    
    // Validate request body
    const validatedData = updateTaskSchema.parse({ ...body, id: taskId });
    
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
      const response: ApiResponse = {
        success: false,
        error: "Task not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    // TODO: Add authorization check (user can only update their own tasks)

    const updatedTask = {
      ...tasks[taskIndex],
      ...validatedData,
      updatedAt: new Date(),
    };

    // TODO: Update in actual database
    tasks[taskIndex] = updatedTask;

    const response: ApiResponse = {
      success: true,
      data: updatedTask,
      message: "Task updated successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update task",
    };
    return NextResponse.json(response, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id;
    
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
      const response: ApiResponse = {
        success: false,
        error: "Task not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    // TODO: Add authorization check (user can only delete their own tasks)

    // TODO: Delete from actual database
    tasks.splice(taskIndex, 1);

    const response: ApiResponse = {
      success: true,
      message: "Task deleted successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: "Failed to delete task",
    };
    return NextResponse.json(response, { status: 500 });
  }
}