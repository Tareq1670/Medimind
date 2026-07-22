import { get, post, patch, deleteRequest } from "@/lib/api";
import type { Blog, BlogFormData, BlogFilter, LandingBlog } from "@/types";
import { API_ENDPOINTS } from "@/constants";

function normalizeBlog(raw: Blog): LandingBlog {
  const author = typeof raw.authorId === "object" && raw.authorId !== null
    ? raw.authorId
    : { name: "Unknown", image: "https://i.ibb.co/n610Bc4/paracetamol.jpg" };
  return {
    id: raw._id,
    slug: raw.slug || raw._id,
    title: raw.title,
    excerpt: raw.excerpt || raw.content?.slice(0, 160) || "",
    tags: raw.tags,
    authorName: author.name,
    authorImage: (author as Record<string, string | undefined>).image || (author as Record<string, string | undefined>).avatar || "https://i.ibb.co/n610Bc4/paracetamol.jpg",
    date: raw.createdAt.split("T")[0],
    coverImage: raw.coverImage || "https://i.ibb.co/n610Bc4/paracetamol.jpg",
  };
}

export const blogService = {
  getAll: (filter?: BlogFilter) => {
    const params = new URLSearchParams();
    if (filter?.status) params.set("status", filter.status);
    if (filter?.tag) params.set("tag", filter.tag);
    if (filter?.search) params.set("search", filter.search);
    if (filter?.authorId) params.set("authorId", filter.authorId);
    if (filter?.page) params.set("page", String(filter.page));
    if (filter?.limit) params.set("limit", String(filter.limit));
    const qs = params.toString();
    return get<{ data: Blog[] }>(`${API_ENDPOINTS.BLOGS}${qs ? `?${qs}` : ""}`);
  },

  getById: (id: string) =>
    get<Blog>(`${API_ENDPOINTS.BLOGS}/${id}`),

  getLatest: async (limit = 3) => {
    const result = await get<Blog[] | { data: Blog[] }>(`${API_ENDPOINTS.BLOGS}?limit=${limit}&status=Published`);
    const raw = Array.isArray(result) ? result : (result as { data: Blog[] }).data;
    return raw.map(normalizeBlog);
  },

  getLandingBlogs: async () => {
    const { latestBlogs } = await import("@/components/home/data");
    try {
      return await blogService.getLatest(3);
    } catch {
      return latestBlogs;
    }
  },

  create: (data: BlogFormData) =>
    post<Blog>(API_ENDPOINTS.BLOGS, data),

  update: (id: string, data: Partial<BlogFormData>) =>
    patch<Blog>(`${API_ENDPOINTS.BLOGS}/${id}`, data),

  delete: (id: string) =>
    deleteRequest(`${API_ENDPOINTS.BLOGS}/${id}`),
};
