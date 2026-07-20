import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, patch } from "@/lib/api";
import toast from "react-hot-toast";

interface AppUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  banned: boolean;
  createdAt: string;
}

interface UserFilter {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}

interface PaginatedResult {
  data: AppUser[];
  pagination?: { page: number; totalPages: number; total: number; hasNextPage: boolean; hasPrevPage: boolean };
}

export function useUsers(filter: UserFilter = {}) {
  const params = new URLSearchParams();
  if (filter.search) params.set("search", filter.search);
  if (filter.role) params.set("role", filter.role);
  if (filter.page) params.set("page", String(filter.page));
  if (filter.limit) params.set("limit", String(filter.limit));
  const qs = params.toString();

  return useQuery({
    queryKey: ["users", filter],
    queryFn: async () => {
      const result = await get<PaginatedResult>(`/auth/users${qs ? `?${qs}` : ""}`);
      return {
        data: result.data ?? (Array.isArray(result) ? result : []),
        pagination: result.pagination,
      };
    },
    staleTime: 1000 * 60 * 3,
    retry: 1,
    refetchOnWindowFocus: false,
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
