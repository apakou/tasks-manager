"use client";

import { LoginForm } from "@/components/auth/login-form";
import { LoginInput } from "@/lib/validations/schemas";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (data: LoginInput) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to dashboard on successful login
        router.push('/dashboard');
      } else {
        throw new Error(result.error || 'Login failed');
      }
    } catch (error) {
      throw error; // Re-throw to be handled by LoginForm
    }
  };

  return <LoginForm onSubmit={handleLogin} />;
}