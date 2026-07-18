export const imageUploader = async (image: File) => {
  const formData = new FormData();
  formData.append("image", image);
  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
    {
      method: "POST",
      body: formData,
    },
  );
  const result = await res.json();
  return result.data;
};
