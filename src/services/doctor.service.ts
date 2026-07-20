import { get, post, patch } from "@/lib/api";
import type { Doctor, DoctorFormData, DoctorFilter, DaySchedule } from "@/types";
import { API_ENDPOINTS } from "@/constants";

export const doctorService = {
  getAll: (filter?: DoctorFilter) => {
    const params = new URLSearchParams();
    if (filter?.specialty) params.set("specialty", filter.specialty);
    if (filter?.search) params.set("search", filter.search);
    if (filter?.minRating) params.set("minRating", String(filter.minRating));
    if (filter?.maxFee) params.set("maxFee", String(filter.maxFee));
    if (filter?.isVerified) params.set("verified", "true");
    if (filter?.sortBy) params.set("sortBy", filter.sortBy);
    if (filter?.sortOrder) params.set("sortOrder", filter.sortOrder);
    if (filter?.page) params.set("page", String(filter.page));
    if (filter?.limit) params.set("limit", String(filter.limit));
    const qs = params.toString();
    return get<{ data: Doctor[] }>(`${API_ENDPOINTS.DOCTORS}${qs ? `?${qs}` : ""}`);
  },

  getById: (id: string) =>
    get<Doctor>(`${API_ENDPOINTS.DOCTORS}/${id}`),

  create: (data: DoctorFormData) =>
    post<Doctor>(API_ENDPOINTS.DOCTORS, data),

  update: (id: string, data: Partial<DoctorFormData>) =>
    patch<Doctor>(`${API_ENDPOINTS.DOCTORS}/${id}`, data),

  getPatients: () =>
    get<{ data: { _id: string; name: string; email: string; image?: string }[] }>(API_ENDPOINTS.DOCTORS_PATIENTS),

  getSchedule: () =>
    get<{ data: DaySchedule[] }>(API_ENDPOINTS.DOCTORS_SCHEDULE),

  updateSchedule: (slots: Omit<DaySchedule, "_id">[]) =>
    post(API_ENDPOINTS.DOCTORS_SCHEDULE, { slots }),
};
