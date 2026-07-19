export const imageUploader = async (image: File) => {
  const formData = new FormData();
  formData.append("image", image);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/upload/image`,
    {
      method: "POST",
      body: formData,
    },
  );
  const result = await res.json();
  if (!result.success) {
    throw new Error(result.message || "Image upload failed");
  }
  return { url: result.data.url, ...result.data };
};
