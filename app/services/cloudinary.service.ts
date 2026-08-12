import cloudinary from "@/lib/cloudinary";

type UploadResult = {
  url: string;
  publicId: string;
};

export async function uploadImage(
  file: File,
  folder: string
): Promise<UploadResult> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed"));
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

export async function deleteImage(
  publicId: string
): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}