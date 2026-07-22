const getApiBase = () => {
  // Server-side: use environment variable
  if (typeof window === "undefined") {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (baseUrl && typeof baseUrl === "string" && baseUrl.length > 0) {
      return `${baseUrl.replace(/\/+$/, "")}/api/v1`;
    }
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}/api/v1`;
    }
    return "http://localhost:5000/api/v1";
  }

  // Client-side: use environment variable or derive from window.location
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (baseUrl && typeof baseUrl === "string" && baseUrl.length > 0) {
    return `${baseUrl.replace(/\/+$/, "")}/api/v1`;
  }
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") {
    return "http://localhost:5000/api/v1";
  }
  const protocol = window.location.protocol;
  return `${protocol}//${window.location.host}/api/v1`;
};

export function extractPaginatedData<T>(raw: unknown): {
  data: T[];
  pagination?: { page: number; totalPages: number; total: number };
} {
  if (raw && typeof raw === "object") {
    const r = raw as Record<string, unknown>;
    if (Array.isArray(r.data)) {
      return {
        data: r.data as T[],
        pagination: r.pagination as { page: number; totalPages: number; total: number } | undefined,
      };
    }
  }
  if (Array.isArray(raw)) return { data: raw as T[] };
  return { data: [] };
}

export function extractArrayData<T>(raw: unknown, fallback: T[]): T[] {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object" && "data" in raw) {
    const maybe = (raw as Record<string, unknown>).data;
    if (Array.isArray(maybe)) return maybe as T[];
  }
  return fallback;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: { field: string; message: string }[],
  ) {
    super(message);
    this.name = "ApiError";
  }
}

let cachedToken: string | null = null;

export function clearTokenCache() {
  cachedToken = null;
}

export async function getJwtToken(): Promise<string | null> {
  if (cachedToken) return cachedToken;
  try {
    const res = await fetch("/api/auth/token", { credentials: "include" });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.token) {
      cachedToken = json.token;
      return cachedToken;
    }
  } catch {
    // not logged in or auth service unavailable
  }
  return null;
}

export async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = await getJwtToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${getApiBase()}${endpoint}`, {
    cache: "no-store",
    ...options,
    headers: {
      ...authHeaders,
      ...options.headers,
    },
  });

  if (!res.ok) {
    if (res.status === 401) clearTokenCache();
    let errorMsg = `API request failed: ${res.statusText}`;
    let details: { field: string; message: string }[] | undefined;
    try {
      const errBody = await res.json();
      errorMsg = errBody.message || errBody.error || errorMsg;
      details = errBody.details;
    } catch {
      // response is not JSON — use default message
    }
    throw new ApiError(res.status, errorMsg, details);
  }

  const json = await res.json();

  if (!json.success) {
    throw new ApiError(500, json.message || "API returned unsuccessful response");
  }

  return json.data as T;
}

export async function get<T>(endpoint: string): Promise<T> {
  return request<T>(endpoint, { method: "GET" });
}

export async function post<T>(endpoint: string, body?: unknown): Promise<T> {
  return request<T>(endpoint, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function put<T>(endpoint: string, body?: unknown): Promise<T> {
  return request<T>(endpoint, {
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function patch<T>(endpoint: string, body?: unknown): Promise<T> {
  return request<T>(endpoint, {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function deleteRequest<T>(endpoint: string): Promise<T> {
  return request<T>(endpoint, { method: "DELETE" });
}

export async function uploadFile<T>(endpoint: string, formData: FormData): Promise<T> {
  const token = await getJwtToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${getApiBase()}${endpoint}`, {
    method: "POST",
    headers,
    body: formData,
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 401) clearTokenCache();
    throw new ApiError(res.status, `Upload failed: ${res.statusText}`);
  }

  const json = await res.json();

  if (!json.success) {
    throw new ApiError(500, json.message || "Upload failed");
  }

  return json.data as T;
}
