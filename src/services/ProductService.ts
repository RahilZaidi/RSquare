import { ProductTemplate, ProductColor, ProductSize } from '../types';
import tshirtImage from "@./assets/tshirt-mockup.jpg"

export class ProductService {
  private static readonly products: ProductTemplate[] = [
    {
      id: 'classic-tshirt',
      name: 'Classic T-Shirt',
      category: 'apparel',
      basePrice: 15.99,
      description: 'Comfortable cotton blend t-shirt perfect for custom designs',
      mockupImage: 'src/assets/tshirt-mockup.jpg',
      colors: [
        { name: 'White', value: 'white', hex: '#FFFFFF' },
        { name: 'Black', value: 'black', hex: '#000000' },
        { name: 'Navy', value: 'navy', hex: '#1e3a8a' },
        { name: 'Heather Gray', value: 'heather-gray', hex: '#9ca3af' },
        { name: 'Red', value: 'red', hex: '#dc2626', premium: 2.00 },
        { name: 'Royal Blue', value: 'royal-blue', hex: '#2563eb' },
      ],
      sizes: [
        { name: 'Extra Small', value: 'XS' },
        { name: 'Small', value: 'S' },
        { name: 'Medium', value: 'M' },
        { name: 'Large', value: 'L' },
        { name: 'Extra Large', value: 'XL', premium: 2.00 },
        { name: '2X Large', value: 'XXL', premium: 4.00 },
      ],
      designArea: {
        top: 25,
        left: 35,
        width: 30,
        height: 35,
        maxScale: 2.0,
        minScale: 0.5
      },
      defaultPosition: { x: 50, y: 40, scale: 1.0, rotation: 0 }
    },
    {
      id: 'ceramic-mug',
      name: 'Ceramic Coffee Mug',
      category: 'drinkware',
      basePrice: 12.99,
      description: '11oz ceramic mug with premium printing quality',
      mockupImage: '/mockups/mug-side.jpg',
      colors: [
        { name: 'White', value: 'white', hex: '#FFFFFF' },
        { name: 'Black', value: 'black', hex: '#000000', premium: 1.50 },
        { name: 'Blue', value: 'blue', hex: '#2563eb', premium: 1.50 },
      ],
      sizes: [
        { name: '11oz Standard', value: '11oz' },
        { name: '15oz Large', value: '15oz', premium: 3.00 },
      ],
      designArea: {
        top: 20,
        left: 25,
        width: 50,
        height: 60,
        maxScale: 1.5,
        minScale: 0.3
      },
      defaultPosition: { x: 50, y: 50, scale: 0.8, rotation: 0 }
    },
    {
      id: 'canvas-poster',
      name: 'Canvas Poster',
      category: 'print',
      basePrice: 24.99,
      description: 'High-quality canvas print perfect for wall art',
      mockupImage: '/mockups/canvas-poster.jpg',
      colors: [
        { name: 'White Canvas', value: 'white', hex: '#FFFFFF' },
        { name: 'Natural Canvas', value: 'natural', hex: '#fef3c7' },
      ],
      sizes: [
        { name: '8x10 inches', value: '8x10' },
        { name: '11x14 inches', value: '11x14', premium: 10.00 },
        { name: '16x20 inches', value: '16x20', premium: 25.00 },
        { name: '24x36 inches', value: '24x36', premium: 50.00 },
      ],
      designArea: {
        top: 5,
        left: 5,
        width: 90,
        height: 90,
        maxScale: 1.2,
        minScale: 0.8
      },
      defaultPosition: { x: 50, y: 50, scale: 1.0, rotation: 0 }
    }
  ];

  static getAllProducts(): ProductTemplate[] {
    return this.products;
  }

  static getProduct(id: string): ProductTemplate | null {
    return this.products.find(product => product.id === id) || null;
  }

  static getProductsByCategory(category: string): ProductTemplate[] {
    return this.products.filter(product => product.category === category);
  }

  static getCategories(): string[] {
    return [...new Set(this.products.map(product => product.category))];
  }

  static calculateProductPrice(templateId: string, color: string, size: string, quantity: number): number {
    const template = this.getProduct(templateId);
    if (!template) return 0;

    let price = template.basePrice;

    // Add color premium
    const colorOption = template.colors.find(c => c.value === color);
    if (colorOption?.premium) {
      price += colorOption.premium;
    }

    // Add size premium
    const sizeOption = template.sizes.find(s => s.value === size);
    if (sizeOption?.premium) {
      price += sizeOption.premium;
    }

    // Apply quantity discounts
    if (quantity >= 50) {
      price *= 0.85; // 15% discount
    } else if (quantity >= 25) {
      price *= 0.90; // 10% discount
    } else if (quantity >= 10) {
      price *= 0.95; // 5% discount
    }

    return Math.round(price * quantity * 100) / 100; // Round to 2 decimal places
  }
}

// services/ImageService.ts
import { DesignAsset } from '../types';

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
}