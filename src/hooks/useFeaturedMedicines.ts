import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api";
import { featuredMedicines } from "@/components/home/data";
import type { LandingMedicine } from "@/components/home/data";

interface RawMedicine {
  _id: string;
  name: string;
  genericName: string;
  manufacturer: string;
  price: number;
  image?: string;
  category: string;
  isPrescriptionRequired: boolean;
}

function normalizeMedicine(raw: RawMedicine): LandingMedicine {
  return {
    id: raw._id,
    name: raw.name,
    genericName: raw.genericName,
    manufacturer: raw.manufacturer,
    price: raw.price,
    rating: 0,
    image: raw.image || "https://i.ibb.co/n610Bc4/paracetamol.jpg",
    category: raw.category,
    isPrescriptionRequired: raw.isPrescriptionRequired,
  };
}

export function useFeaturedMedicines() {
  return useQuery({
    queryKey: ["landing", "featured-medicines"],
    queryFn: async () => {
      try {
        const result = await get<RawMedicine[]>("/medicines/featured?limit=8");
        const raw = Array.isArray(result) ? result : [];
        return raw.length ? raw.map(normalizeMedicine) : featuredMedicines;
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
