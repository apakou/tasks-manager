import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations/schemas";
import { ApiResponse } from "@/types";

// Mock user data - replace with actual database integration
const mockUsers = [
  {
    id: "1",
    email: "demo@example.com",
    password: "demo123", // In production, this should be hashed
    name: "Demo User",
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const { email, password } = loginSchema.parse(body);

    // TODO: Replace with actual authentication logic
    // This is a mock implementation
    const user = mockUsers.find(u => u.email === email && u.password === password);

    if (!user) {
      const response: ApiResponse = {
        success: false,
        error: "Invalid email or password",
      };
      return NextResponse.json(response, { status: 401 });
    }

    // TODO: Generate actual JWT token and set secure cookies
    const mockToken = "mock-jwt-token";
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    const response: ApiResponse = {
      success: true,
      data: {
        user: userWithoutPassword,
        token: mockToken,
      },
      message: "Login successful",
    };

    // TODO: Set secure HTTP-only cookies for token
    const responseObj = NextResponse.json(response);
    responseObj.cookies.set('auth-token', mockToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return responseObj;
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Login failed",
    };
    return NextResponse.json(response, { status: 400 });
  }
}