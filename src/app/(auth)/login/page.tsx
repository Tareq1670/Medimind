import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to your MediMind account to access AI health tools, track records, and more.",
};

export default function LoginPage() {
  return <LoginForm />;
}
