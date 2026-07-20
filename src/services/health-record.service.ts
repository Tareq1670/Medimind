import { get, post, deleteRequest } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants";

export interface HealthRecord {
  _id: string;
  type: string;
  value: string;
  unit: string;
  date: string;
  notes?: string;
  createdAt: string;
}

export interface HealthRecordFormData {
  type: string;
  value: string;
  unit: string;
  date: string;
  notes?: string;
}

export const healthRecordService = {
  getAll: () =>
    get<{ data: HealthRecord[] }>(API_ENDPOINTS.HEALTH_RECORDS),

  create: (data: HealthRecordFormData) =>
    post<HealthRecord>(API_ENDPOINTS.HEALTH_RECORDS, data),

  delete: (id: string) =>
    deleteRequest(`${API_ENDPOINTS.HEALTH_RECORDS}/${id}`),
};
