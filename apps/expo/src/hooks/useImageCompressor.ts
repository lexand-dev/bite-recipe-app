import * as ImageManipulator from "expo-image-manipulator";

interface CompressOptions {
  width?: number;
  height?: number;
  quality?: number; // 0 to 1
  format?: ImageManipulator.SaveFormat;
}

export const useImageCompressor = () => {
  const compressImage = async (
    uri: string,
    options: CompressOptions = {},
  ): Promise<string> => {
    const {
      width = 1024,
      height = 1024,
      quality = 0.8,
      format = ImageManipulator.SaveFormat.JPEG,
    } = options;

    try {
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width, height } }],
        { compress: quality, format },
      );

      return result.uri;
    } catch (error) {
      console.error("Error compressing image:", error);
      throw error;
    }
  };

  const compressMultipleImages = async (
    uris: string[],
    options?: CompressOptions,
  ): Promise<string[]> => {
    return Promise.all(uris.map((uri) => compressImage(uri, options)));
  };

  return { compressImage, compressMultipleImages };
};
