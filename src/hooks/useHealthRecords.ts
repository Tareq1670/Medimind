import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, put, deleteRequest } from "@/lib/api";
import toast from "react-hot-toast";

interface CurrentMedication {
  name: string;
  dosage: string;
  frequency: string;
  startDate?: string;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface HealthRecord {
  _id: string;
  patientId: string;
  chronicConditions: string[];
  allergies: string[];
  currentMedications: CurrentMedication[];
  emergencyContact?: EmergencyContact;
  createdAt: string;
  updatedAt: string;
}

export function useHealthRecords() {
  return useQuery({
    queryKey: ["health-records"],
    queryFn: async () => {
      const result = await get<HealthRecord>("/health-records");
      return result;
    },
  });
}

export function useCreateHealthRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      chronicConditions?: string[];
      allergies?: string[];
      currentMedications?: CurrentMedication[];
      emergencyContact?: EmergencyContact;
    }) => post("/health-records", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["health-records"] });
      toast.success("Health record created");
    },
    onError: () => toast.error("Failed to create health record"),
  });
}

export function useUpdateHealthRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      chronicConditions?: string[];
      allergies?: string[];
      currentMedications?: CurrentMedication[];
      emergencyContact?: EmergencyContact;
    }) => put("/health-records", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["health-records"] });
      toast.success("Health record updated");
    },
    onError: () => toast.error("Failed to update health record"),
  });
}

export function useDeleteHealthRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => deleteRequest("/health-records"),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["health-records"] });
      toast.success("Health record deleted");
    },
    onError: () => toast.error("Failed to delete health record"),
  });
}
