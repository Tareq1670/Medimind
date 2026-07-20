import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api";
import { featuredDoctors } from "@/components/home/data";
import type { LandingDoctor } from "@/components/home/data";

interface RawDoctor {
  _id: string;
  user?: { name: string; avatar?: string };
  specialty: string;
  consultationFee: number;
  hospitalAffiliation: string;
  experienceYears: number;
  isVerified: boolean;
}

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

function normalizeDoctor(raw: RawDoctor): LandingDoctor {
  return {
    id: raw._id,
    name: raw.user?.name || "Unknown Doctor",
    specialty: raw.specialty,
    consultationFee: raw.consultationFee,
    rating: 0,
    image: raw.user?.avatar || "https://i.ibb.co/n610Bc4/paracetamol.jpg",
    hospitalAffiliation: raw.hospitalAffiliation,
    experienceYears: raw.experienceYears,
    isVerified: raw.isVerified,
  };
}

export function useDoctors() {
  return useQuery({
    queryKey: ["landing", "featured-doctors"],
    queryFn: async () => {
      try {
        const result = await get<PaginatedEnvelope<RawDoctor>>(
          "/doctors?limit=6&verified=true",
        );
        const raw = extractData<RawDoctor>(result, []);
        return raw.length ? raw.map(normalizeDoctor) : featuredDoctors;
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
