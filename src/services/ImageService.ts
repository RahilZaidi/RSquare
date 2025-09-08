// services/ImageService.ts
import { DesignAsset } from '../types';
import { ProductService } from './ProductService';

export class ImageService {
  static async processUpload(file: File): Promise<DesignAsset> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('File must be an image'));
        return;
      }

      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        reject(new Error('Image must be smaller than 10MB'));
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const url = e.target?.result as string;
          const dimensions = await this.getImageDimensions(url);
          
          const asset: DesignAsset = {
            id: crypto.randomUUID(),
            name: file.name,
            url: url,
            type: 'image',
            metadata: {
              width: dimensions.width,
              height: dimensions.height,
              format: file.type,
              size: file.size
            },
            uploadedAt: new Date()
          };

          resolve(asset);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  private static getImageDimensions(url: string): Promise<{width: number; height: number}> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = url;
    });
  }

  static validateImageForProduct(asset: DesignAsset, templateId: string): string[] {
    const errors: string[] = [];
    const template = ProductService.getProduct(templateId);
    
    if (!template) {
      errors.push('Invalid product template');
      return errors;
    }

    // Check resolution
    const minWidth = 300;
    const minHeight = 300;
    if (asset.metadata.width && asset.metadata.width < minWidth) {
      errors.push(`Image width should be at least ${minWidth}px`);
    }
    if (asset.metadata.height && asset.metadata.height < minHeight) {
      errors.push(`Image height should be at least ${minHeight}px`);
    }

    // Check aspect ratio for certain products
    if (templateId === 'canvas-poster' && asset.metadata.width && asset.metadata.height) {
      const aspectRatio = asset.metadata.width / asset.metadata.height;
      if (aspectRatio < 0.5 || aspectRatio > 2.0) {
        errors.push('Image aspect ratio should be between 1:2 and 2:1 for posters');
      }
    }

    return errors;
  }

  static compressImage(file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              resolve(file); // Return original if compression fails
            }
          },
          file.type,
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }

  static isValidImageFormat(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp'];
    return validTypes.includes(file.type);
  }

  static generateThumbnail(file: File, size: number = 200): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        canvas.width = size;
        canvas.height = size;

        // Calculate crop area for square thumbnail
        const minDimension = Math.min(img.width, img.height);
        const sx = (img.width - minDimension) / 2;
        const sy = (img.height - minDimension) / 2;

        ctx.drawImage(img, sx, sy, minDimension, minDimension, 0, 0, size, size);
        
        const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(thumbnailUrl);
      };

      img.onerror = () => reject(new Error('Failed to generate thumbnail'));
      img.src = URL.createObjectURL(file);
    });
  }
}