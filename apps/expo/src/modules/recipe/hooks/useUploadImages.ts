import { useCallback, useState } from "react";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import pLimit from "p-limit";

import type { ImageToUpload } from "../types";
import { useImageCompressor } from "~/hooks/useImageCompressor";
import { supabase } from "~/utils/supabase";

interface UploadProgress {
  total: number;
  completed: number;
  failed: number;
  percentage: number;
}

export const useUploadImages = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress>({
    total: 0,
    completed: 0,
    failed: 0,
    percentage: 0,
  });

  const { compressImage } = useImageCompressor();

  const uploadSingleImage = useCallback(
    async (
      uri: string,
      bucket = "recipes-assets",
      folder = "images",
    ): Promise<string | null> => {
      try {
        // compress image before upload
        const compressedUri = await compressImage(uri, {
          width: 1280,
          quality: 0.85,
        });

        // 1. Convertir la URI a base64
        const base64 = await FileSystem.readAsStringAsync(compressedUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        // 2. Convertir base64 a ArrayBuffer
        const arrayBuffer = decode(base64);

        // generate a unique filename
        const filename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.jpg`;

        // upload to supabase storage
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(filename, arrayBuffer, {
            upsert: false,
            contentType: "image/jpeg",
          });

        if (error) {
          console.error("Supabase upload error:", error.message);
          return null;
        }

        // get public URL
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(data.path);

        return urlData.publicUrl;
      } catch (error) {
        console.error("Error uploading image:", error);
        return null;
      }
    },
    [compressImage],
  );

  const uploadMultipleImages = useCallback(
    async (
      images: ImageToUpload[],
      concurrency = 3,
    ): Promise<ImageToUpload[]> => {
      setIsUploading(true);
      setProgress({
        total: images.length,
        completed: 0,
        failed: 0,
        percentage: 0,
      });
      const limit = pLimit(concurrency);
      let completedCount = 0;
      let failedCount = 0;

      const uploadTasks = images.map((image) =>
        limit(async () => {
          try {
            const url = await uploadSingleImage(image.uri);

            if (url) {
              completedCount++;
              setProgress((prev) => ({
                ...prev,
                completed: completedCount,
                percentage: Math.round(
                  ((completedCount + failedCount) / images.length) * 100,
                ),
              }));
              return { ...image, uploadedUrl: url, isUploading: false };
            } else {
              throw new Error("Upload failed");
            }
          } catch (error) {
            failedCount++;
            setProgress((prev) => ({
              ...prev,
              failed: failedCount,
            }));
            return {
              ...image,
              error: (error as Error).message,
              isUploading: false,
            };
          }
        }),
      );

      const results = await Promise.allSettled(uploadTasks);
      const uploadedImages = results
        .filter((result) => result.status === "fulfilled")
        .map(
          (result) => (result as PromiseFulfilledResult<ImageToUpload>).value,
        );

      setIsUploading(false);
      return uploadedImages;
    },
    [uploadSingleImage],
  );

  return {
    isUploading,
    progress,
    uploadSingleImage,
    uploadMultipleImages,
  };
};
