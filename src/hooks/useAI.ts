import { useMutation, useQuery } from "@tanstack/react-query";
import { post } from "@/lib/api";
import toast from "react-hot-toast";

export interface GenerateBlogResult {
  title: string;
  metaDescription: string;
  tags: string[];
  readTime: number;
  content: string;
  keyTakeaways: string[];
}

export interface ClassifyTagsResult {
  tags: string[];
  category: string;
}

export interface MedicineRecommendationResult {
  recommendations: { name: string; type: string; reason: string; priority: string }[];
  itemsToAvoid: { name: string; reason: string }[];
  lifestyleTips: string[];
  monitoringSuggestions: string[];
  disclaimer: string;
}

export function useAiGenerateBlog() {
  return useMutation({
    mutationFn: (data: {
      topic: string;
      audience?: string;
      tone?: string;
      length?: string;
      keyPoints?: string[];
      includeSections?: string[];
    }) => post<GenerateBlogResult>("/ai/generate-blog", data),
    onError: () => toast.error("Failed to generate blog content"),
  });
}

export function useAiClassifyTags() {
  return useMutation({
    mutationFn: (data: { title: string; description: string }) =>
      post<ClassifyTagsResult>("/ai/classify-tags", data),
    onError: () => toast.error("Failed to classify tags"),
  });
}

export function useAiMedicineRecommendation() {
  return useMutation({
    mutationFn: (data: {
      symptoms?: string[];
      conditions?: string[];
      healthGoals?: string[];
    }) => post<MedicineRecommendationResult>("/ai/medicine-recommendation", data),
    onError: () => toast.error("Failed to generate recommendations"),
  });
}

export interface HealthInsightsResult {
  keyTrends: { metric: string; direction: string; insight: string }[];
  notableChanges: string[];
  personalizedRecommendations: string[];
  areasNeedingAttention: string[];
  positiveProgress: string[];
  overallAssessment: string;
}

export function useHealthInsights() {
  return useMutation({
    mutationFn: () => post<HealthInsightsResult>("/ai/health-insights", {}),
    onError: () => toast.error("Failed to generate health insights"),
  });
}

export function useHealthInsightsQuery(enabled: boolean) {
  return useQuery({
    queryKey: ["health-insights"],
    queryFn: () => post<HealthInsightsResult>("/ai/health-insights", {}),
    enabled,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAiRecommendations() {
  return useMutation({
    mutationFn: (data: {
      symptoms?: string[];
      conditions?: string[];
      healthGoals?: string[];
    }) => post<MedicineRecommendationResult>("/ai/medicine-recommendation", data),
    onError: () => toast.error("Failed to generate recommendations"),
  });
}
