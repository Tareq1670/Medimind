import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { RegisterSchema, type RegisterInput } from "@/lib/validation";

export function useRegisterForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      image: "",
      password: "",
      confirmPassword: "",
      dob: "",
      bloodGroup: "",
      tos: false as unknown as true,
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setError(null);
    setIsPending(true);

    try {
      await authClient.signUp.email(
        {
          email: data.email,
          password: data.password,
          name: data.name,
          image: data.image || undefined,
          ...({
            dob: data.dob || undefined,
            bloodGroup: data.bloodGroup || undefined,
          } as Record<string, unknown>),
        },
        {
          onRequest: () => {
            setIsPending(true);
          },
          onSuccess: async () => {
            setIsPending(false);
            form.reset();
            toast.success("Account created successfully! Welcome to MediMind.");
            router.push("/dashboard");
            router.refresh();
          },
          onError: (ctx) => {
            setIsPending(false);
            const errMsg = ctx.error.message || "Registration failed. Please check your inputs.";
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
