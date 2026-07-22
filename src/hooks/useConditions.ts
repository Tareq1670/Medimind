import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, patch, deleteRequest, extractPaginatedData } from "@/lib/api";
import toast from "react-hot-toast";
import type { Condition, ConditionFilter, PaginatedResponse, ConditionFormData } from "@/types";

export function useConditions(filter: ConditionFilter = {}) {
  const params = new URLSearchParams();
  if (filter.search) params.set("search", filter.search);
  if (filter.severity) params.set("severity", filter.severity);
  if (filter.page) params.set("page", String(filter.page));
  if (filter.limit) params.set("limit", String(filter.limit));
  const qs = params.toString();

  return useQuery({
    queryKey: ["conditions", filter],
    queryFn: async () => {
      const result = await get<PaginatedResponse<Condition>>(`/conditions${qs ? `?${qs}` : ""}`);
      return extractPaginatedData<Condition>(result);
    },
    staleTime: 1000 * 60 * 3,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useCondition(id: string) {
  return useQuery({
    queryKey: ["condition", id],
    queryFn: () => get<Condition>(`/conditions/${id}`),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

export function useCreateCondition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ConditionFormData) => post("/conditions", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["conditions"] });
      toast.success("Condition created");
    },
    onError: () => toast.error("Failed to create condition"),
  });
}

export function useUpdateCondition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ConditionFormData> }) =>
      patch(`/conditions/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["conditions"] });
      toast.success("Condition updated");
    },
    onError: () => toast.error("Failed to update condition"),
  });
}

export function useDeleteCondition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRequest(`/conditions/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["conditions"] });
      toast.success("Condition deleted");
    },
    onError: () => toast.error("Failed to delete condition"),
  });
}
