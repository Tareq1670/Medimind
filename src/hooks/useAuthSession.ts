"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { useCallback, useEffect } from "react";

export const SESSION_KEY = ["auth", "session"] as const;

export function useAuthSession() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: SESSION_KEY,
    queryFn: async ({ signal }) => {
      const { data, error } = await authClient.getSession({
        fetchOptions: { signal },
      });
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const invalidateSession = useCallback(() => {
    return queryClient.invalidateQueries({ queryKey: SESSION_KEY });
  }, [queryClient]);

  useEffect(() => {
    const sessionAtom = (authClient.$store as Record<string, unknown>).atoms as {
      subscribe: (cb: () => void) => () => void;
      get: () => { data: unknown };
    };
    let first = true;
    const unsub = sessionAtom.subscribe(() => {
      if (first) { first = false; return; }
      invalidateSession();
    });
    return unsub;
  }, [invalidateSession]);

  return {
    session: query.data,
    user: query.data?.user ?? null,
    isPending: query.isPending,
    isLoading: query.isLoading,
    isAuthenticated: !!query.data,
    isStale: query.isStale,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    invalidateSession,
  };
}
