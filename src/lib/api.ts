const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/v1`;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function get<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new ApiError(res.status, `API request failed: ${res.statusText}`);
  }

  const json = await res.json();

  if (!json.success) {
    throw new ApiError(500, json.message || "API returned unsuccessful response");
  }

  return json.data as T;
}
