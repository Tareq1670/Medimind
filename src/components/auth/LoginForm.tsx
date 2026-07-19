"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  ShieldAlert,
  Loader2,
  ArrowRight,
  Mail,
  Lock,
  X,
  User,
  Stethoscope,
  Shield,
  ChevronDown,
} from "lucide-react";
import {
  TextField,
  Input,
  Label,
  Button,
  Checkbox,
  Separator,
} from "@heroui/react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { LoginSchema, type LoginInput } from "@/lib/validation";
import { SESSION_KEY } from "@/hooks/useAuthSession";

type AuthMode = "user" | "admin";

export function LoginForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<AuthMode>("user");
  const [redirectTo, setRedirectTo] = useState("/dashboard");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const r = params.get("redirect") ?? params.get("callbackUrl");
    if (r) { setRedirectTo(r); return; }

    try {
      const ref = document.referrer;
      if (ref) {
        const refUrl = new URL(ref);
        if (refUrl.origin === window.location.origin) {
          const path = refUrl.pathname;
          if (path !== "/login" && path !== "/register" && path !== "/forgot-password") {
            setRedirectTo(path);
            return;
          }
        }
      }
    } catch {
      // ignore invalid referrer
    }
  }, []);

  const { control, handleSubmit, setValue, reset } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = async (data: LoginInput) => {
    setError(null);
    setIsPending(true);
    try {
      await authClient.signIn.email(
        { email: data.email, password: data.password },
        {
          onRequest: () => setIsPending(true),
          onSuccess: async () => {
            setIsPending(false);
            reset();
            await queryClient.invalidateQueries({ queryKey: SESSION_KEY });
            toast.success(`Welcome back! Redirecting...`);
            router.push(redirectTo);
            router.refresh();
          },
          onError: (ctx) => {
            setIsPending(false);
            const msg = ctx.error.message || "Invalid credentials. Please try again.";
            setError(msg);
            toast.error(msg);
          },
        },
      );
    } catch (err) {
      setIsPending(false);
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(msg);
      toast.error(msg);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsPending(true);
    try {
      await authClient.signIn.social(
        { provider: "google", callbackURL: redirectTo },
        {
          onRequest: () => setIsPending(true),
          onError: (ctx) => {
            setIsPending(false);
            const msg = ctx.error.message || "Google authentication failed.";
            setError(msg);
            toast.error(msg);
          },
        },
      );
    } catch (err) {
      setIsPending(false);
      const msg = err instanceof Error ? err.message : "Google sign-in failed.";
      setError(msg);
      toast.error(msg);
    }
  };

  const [showDemo, setShowDemo] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

  const handleDemoLogin = async (email: string, password: string, label: string) => {
    setError(null);
    setDemoLoading(label);
    setValue("email", email);
    setValue("password", password);
    try {
      await authClient.signIn.email(
        { email, password },
        {
          onRequest: () => setDemoLoading(label),
          onSuccess: async () => {
            setDemoLoading(null);
            reset();
            await queryClient.invalidateQueries({ queryKey: SESSION_KEY });
            toast.success(`Welcome, ${label}!`);
            router.push(redirectTo);
            router.refresh();
          },
          onError: (ctx) => {
            setDemoLoading(null);
            const msg = ctx.error.message || "Demo login failed.";
            setError(msg);
            toast.error(msg);
          },
        },
      );
    } catch (err) {
      setDemoLoading(null);
      const msg = err instanceof Error ? err.message : "Demo login failed.";
      setError(msg);
      toast.error(msg);
    }
  };

  const DEMO_ACCOUNTS: {
    label: string;
    email: string;
    password: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bg: string;
    mode: AuthMode;
  }[] = [
    {
      label: "Patient",
      email: "patient@medimind.demo",
      password: "Demo@1234",
      icon: User,
      color: "text-primary",
      bg: "bg-primary/5 border-primary/20 hover:bg-primary/10",
      mode: "user",
    },
    {
      label: "Doctor",
      email: "doctor@medimind.demo",
      password: "Demo@1234",
      icon: Stethoscope,
      color: "text-secondary",
      bg: "bg-secondary/5 border-secondary/20 hover:bg-secondary/10",
      mode: "user",
    },
    {
      label: "Admin",
      email: "admin@medimind.demo",
      password: "Admin@1234",
      icon: Shield,
      color: "text-amber-500",
      bg: "bg-amber-50 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/20 dark:border-amber-800/40 dark:hover:bg-amber-950/40",
      mode: "admin",
    },
  ];

  const filteredDemos = DEMO_ACCOUNTS.filter((a) => a.mode === mode);

  const renderError = (msg: string | undefined) =>
    msg ? (
      <p className="mt-1.5 text-xs font-semibold text-rose-500 dark:text-rose-400">{msg}</p>
    ) : null;

  return (
    <div className="w-full space-y-5">
      {/* Mode Toggle */}
      <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800/60">
        {[
          { value: "user" as AuthMode, label: "User Login", icon: User },
          { value: "admin" as AuthMode, label: "Admin Login", icon: Shield },
        ].map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              setMode(value);
              setError(null);
            }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 ${
              mode === value
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="space-y-1 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {mode === "admin" ? "Admin Access" : "Welcome back"}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {mode === "admin"
            ? "Sign in to manage the MediMind platform"
            : "Sign in to access your AI health companion"}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-100 bg-rose-50/50 p-3 text-sm text-rose-800 dark:border-rose-900/30 dark:bg-rose-950/20 dark:text-rose-300">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold">Authentication Failed</p>
            <p className="mt-0.5 text-[11px] leading-relaxed opacity-90">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="shrink-0 rounded-lg p-0.5 text-rose-400 transition-colors hover:bg-rose-100 hover:text-rose-700 dark:hover:bg-rose-900/30 dark:hover:text-rose-200"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Email */}
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <div className="group w-full space-y-1">
              <TextField isRequired value={field.value} onChange={field.onChange} onBlur={field.onBlur} isInvalid={fieldState.invalid} className="!w-full block">
                <Label className="text-[11px] font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                  {mode === "admin" ? "Admin Email" : "Email Address"}
                </Label>
                <div className="relative mt-1 w-full">
                  <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-primary dark:text-slate-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <Input
                    placeholder={mode === "admin" ? "admin@medimind.ai" : "doctor@medimind.ai"}
                    className="block !w-full h-10 rounded-xl border-slate-200 bg-slate-50/50 pl-10 text-sm transition-all focus:border-primary dark:border-slate-700/80 dark:bg-slate-800/40"
                  />
                </div>
              </TextField>
              {renderError(fieldState.error?.message)}
            </div>
          )}
        />

        {/* Password */}
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <div className="group w-full space-y-1">
              <TextField isRequired value={field.value} onChange={field.onChange} onBlur={field.onBlur} isInvalid={fieldState.invalid} className="!w-full block">
                <Label className="text-[11px] font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">Password</Label>
                <div className="relative mt-1 w-full">
                  <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-primary dark:text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="block !w-full h-10 rounded-xl border-slate-200 bg-slate-50/50 pl-10 pr-11 text-sm transition-all focus:border-primary dark:border-slate-700/80 dark:bg-slate-800/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </TextField>
              {renderError(fieldState.error?.message)}
            </div>
          )}
        />

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between pt-1">
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <Checkbox isSelected={field.value} onChange={field.onChange}>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 select-none cursor-pointer">
                  Remember Me
                </span>
              </Checkbox>
            )}
          />
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-primary transition-colors hover:text-primary/90"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Sign In */}
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isDisabled={isPending}
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-white shadow-md shadow-primary/10 transition-all hover:bg-primary/95 hover:shadow-lg hover:shadow-primary/20"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>{mode === "admin" ? "Sign In as Admin" : "Sign In"}</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Demo Credentials */}
      {filteredDemos.length > 0 && (
        <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setShowDemo(!showDemo)}
            className="flex w-full items-center justify-between text-[11px] font-semibold uppercase tracking-widest text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
          >
            <span>{mode === "admin" ? "Admin Demo Account" : "Demo Credentials"} <span className="text-amber-500">(DEV ONLY)</span></span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showDemo ? "rotate-180" : ""}`} />
          </button>
          {showDemo && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              {filteredDemos.map(({ label, email, password, icon: Icon, color, bg }) => (
                <button
                  key={label}
                  type="button"
                  disabled={isPending || demoLoading !== null}
                  onClick={() => handleDemoLogin(email, password, label)}
                  className={`relative flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition-all ${
                    demoLoading === label ? "scale-95 opacity-70" : ""
                  } ${bg}`}
                >
                  <Icon className={`h-5 w-5 ${color}`} />
                  <span className={`text-xs font-semibold ${color}`}>{label}</span>
                  <span className="truncate text-[10px] text-slate-400 dark:text-slate-500">{email}</span>
                  {demoLoading === label && <Loader2 className="absolute h-4 w-4 animate-spin text-slate-400" />}
                </button>
            ))}
          </div>
        )}
      </div>
      )}

      {/* Divider */}
      <div className="relative flex items-center py-1">
        <Separator className="flex-1 bg-slate-100 dark:bg-slate-800" />
        <span className="whitespace-nowrap px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Or continue with
        </span>
        <Separator className="flex-1 bg-slate-100 dark:bg-slate-800" />
      </div>

      {/* Google */}
      <Button
        type="button"
        variant="outline"
        fullWidth
        onPress={handleGoogleSignIn}
        isDisabled={isPending}
        className="flex h-10 w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        <span>Sign in with Google</span>
      </Button>

      {/* Footer */}
      {mode === "user" && (
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            href={`/register${redirectTo !== "/dashboard" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
            className="font-bold text-primary transition-colors hover:text-primary/90"
          >
            Create account
          </Link>
        </p>
      )}
    </div>
  );
}
