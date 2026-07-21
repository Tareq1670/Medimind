import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, patch, deleteRequest } from "@/lib/api";
import toast from "react-hot-toast";
import type { Medicine, MedicineFilter, PaginatedResponse, MedicineFormData } from "@/types";

function extractPaginatedData<T>(raw: unknown): {
  data: T[];
  pagination?: { page: number; totalPages: number; total: number };
} {
  if (raw && typeof raw === "object") {
    const r = raw as Record<string, unknown>;
    if (Array.isArray(r.data)) {
      return {
        data: r.data as T[],
        pagination: r.pagination as { page: number; totalPages: number; total: number } | undefined,
      };
    }
  }
  if (Array.isArray(raw)) return { data: raw as T[] };
  return { data: [] };
}

export function useMedicines(filter: MedicineFilter = {}) {
  const params = new URLSearchParams();
  if (filter.category) params.set("category", filter.category);
  if (filter.search) params.set("search", filter.search);
  if (filter.minPrice !== undefined) params.set("minPrice", String(filter.minPrice));
  if (filter.maxPrice !== undefined) params.set("maxPrice", String(filter.maxPrice));
  if (filter.isPrescriptionRequired !== undefined) params.set("prescription", String(filter.isPrescriptionRequired));
  if (filter.sortBy) params.set("sortBy", filter.sortBy);
  if (filter.sortOrder) params.set("sortOrder", filter.sortOrder);
  if (filter.page) params.set("page", String(filter.page));
  if (filter.limit) params.set("limit", String(filter.limit));
  const qs = params.toString();

  return useQuery({
    queryKey: ["medicines", filter],
    queryFn: async () => {
      const result = await get<PaginatedResponse<Medicine>>(`/medicines${qs ? `?${qs}` : ""}`);
      return extractPaginatedData<Medicine>(result);
    },
    staleTime: 1000 * 60 * 3,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useMedicine(id: string) {
  return useQuery({
    queryKey: ["medicine", id],
    queryFn: () => get<Medicine>(`/medicines/${id}`),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

export function useCreateMedicine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: MedicineFormData) => post("/medicines", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["medicines"] });
      toast.success("Medicine created");
    },
    onError: () => toast.error("Failed to create medicine"),
  });
}

export function useUpdateMedicine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MedicineFormData> }) =>
      patch(`/medicines/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["medicines"] });
      toast.success("Medicine updated");
    },
    onError: () => toast.error("Failed to update medicine"),
  });
}

export function useDeleteMedicine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRequest(`/medicines/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["medicines"] });
      toast.success("Medicine deleted");
    },
    onError: () => toast.error("Failed to delete medicine"),
  });
}
