export type UserRole = "user" | "doctor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified?: boolean;
  image?: string;
  role: UserRole;
  dob?: string;
  bloodGroup?: string;
  banned?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  user: User;
  session: {
    id: string;
    expiresAt: string;
    token: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface AuthFormData {
  email: string;
  password: string;
  name?: string;
  role?: UserRole;
  dob?: string;
  bloodGroup?: string;
  image?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  dob?: string;
  bloodGroup?: string;
  createdAt: string;
}
