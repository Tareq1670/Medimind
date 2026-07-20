import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, patch } from "@/lib/api";
import toast from "react-hot-toast";

interface AppUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  banned: boolean;
  createdAt: string;
}

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const result = await get<{ data: AppUser[] }>("/auth/users");
      return result.data ?? (Array.isArray(result) ? result : []);
    },
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AppUser> }) =>
      patch(`/auth/users/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated");
    },
    onError: () => toast.error("Failed to update user"),
  });
}
