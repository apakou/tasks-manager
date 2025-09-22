"use client";

import { LoginForm } from "@/components/auth/login-form";
import { LoginInput } from "@/lib/validations/schemas";
import { signIn } from "@/lib/auth/auth-helpers";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (data: LoginInput) => {
    try {
      await signIn(data.email, data.password);
      // Redirect to dashboard on successful login
      router.push('/dashboard');
    } catch (error) {
      // Re-throw to be handled by LoginForm
      throw error;
    }
  };

  return <LoginForm onSubmit={handleLogin} />;
}