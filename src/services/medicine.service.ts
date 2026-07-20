import { get, post, patch, deleteRequest } from "@/lib/api";
import type { Medicine, MedicineFormData, MedicineFilter } from "@/types";
import { API_ENDPOINTS } from "@/constants";

export const medicineService = {
  getAll: (filter?: MedicineFilter) => {
    const params = new URLSearchParams();
    if (filter?.category) params.set("category", filter.category);
    if (filter?.search) params.set("search", filter.search);
    if (filter?.minPrice) params.set("minPrice", String(filter.minPrice));
    if (filter?.maxPrice) params.set("maxPrice", String(filter.maxPrice));
    if (filter?.sortBy) params.set("sortBy", filter.sortBy);
    if (filter?.sortOrder) params.set("sortOrder", filter.sortOrder);
    if (filter?.page) params.set("page", String(filter.page));
    if (filter?.limit) params.set("limit", String(filter.limit));
    const qs = params.toString();
    return get<{ data: Medicine[] }>(`${API_ENDPOINTS.MEDICINES}${qs ? `?${qs}` : ""}`);
  },

  getFeatured: (limit = 8) =>
    get<Medicine[]>(`${API_ENDPOINTS.MEDICINES_FEATURED}?limit=${limit}`),

  getById: (id: string) =>
    get<Medicine>(`${API_ENDPOINTS.MEDICINES}/${id}`),

  create: (data: MedicineFormData) =>
    post<Medicine>(API_ENDPOINTS.MEDICINES, data),

  update: (id: string, data: Partial<MedicineFormData>) =>
    patch<Medicine>(`${API_ENDPOINTS.MEDICINES}/${id}`, data),

  delete: (id: string) =>
    deleteRequest(`${API_ENDPOINTS.MEDICINES}/${id}`),

  getCategories: () =>
    get<{ data: { id: string; name: string }[] }>(`${API_ENDPOINTS.MEDICINES}/categories`),
};
