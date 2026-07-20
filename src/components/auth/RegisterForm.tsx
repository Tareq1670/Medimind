"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  EyeOff,
  ShieldAlert,
  Loader2,
  ArrowRight,
  User,
  Stethoscope,
  Mail,
  Lock,
  X,
  Camera,
  Trash2,
} from "@/lib/icon-map";
import { imageUploader } from "@/lib/imageUploader";
import {
  TextField,
  Input,
  Label,
  Button,
  Separator,
} from "@heroui/react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { RegisterSchema, type RegisterInput } from "@/lib/validation";

function PasswordStrengthMeter({ password }: { password: string }) {
  if (!password) return null;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  const pct = (score / 5) * 100;
  const cfg =
    score <= 2
      ? { label: "Weak", color: "text-red-500", fill: "bg-red-500", track: "bg-red-100 dark:bg-red-950" }
      : score <= 4
        ? { label: "Medium", color: "text-amber-500", fill: "bg-amber-500", track: "bg-amber-100 dark:bg-amber-950" }
        : { label: "Strong", color: "text-emerald-500", fill: "bg-emerald-500", track: "bg-emerald-100 dark:bg-emerald-950" };
  return (
    <div className="flex items-center gap-2">
      <div className={`h-1.5 flex-1 overflow-hidden rounded-full ${cfg.track}`}>
        <div className={`h-full rounded-full transition-all duration-500 ease-out ${cfg.fill}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`whitespace-nowrap text-[11px] font-semibold ${cfg.color}`}>{cfg.label}</span>
    </div>
  );
}

const renderError = (msg: string | undefined) =>
  msg ? <p className="mt-1 text-[11px] font-medium text-red-500">{msg}</p> : null;

export function RegisterForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [redirectTo, setRedirectTo] = useState("/dashboard");

  useEffect(() => {
    const r = new URLSearchParams(window.location.search).get("redirect");
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

  const { control, handleSubmit, watch, reset } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      image: "",
      password: "",
      confirmPassword: "",
      role: "user",
      dob: "",
      bloodGroup: "",
      tos: false,
    },
  });

  const passwordValue = watch("password");
  const roleValue = watch("role");

  const onSubmit = async (data: RegisterInput) => {
    setError(null);
    setIsPending(true);
    try {
      await authClient.signUp.email(
        {
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
          image: data.image || undefined,
          ...(data.dob ? { dob: data.dob } : {}),
          ...(data.bloodGroup ? { bloodGroup: data.bloodGroup } : {}),
        } as Parameters<typeof authClient.signUp.email>[0],
        {
          onRequest: () => setIsPending(true),
          onSuccess: async () => {
            setIsPending(false);
            reset();
            toast.success("Account created! Please sign in.");
            router.push(`/login${redirectTo !== "/dashboard" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`);
          },
          onError: (ctx) => {
            setIsPending(false);
            const msg = ctx.error.message || "Registration failed. Please check your inputs.";
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

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div className="space-y-1 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Create an account
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Join MediMind to personalize your healthcare journey
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold">Registration Failed</p>
            <p className="mt-0.5 text-[11px] opacity-80">{error}</p>
          </div>
          <button type="button" onClick={() => setError(null)} className="shrink-0 text-red-400 hover:text-red-600 dark:hover:text-red-300">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Name + Email */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <div className="group w-full">
                <TextField isRequired value={field.value} onChange={field.onChange} onBlur={field.onBlur} isInvalid={fieldState.invalid} className="block !w-full">
                  <Label className="text-[11px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">Full Name</Label>
                  <div className="relative mt-1 w-full">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary" />
                    <Input placeholder="John Doe" className="block !w-full h-10 rounded-xl border-slate-200 bg-slate-50/50 pl-9 text-sm transition-all focus:border-primary dark:border-slate-700/80 dark:bg-slate-800/40" />
                  </div>
                </TextField>
                {renderError(fieldState.error?.message)}
              </div>
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <div className="group w-full">
                <TextField isRequired value={field.value} onChange={field.onChange} onBlur={field.onBlur} isInvalid={fieldState.invalid} className="block !w-full">
                  <Label className="text-[11px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">Email Address</Label>
                  <div className="relative mt-1 w-full">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary" />
                    <Input type="email" placeholder="john@example.com" className="block !w-full h-10 rounded-xl border-slate-200 bg-slate-50/50 pl-9 text-sm transition-all focus:border-primary dark:border-slate-700/80 dark:bg-slate-800/40" />
                  </div>
                </TextField>
                {renderError(fieldState.error?.message)}
              </div>
            )}
          />
        </div>

        {/* Role Selection */}
        <div className="space-y-2">
          <Label className="text-[11px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">I want to join as</Label>
          <Controller
            name="role"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "user", label: "Patient", icon: User, color: "text-primary" },
                    { value: "doctor", label: "Doctor", icon: Stethoscope, color: "text-secondary" },
                  ].map(({ value, label, icon: Icon, color }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => field.onChange(value)}
                      className={`relative flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all duration-200 ${
                        field.value === value
                          ? "border-primary bg-primary/5 shadow-sm shadow-primary/5"
                          : "border-slate-200 bg-white/50 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/20 dark:hover:border-slate-600 dark:hover:bg-slate-800/40"
                      }`}
                    >
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all ${
                        field.value === value ? "bg-primary/10" : "bg-slate-100 dark:bg-slate-800"
                      }`}>
                        <Icon className={`h-4 w-4 ${field.value === value ? color : "text-slate-400"}`} />
                      </div>
                      <span className={`text-sm font-semibold ${field.value === value ? "text-primary" : "text-slate-700 dark:text-slate-300"}`}>
                        {label}
                      </span>
                      {field.value === value && (
                        <div className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                          <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {renderError(fieldState.error?.message)}
              </div>
            )}
          />
        </div>

        {/* Avatar Upload */}
        <div className="space-y-2">
          <Label className="text-[11px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">Profile Photo</Label>
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                  {field.value ? (
                    <Image src={field.value} alt="Avatar preview" fill unoptimized className="object-cover" />
                  ) : (
                    <User className="h-full w-full p-3 text-slate-400" />
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <label className="relative cursor-pointer">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/gif"
                        disabled={uploading}
                        className="absolute inset-0 cursor-pointer opacity-0"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (file.size > 5 * 1024 * 1024) {
                            toast.error("Image must be under 5MB");
                            return;
                          }
                          setUploading(true);
                          try {
                            const data = await imageUploader(file);
                            field.onChange(data.url);
                            toast.success("Photo uploaded");
                          } catch {
                            toast.error("Failed to upload image");
                          } finally {
                            setUploading(false);
                          }
                        }}
                      />
                      <span className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                        {uploading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Camera className="h-3.5 w-3.5" />
                        )}
                        {uploading ? "Uploading…" : "Upload Photo"}
                      </span>
                    </label>
                    {field.value && (
                      <button
                        type="button"
                        onClick={() => field.onChange("")}
                        className="inline-flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-medium text-slate-500 transition-all hover:bg-slate-100 hover:text-red-500 dark:hover:bg-slate-800 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">Supported: JPG, PNG, GIF. Max 5MB.</p>
                </div>
              </div>
            )}
          />
        </div>

        {/* Password + Confirm Password */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <div className="group w-full">
                <TextField isRequired value={field.value} onChange={field.onChange} onBlur={field.onBlur} isInvalid={fieldState.invalid} className="block !w-full">
                  <Label className="text-[11px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">Password</Label>
                  <div className="relative mt-1 w-full">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary" />
                    <Input type={showPassword ? "text" : "password"} placeholder="••••••••" className="block !w-full h-10 rounded-xl border-slate-200 bg-slate-50/50 pl-9 pr-10 text-sm transition-all focus:border-primary dark:border-slate-700/80 dark:bg-slate-800/40" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300" aria-label={showPassword ? "Hide password" : "Show password"} tabIndex={-1}>
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </TextField>
                {renderError(fieldState.error?.message)}
              </div>
            )}
          />
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field, fieldState }) => (
              <div className="group w-full">
                <TextField isRequired value={field.value} onChange={field.onChange} onBlur={field.onBlur} isInvalid={fieldState.invalid} className="block !w-full">
                  <Label className="text-[11px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">Confirm Password</Label>
                  <div className="relative mt-1 w-full">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary" />
                    <Input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" className="block !w-full h-10 rounded-xl border-slate-200 bg-slate-50/50 pl-9 pr-10 text-sm transition-all focus:border-primary dark:border-slate-700/80 dark:bg-slate-800/40" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300" aria-label={showConfirmPassword ? "Hide password" : "Show password"} tabIndex={-1}>
                      {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </TextField>
                {renderError(fieldState.error?.message)}
              </div>
            )}
          />
        </div>

        <PasswordStrengthMeter password={passwordValue} />

        {/* TOS */}
        <Controller
          name="tos"
          control={control}
          render={({ field, fieldState }) => (
            <div className="w-full">
              <label className="group flex cursor-pointer items-start gap-2.5 select-none">
                <span className="relative mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
                  <input type="checkbox" checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} className="peer absolute inset-0 cursor-pointer opacity-0" />
                  <span className="flex h-4 w-4 items-center justify-center rounded border-2 border-slate-300 bg-white transition-all peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30 dark:border-slate-600 dark:bg-slate-800 dark:peer-checked:border-primary dark:peer-checked:bg-primary">
                    <svg className={`h-2.5 w-2.5 text-white transition-opacity ${field.value ? "opacity-100" : "opacity-0"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                </span>
                <span className="text-[11px] leading-relaxed text-slate-500 transition-colors group-hover:text-slate-700 dark:group-hover:text-slate-300">
                  I accept the{" "}
                  <Link href="/terms" className="font-medium text-primary hover:underline">Terms of Service</Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="font-medium text-primary hover:underline">Privacy Policy</Link>
                </span>
              </label>
              {renderError(fieldState.error?.message)}
            </div>
          )}
        />

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isDisabled={isPending}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-white shadow-md shadow-primary/20 transition-all duration-200 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98]"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center py-1">
        <Separator className="flex-1 bg-slate-100 dark:bg-slate-700/50" />
        <span className="whitespace-nowrap px-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Or continue with</span>
        <Separator className="flex-1 bg-slate-100 dark:bg-slate-700/50" />
      </div>

      {/* Google */}
      <Button
        type="button"
        variant="outline"
        fullWidth
        onPress={async () => {
          try {
            document.cookie = `medimind_pending_role=${roleValue}; path=/; max-age=300; SameSite=Lax`;
            await authClient.signIn.social({ provider: "google", callbackURL: redirectTo });
          } catch {
            // handled by better-auth
          }
        }}
        isDisabled={isPending}
        className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        <span>Sign up with Google</span>
      </Button>

      {/* Footer */}
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{" "}
        <Link
          href={`/login${redirectTo !== "/dashboard" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
          className="font-semibold text-primary transition-colors hover:text-primary/80"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
