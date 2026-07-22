"use client";

import {
  useSearchParams,
  useRouter,
  usePathname,
} from "next/navigation";
import { useCallback, useRef, useEffect, useMemo } from "react";

type FilterValue = string | number | boolean | undefined;

export interface URLFilterConfig {
  debounce?: number | { ms: number };
}

export type FilterSchema = Record<string, URLFilterConfig>;

export interface UseURLFiltersReturn<T extends FilterSchema> {
  filters: { [K in keyof T]: string };
  page: number;
  set: (key: keyof T, value: FilterValue) => void;
  setMany: (updates: Partial<Record<keyof T, FilterValue>>, opts?: { resetPage?: boolean }) => void;
  setPage: (page: number) => void;
  resetAll: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
}

const PAGE_KEY = "page";
const DEFAULT_PAGE = 1;

function getDebounceMs(config: URLFilterConfig): number | null {
  if (!config.debounce) return null;
  if (typeof config.debounce === "number") return config.debounce;
  return config.debounce.ms;
}

export function useURLFilters<T extends FilterSchema>(schema: T): UseURLFiltersReturn<T> {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const pendingRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      for (const t of timers.values()) clearTimeout(t);
      timers.clear();
    };
  }, []);

  const readFilters = useCallback((): { [K in keyof T]: string } => {
    const result = {} as { [K in keyof T]: string };
    for (const key of Object.keys(schema) as (keyof T)[]) {
      result[key] = searchParams.get(String(key)) ?? "";
    }
    return result;
  }, [searchParams, schema]);

  const pushURL = useCallback(
    (params: URLSearchParams, scroll = false) => {
      const qs = params.toString();
      router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll });
    },
    [router, pathname]
  );

  const replaceURL = useCallback(
    (params: URLSearchParams) => {
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router, pathname]
  );

  const buildParams = useCallback(
    (overrides?: Partial<Record<keyof T, FilterValue>>): URLSearchParams => {
      const params = new URLSearchParams(searchParams.toString());

      for (const key of Object.keys(schema) as (keyof T)[]) {
        const value = overrides?.[key] !== undefined ? overrides[key] : (searchParams.get(String(key)) ?? undefined);
        if (value === undefined || value === "" || value === false) {
          params.delete(String(key));
        } else {
          params.set(String(key), String(value));
        }
      }

      return params;
    },
    [searchParams, schema]
  );

  const set = useCallback(
    (key: keyof T, value: FilterValue) => {
      const debounceMs = getDebounceMs(schema[key]);

      if (debounceMs !== null) {
        const fieldKey = String(key);
        const existing = timersRef.current.get(fieldKey);
        if (existing) clearTimeout(existing);

        if (value === undefined || value === "" || value === false) {
          pendingRef.current.delete(fieldKey);
          const params = buildParams();
          params.delete(fieldKey);
          params.delete(PAGE_KEY);
          replaceURL(params);
          return;
        }

        pendingRef.current.set(fieldKey, String(value));
        timersRef.current.set(
          fieldKey,
          setTimeout(() => {
            timersRef.current.delete(fieldKey);
            pendingRef.current.delete(fieldKey);
            const params = buildParams({ [key]: value } as Partial<Record<keyof T, FilterValue>>);
            params.delete(PAGE_KEY);
            replaceURL(params);
          }, debounceMs)
        );
        return;
      }

      const params = buildParams({ [key]: value } as Partial<Record<keyof T, FilterValue>>);
      params.delete(PAGE_KEY);
      replaceURL(params);
    },
    [schema, buildParams, replaceURL]
  );

  const setMany = useCallback(
    (updates: Partial<Record<keyof T, FilterValue>>, opts?: { resetPage?: boolean }) => {
      for (const [field, value] of Object.entries(updates) as [keyof T, FilterValue][]) {
        const debounceMs = getDebounceMs(schema[field]);
        if (debounceMs !== null) {
          const fieldKey = String(field);
          const existing = timersRef.current.get(fieldKey);
          if (existing) clearTimeout(existing);
          if (value === undefined || value === "" || value === false) {
            pendingRef.current.delete(fieldKey);
          } else {
            pendingRef.current.set(fieldKey, String(value));
            timersRef.current.set(
              fieldKey,
              setTimeout(() => {
                timersRef.current.delete(fieldKey);
                pendingRef.current.delete(fieldKey);
                const params = buildParams({ [field]: value } as Partial<Record<keyof T, FilterValue>>);
                params.delete(PAGE_KEY);
                replaceURL(params);
              }, debounceMs)
            );
          }
        }
      }

      const nonDebounceUpdates: Partial<Record<keyof T, FilterValue>> = {};
      for (const [field, value] of Object.entries(updates) as [keyof T, FilterValue][]) {
        if (getDebounceMs(schema[field]) === null) {
          nonDebounceUpdates[field] = value;
        }
      }

      if (Object.keys(nonDebounceUpdates).length > 0) {
        const params = buildParams(nonDebounceUpdates as Partial<Record<keyof T, FilterValue>>);
        if (opts?.resetPage !== false) params.delete(PAGE_KEY);
        replaceURL(params);
      }
    },
    [schema, buildParams, replaceURL]
  );

  const setPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (page <= DEFAULT_PAGE) {
        params.delete(PAGE_KEY);
      } else {
        params.set(PAGE_KEY, String(page));
      }
      pushURL(params, false);
    },
    [searchParams, pushURL]
  );

  const resetAll = useCallback(() => {
    for (const t of timersRef.current.values()) clearTimeout(t);
    timersRef.current.clear();
    pendingRef.current.clear();
    replaceURL(new URLSearchParams());
  }, [replaceURL]);

  const page = useMemo(() => {
    const val = searchParams.get(PAGE_KEY);
    if (!val) return DEFAULT_PAGE;
    const n = parseInt(val, 10);
    return isNaN(n) || n < 1 ? DEFAULT_PAGE : n;
  }, [searchParams]);

  const filters = useMemo(() => readFilters(), [readFilters]);

  const hasActiveFilters = useMemo(() => {
    for (const key of Object.keys(schema) as (keyof T)[]) {
      if (searchParams.get(String(key))) return true;
    }
    return false;
  }, [searchParams, schema]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    for (const key of Object.keys(schema) as (keyof T)[]) {
      if (searchParams.get(String(key))) count++;
    }
    return count;
  }, [searchParams, schema]);

  return useMemo(
    () => ({ filters, page, set, setMany, setPage, resetAll, hasActiveFilters, activeFilterCount }),
    [filters, page, set, setMany, setPage, resetAll, hasActiveFilters, activeFilterCount]
  );
}
