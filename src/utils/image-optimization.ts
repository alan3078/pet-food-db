import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  fileType?: string;
}

/**
 * Compresses an image file using browser-image-compression
 * @param file The original File object
 * @param options Custom compression options (optional)
 * @returns Promise<File> The compressed File object
 */
export const compressImage = async (
  file: File, 
  options?: CompressionOptions
): Promise<File> => {
  // Only compress images
  if (!file.type.startsWith('image/')) {
    return file;
  }

  const defaultOptions: CompressionOptions = {
    maxSizeMB: 0.8, // Compress to ~800KB
    maxWidthOrHeight: 1920, // Max dimension 1920px
    useWebWorker: true,
    fileType: file.type, // Preserve original format
  };

  const combinedOptions = { ...defaultOptions, ...options };

  try {
    const compressedFile = await imageCompression(file, combinedOptions as any);
    
    // If compression resulted in a larger file (rare but possible with low quality originals), 
    // return the original
    if (compressedFile.size > file.size) {
      return file;
    }

    return compressedFile;
  } catch (error) {
    console.error('Image compression failed:', error);
    // Fallback to original file if compression fails
    return file;
  }
};
