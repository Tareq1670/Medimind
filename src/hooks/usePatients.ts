import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api";

interface Patient {
  _id: string;
  name: string;
  email: string;
  image?: string;
  dob?: string;
  bloodGroup?: string;
  lastVisit?: string;
}

export function usePatients() {
  return useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const result = await get<Patient[]>("/doctors/patients");
      return Array.isArray(result) ? result : [];
    },
  });
}
