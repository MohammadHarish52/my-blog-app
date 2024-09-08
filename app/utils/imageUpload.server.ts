import { cloudinary } from "./cloudinary.server";

export async function uploadImage(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise<string>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: "auto" }, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result!.secure_url);
      })
      .end(buffer);
  });
}
