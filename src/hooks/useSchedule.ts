import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post } from "@/lib/api";
import toast from "react-hot-toast";

interface ScheduleSlot {
  _id: string;
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export function useSchedule() {
  return useQuery({
    queryKey: ["schedule"],
    queryFn: async () => {
      const result = await get<ScheduleSlot[]>("/doctors/schedule");
      return Array.isArray(result) ? result : [];
    },
  });
}

export function useUpdateSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (slots: Omit<ScheduleSlot, "_id">[]) =>
      post("/doctors/schedule", { slots }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["schedule"] });
      toast.success("Schedule updated");
    },
    onError: () => toast.error("Failed to update schedule"),
  });
}
