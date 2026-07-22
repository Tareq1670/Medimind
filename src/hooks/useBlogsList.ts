import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, patch, deleteRequest, extractPaginatedData } from "@/lib/api";
import toast from "react-hot-toast";
import type { Blog, BlogFilter, PaginatedResponse, LandingBlog, BlogFormData } from "@/types";

function getAuthorInfo(raw: Blog): { name: string; image: string } {
  if (raw.author && typeof raw.author === "object") {
    return {
      name: (raw.author as { name: string }).name || "Unknown",
      image: (raw.author as { image?: string; avatar?: string }).image ||
             (raw.author as { avatar?: string }).avatar || "https://i.ibb.co/n610Bc4/paracetamol.jpg",
    };
  }
  if (typeof raw.authorId === "object" && raw.authorId !== null) {
    const a = raw.authorId as { name: string; image?: string; avatar?: string };
    return {
      name: a.name || "Unknown",
      image: a.image || a.avatar || "https://i.ibb.co/n610Bc4/paracetamol.jpg",
    };
  }
  return { name: "Unknown", image: "https://i.ibb.co/n610Bc4/paracetamol.jpg" };
}

function normalizeBlog(raw: Blog): LandingBlog {
  const author = getAuthorInfo(raw);
  return {
    id: raw._id,
    slug: raw.slug || raw._id,
    title: raw.title,
    excerpt: raw.excerpt || raw.content?.slice(0, 160) || "",
    tags: raw.tags,
    authorName: author.name,
    authorImage: author.image,
    date: raw.createdAt.split("T")[0],
    coverImage: raw.coverImage || "https://i.ibb.co/n610Bc4/paracetamol.jpg",
  };
}

export function useBlogsList(filter: BlogFilter = {}) {
  const params = new URLSearchParams();
  if (filter.status) params.set("status", filter.status);
  if (filter.tag) params.set("tag", filter.tag);
  if (filter.search) params.set("search", filter.search);
  if (filter.authorId) params.set("authorId", filter.authorId);
  if (filter.page) params.set("page", String(filter.page));
  if (filter.limit) params.set("limit", String(filter.limit));
  const qs = params.toString();

  return useQuery({
    queryKey: ["blogs-list", filter],
    queryFn: async () => {
      const result = await get<PaginatedResponse<Blog>>(`/blogs${qs ? `?${qs}` : ""}`);
      const extracted = extractPaginatedData<Blog>(result);
      return {
        data: extracted.data.map(normalizeBlog),
        pagination: extracted.pagination,
      };
    },
    staleTime: 1000 * 60 * 3,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useBlog(id: string) {
  return useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const raw = await get<Blog>(`/blogs/${id}`);
      return normalizeBlog(raw);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

export function useBlogDetail(slugOrId: string) {
  return useQuery({
    queryKey: ["blog-detail", slugOrId],
    queryFn: async () => {
      try {
        return await get<Blog>(`/blogs/slug/${slugOrId}`);
      } catch {
        return get<Blog>(`/blogs/${slugOrId}`);
      }
    },
    enabled: !!slugOrId,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

export function useCreateBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: BlogFormData) => post("/blogs", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blogs-list"] });
      toast.success("Blog created");
    },
    onError: () => toast.error("Failed to create blog"),
  });
}

export function useUpdateBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BlogFormData> }) =>
      patch(`/blogs/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blogs-list"] });
      toast.success("Blog updated");
    },
    onError: () => toast.error("Failed to update blog"),
  });
}

export function useDeleteBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRequest(`/blogs/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blogs-list"] });
      toast.success("Blog deleted");
    },
    onError: () => toast.error("Failed to delete blog"),
  });
}

export function useBlogsManage(filter: BlogFilter = {}) {
  const params = new URLSearchParams();
  if (filter.status) params.set("status", filter.status);
  if (filter.search) params.set("search", filter.search);
  if (filter.page) params.set("page", String(filter.page));
  if (filter.limit) params.set("limit", String(filter.limit));
  const qs = params.toString();

  return useQuery({
    queryKey: ["blogs-manage", filter],
    queryFn: async () => {
      const result = await get<PaginatedResponse<Blog>>(`/blogs${qs ? `?${qs}` : ""}`);
      const extracted = extractPaginatedData<Blog>(result);
      return {
        data: extracted.data,
        pagination: extracted.pagination,
      };
    },
    staleTime: 1000 * 60 * 3,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
