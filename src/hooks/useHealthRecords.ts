import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, deleteRequest } from "@/lib/api";
import toast from "react-hot-toast";

interface HealthRecord {
  _id: string;
  type: string;
  value: string;
  unit: string;
  date: string;
  notes?: string;
  createdAt: string;
}

export function useHealthRecords() {
  return useQuery({
    queryKey: ["health-records"],
    queryFn: async () => {
      const result = await get<{ data: HealthRecord[] }>("/health-records");
      return result.data ?? (Array.isArray(result) ? result : []);
    },
  });
}

export function useAddHealthRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { type: string; value: string; unit: string; date: string; notes?: string }) =>
      post("/health-records", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["health-records"] });
      toast.success("Health record added");
    },
    onError: () => toast.error("Failed to add health record"),
  });
}

export function useDeleteHealthRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRequest(`/health-records/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["health-records"] });
      toast.success("Record deleted");
    },
    onError: () => toast.error("Failed to delete record"),
  });
}
