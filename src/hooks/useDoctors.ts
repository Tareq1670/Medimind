import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api";
import { featuredDoctors } from "@/components/landing/data";
import type { LandingDoctor } from "@/components/landing/data";

interface PaginatedEnvelope<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
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

export function useDoctors() {
  return useQuery({
    queryKey: ["landing", "featured-doctors"],
    queryFn: async () => {
      try {
        const result = await get<PaginatedEnvelope<LandingDoctor>>(
          "/doctors?limit=6&verified=true",
        );
        return extractData<LandingDoctor>(result, featuredDoctors);
      } catch {
        return featuredDoctors;
      }
    },
    placeholderData: featuredDoctors,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
