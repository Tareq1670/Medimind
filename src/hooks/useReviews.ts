import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, put, deleteRequest } from "@/lib/api";
import toast from "react-hot-toast";

interface Review {
  _id: string;
  reviewerId: string;
  targetId: string;
  targetType: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  reviewer?: { name: string; email: string; avatar?: string };
  createdAt: string;
  updatedAt: string;
}

interface ReviewFilter {
  search?: string;
  approved?: string;
  targetType?: string;
  page?: number;
  limit?: number;
}

interface PaginatedResult {
  data: Review[];
  pagination?: { page: number; totalPages: number; total: number; hasNextPage: boolean; hasPrevPage: boolean };
}

export function useReviews(filter: ReviewFilter = {}) {
  const params = new URLSearchParams();
  if (filter.search) params.set("search", filter.search);
  if (filter.approved) params.set("approved", filter.approved);
  if (filter.targetType) params.set("targetType", filter.targetType);
  if (filter.page) params.set("page", String(filter.page));
  if (filter.limit) params.set("limit", String(filter.limit));
  const qs = params.toString();

  return useQuery({
    queryKey: ["reviews", filter],
    queryFn: async () => {
      const result = await get<PaginatedResult>(`/reviews${qs ? `?${qs}` : ""}`);
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

export function useModerateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      put(`/reviews/${id}`, { isApproved: status === "approved" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review updated");
    },
    onError: () => toast.error("Failed to update review"),
  });
}

export function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRequest(`/reviews/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review deleted");
    },
    onError: () => toast.error("Failed to delete review"),
  });
}
