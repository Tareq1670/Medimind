import { authClient } from "./auth-client";

async function getAuthToken(): Promise<string> {
  const { data, error } = await authClient.token();
  if (error || !data?.token) {
    throw new Error(error?.message ?? "Authentication required to upload images");
  }
  return data.token;
}

export const imageUploader = async (image: File) => {
  const token = await getAuthToken();

  const formData = new FormData();
  formData.append("image", image);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/upload/image`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    },
  );
  const result = await res.json();
  if (!result.success) {
    throw new Error(result.message || "Image upload failed");
  }
  return { url: result.data.url, ...result.data };
};
