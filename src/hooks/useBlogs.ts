import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api";
import { latestBlogs } from "@/components/home/data";
import type { LandingBlog } from "@/components/home/data";

interface PopulatedUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  image?: string;
  [key: string]: unknown;
}

interface BlogFromApi {
  _id: string;
  title: string;
  content?: string;
  excerpt?: string;
  tags: string[];
  coverImage?: string;
  authorId: PopulatedUser | string;
  status: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

function normalizeBlog(raw: BlogFromApi): LandingBlog {
  const author =
    typeof raw.authorId === "object" && raw.authorId !== null
      ? raw.authorId
      : ({ name: "Unknown", image: "https://i.ibb.co/n610Bc4/paracetamol.jpg" } as PopulatedUser);
  return {
    id: raw._id,
    title: raw.title,
    excerpt: raw.excerpt || raw.content?.slice(0, 160) || "",
    tags: raw.tags,
    authorName: author.name,
    authorImage: author.image || author.avatar || "https://i.ibb.co/n610Bc4/paracetamol.jpg",
    date: raw.createdAt.split("T")[0],
    coverImage:
      raw.coverImage || "https://i.ibb.co/n610Bc4/paracetamol.jpg",
  };
}

function extractData<T>(raw: unknown, fallback: T[]): T[] {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object" && "data" in raw) {
    const maybe = (raw as Record<string, unknown>).data;
    if (Array.isArray(maybe)) return maybe as T[];
  }
  return fallback;
}

export function useBlogs() {
  return useQuery({
    queryKey: ["landing", "latest-blogs"],
    queryFn: async () => {
      try {
        const result = await get<unknown>("/blogs?limit=3&status=Published");
        const raw = extractData<BlogFromApi>(result, []);
        return raw.length ? raw.map(normalizeBlog) : latestBlogs;
      } catch {
        return latestBlogs;
      }
    },
    placeholderData: latestBlogs,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
