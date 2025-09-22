"use client";

import { SignupForm } from "@/components/auth/signup-form";
import { SignupInput } from "@/lib/validations/schemas";
import { signUp } from "@/lib/auth/auth-helpers";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = async (data: SignupInput) => {
    try {
      await signUp(data.email, data.password, data.name);
      // Note: User will need to verify email before they can login
      // You might want to redirect to a verification page or show a message
    } catch (error) {
      // Re-throw to be handled by SignupForm
      throw error;
    }
  };

  return <SignupForm onSubmit={handleSignup} />;
}