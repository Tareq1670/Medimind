import { get, post, patch, deleteRequest } from "@/lib/api";
import type { Condition, ConditionFormData, ConditionFilter } from "@/types";
import { API_ENDPOINTS } from "@/constants";

export const conditionService = {
  getAll: (filter?: ConditionFilter) => {
    const params = new URLSearchParams();
    if (filter?.search) params.set("search", filter.search);
    if (filter?.severity) params.set("severity", filter.severity);
    if (filter?.page) params.set("page", String(filter.page));
    if (filter?.limit) params.set("limit", String(filter.limit));
    const qs = params.toString();
    return get<{ data: Condition[] }>(`${API_ENDPOINTS.CONDITIONS}${qs ? `?${qs}` : ""}`);
  },

  getById: (id: string) =>
    get<Condition>(`${API_ENDPOINTS.CONDITIONS}/${id}`),

  create: (data: ConditionFormData) =>
    post<Condition>(API_ENDPOINTS.CONDITIONS, data),

  update: (id: string, data: Partial<ConditionFormData>) =>
    patch<Condition>(`${API_ENDPOINTS.CONDITIONS}/${id}`, data),

  delete: (id: string) =>
    deleteRequest(`${API_ENDPOINTS.CONDITIONS}/${id}`),
};
