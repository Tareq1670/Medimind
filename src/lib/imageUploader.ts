import { getAuthHeaders } from "./api";

export const imageUploader = async (image: File) => {
  const formData = new FormData();
  formData.append("image", image);
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const authHeaders = await getAuthHeaders();
  const headersWithoutCT: Record<string, string> = {};
  for (const [key, value] of Object.entries(authHeaders)) {
    if (key !== "Content-Type") headersWithoutCT[key] = value;
  }
  const res = await fetch(`${apiBase}/api/v1/upload/image`, {
    method: "POST",
    headers: headersWithoutCT,
    body: formData,
  });
  const result = await res.json();
  if (!result.success) {
    throw new Error(result.message || "Image upload failed");
  }
  return { url: result.data.url, ...result.data };
};
