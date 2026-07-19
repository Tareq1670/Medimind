import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api";
import { featuredMedicines } from "@/components/landing/data";
import type { LandingMedicine } from "@/components/landing/data";

export function useFeaturedMedicines() {
  return useQuery({
    queryKey: ["landing", "featured-medicines"],
    queryFn: async () => {
      try {
        const result = await get<LandingMedicine[]>("/medicines/featured?limit=8");
        return Array.isArray(result) ? result : featuredMedicines;
      } catch {
        return featuredMedicines;
      }
    },
    placeholderData: featuredMedicines,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
