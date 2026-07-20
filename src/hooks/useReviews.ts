import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, patch, deleteRequest } from "@/lib/api";
import toast from "react-hot-toast";

interface Review {
  _id: string;
  userName: string;
  rating: number;
  comment: string;
  status: string;
  createdAt: string;
}

export function useReviews(status?: string) {
  return useQuery({
    queryKey: ["reviews", status],
    queryFn: async () => {
      const endpoint = status ? `/reviews?status=${status}` : "/reviews";
      const result = await get<{ data: Review[] }>(endpoint);
      return result.data ?? (Array.isArray(result) ? result : []);
    },
  });
}

export function useModerateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      patch(`/reviews/${id}`, { status }),
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
