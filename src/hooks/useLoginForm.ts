import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { LoginSchema, type LoginInput } from "@/lib/validation";

export function useLoginForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setError(null);
    setIsPending(true);

    try {
      await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
        },
        {
          onRequest: () => {
            setIsPending(true);
          },
          onSuccess: async () => {
            setIsPending(false);
            form.reset();
            toast.success("Welcome back! Redirecting to dashboard...");
            router.push("/dashboard");
            router.refresh();
          },
          onError: (ctx) => {
            setIsPending(false);
            const errMsg = ctx.error.message || "Invalid credentials. Please try again.";
            setError(errMsg);
            toast.error(errMsg);
          },
        }
      );
    } catch (err) {
      setIsPending(false);
      const errMsg = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsPending(true);
    try {
      await authClient.signIn.social(
        {
          provider: "google",
          callbackURL: "/dashboard",
        },
        {
          onRequest: () => {
            setIsPending(true);
          },
          onError: (ctx) => {
            setIsPending(false);
            const errMsg = ctx.error.message || "Google authentication failed.";
            setError(errMsg);
            toast.error(errMsg);
          },
        }
      );
    } catch (err) {
      setIsPending(false);
      const errMsg = err instanceof Error ? err.message : "An unexpected error occurred during Google sign-in.";
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    handleGoogleSignIn,
    isPending,
    error,
    setError,
  };
}
