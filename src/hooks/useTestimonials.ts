import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api";
import { testimonials } from "@/components/home/data";
import type { LandingTestimonial } from "@/components/home/data";

interface PopulatedReviewer {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  image?: string;
}

interface ReviewFromApi {
  _id: string;
  reviewerId: PopulatedReviewer | string;
  targetId: string;
  targetType: "Doctor" | "Medicine";
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

function normalizeReview(raw: ReviewFromApi): LandingTestimonial {
  const reviewer =
    typeof raw.reviewerId === "object" && raw.reviewerId !== null
      ? raw.reviewerId
      : { name: "Anonymous" as const };
  return {
    id: raw._id,
    name: reviewer.name,
    rating: raw.rating,
    text: raw.comment,
    date: raw.createdAt.split("T")[0],
    condition: raw.targetType === "Doctor" ? "Consultation" : "Medication",
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

export function useTestimonials() {
  return useQuery({
    queryKey: ["landing", "testimonials"],
    queryFn: async () => {
      try {
        const result = await get<unknown>("/reviews?limit=4&approved=true");
        const raw = extractData<ReviewFromApi>(result, []);
        return raw.length ? raw.map(normalizeReview) : testimonials;
      } catch {
        return testimonials;
      }
    },
    placeholderData: testimonials,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
