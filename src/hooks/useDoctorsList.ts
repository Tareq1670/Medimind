import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, patch, deleteRequest } from "@/lib/api";
import toast from "react-hot-toast";
import type { Doctor, DoctorFilter, PaginatedResponse, DoctorFormData } from "@/types";

interface RawDoctor {
  _id: string;
  userId?: string;
  specialty: string;
  experienceYears: number;
  hospitalAffiliation: string;
  bio?: string;
  consultationFee: number;
  availabilitySlots?: { day: string; startTime: string; endTime: string; isAvailable: boolean }[];
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  user?: { name: string; email: string; avatar?: string };
}

function normalizeDoctor(raw: RawDoctor): Doctor {
  return {
    _id: raw._id,
    name: raw.user?.name || "Unknown Doctor",
    email: raw.user?.email || "",
    specialty: raw.specialty,
    consultationFee: raw.consultationFee,
    rating: 0,
    reviewCount: 0,
    image: raw.user?.avatar,
    hospitalAffiliation: raw.hospitalAffiliation,
    experienceYears: raw.experienceYears,
    education: undefined,
    bio: raw.bio,
    isVerified: raw.isVerified,
    availability: (raw.availabilitySlots || []).map((s) => ({
      day: s.day,
      startTime: s.startTime,
      endTime: s.endTime,
      isAvailable: s.isAvailable,
    })),
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

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

export function useDoctorsList(filter: DoctorFilter = {}) {
  const params = new URLSearchParams();
  if (filter.specialty) params.set("specialty", filter.specialty);
  if (filter.search) params.set("search", filter.search);
  if (filter.minRating) params.set("minRating", String(filter.minRating));
  if (filter.maxFee) params.set("maxFee", String(filter.maxFee));
  if (filter.isVerified) params.set("verified", "true");
  if (filter.page) params.set("page", String(filter.page));
  if (filter.limit) params.set("limit", String(filter.limit));
  const qs = params.toString();

  return useQuery({
    queryKey: ["doctors-list", filter],
    queryFn: async () => {
      const result = await get<PaginatedResponse<RawDoctor>>(`/doctors${qs ? `?${qs}` : ""}`);
      const extracted = extractPaginatedData<RawDoctor>(result);
      return {
        data: extracted.data.map(normalizeDoctor),
        pagination: extracted.pagination,
      };
    },
    staleTime: 1000 * 60 * 3,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useDoctor(id: string) {
  return useQuery({
    queryKey: ["doctor", id],
    queryFn: async () => {
      const raw = await get<RawDoctor>(`/doctors/${id}`);
      return normalizeDoctor(raw);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

export function useCreateDoctor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: DoctorFormData) => post("/doctors", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["doctors-list"] });
      toast.success("Doctor created");
    },
    onError: () => toast.error("Failed to create doctor"),
  });
}

export function useUpdateDoctor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DoctorFormData> }) =>
      patch(`/doctors/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["doctors-list"] });
      toast.success("Doctor updated");
    },
    onError: () => toast.error("Failed to update doctor"),
  });
}

export function useDeleteDoctor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRequest(`/doctors/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["doctors-list"] });
      toast.success("Doctor deleted");
    },
    onError: () => toast.error("Failed to delete doctor"),
  });
}

export function useVerifyDoctor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isVerified }: { id: string; isVerified: boolean }) =>
      patch(`/doctors/${id}`, { isVerified }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["doctors-list"] });
      qc.invalidateQueries({ queryKey: ["all-doctors"] });
      toast.success("Doctor verification updated");
    },
    onError: () => toast.error("Failed to update verification"),
  });
}

export function useAllDoctors(filter: DoctorFilter = {}) {
  const params = new URLSearchParams();
  if (filter.specialty) params.set("specialty", filter.specialty);
  if (filter.search) params.set("search", filter.search);
  if (filter.page) params.set("page", String(filter.page));
  if (filter.limit) params.set("limit", String(filter.limit));
  const qs = params.toString();

  return useQuery({
    queryKey: ["all-doctors", filter],
    queryFn: async () => {
      const result = await get<PaginatedResponse<RawDoctor>>(`/doctors${qs ? `?${qs}` : ""}`);
      const extracted = extractPaginatedData<RawDoctor>(result);
      return {
        data: extracted.data.map(normalizeDoctor),
        pagination: extracted.pagination,
      };
    },
    staleTime: 1000 * 60 * 3,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
