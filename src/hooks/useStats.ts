import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api";

interface DashboardStats {
  user?: {
    healthScore: number;
    recordCount: number;
    recentActivity: { label: string; value: string; date: string }[];
    vitalsTrend: { date: string; value: number }[];
  };
  doctor?: {
    patientCount: number;
    appointmentCount: number;
    reviewCount: number;
    earnings: number;
  };
  admin?: {
    totalUsers: number;
    totalDoctors: number;
    totalPatients: number;
    totalMedicines: number;
    totalReviews: number;
    userGrowth: { date: string; count: number }[];
    contentGrowth: { date: string; medicines: number; blogs: number }[];
    aiUsage: { date: string; count: number }[];
    systemHealth: { mongodb: boolean; api: boolean; ai: boolean };
  };
}

export function useStats(role: string) {
  return useQuery({
    queryKey: ["stats", "dashboard", role],
    queryFn: async () => {
      const result = await get<DashboardStats>(`/stats/dashboard?role=${role}`);
      return result;
    },
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
}

export function useAnalytics() {
  return useQuery({
    queryKey: ["stats", "analytics"],
    queryFn: async () => {
      const result = await get<DashboardStats["admin"]>("/stats/analytics");
      return result;
    },
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
}
