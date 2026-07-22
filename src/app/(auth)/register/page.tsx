import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create an Account",
  description: "Join MediMind — create your free account to start tracking health records, analyzing symptoms with AI, and more.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
