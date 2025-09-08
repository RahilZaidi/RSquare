// types/index.ts
export interface DesignPosition {
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  scale: number; // multiplier (0.1-3.0)
  rotation: number; // degrees (-180 to 180)
}

export interface ProductColor {
  name: string;
  value: string;
  hex: string;
  premium?: number; // additional cost
}

export interface ProductSize {
  name: string;
  value: string;
  premium?: number; // additional cost
}

export interface ProductTemplate {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  description: string;
  mockupImage: string;
  colors: ProductColor[];
  sizes: ProductSize[];
  designArea: {
    // Where design can be placed (percentage of product)
    top: number;
    left: number;
    width: number;
    height: number;
    maxScale: number;
    minScale: number;
  };
  defaultPosition: DesignPosition;
}

export interface ProductConfig {
  id: string; // unique instance ID
  templateId: string; // references ProductTemplate
  name: string;
  quantity: number;
  color: string;
  size: string;
  designPosition: DesignPosition;
  customizations?: Record<string, any>; // future extensibility
}

export interface DesignAsset {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'text' | 'svg';
  metadata: {
    width?: number;
    height?: number;
    format?: string;
    size?: number; // file size in bytes
  };
  uploadedAt: Date;
}

export interface DesignProject {
  id: string;
  name: string;
  description?: string;
  assets: DesignAsset[];
  products: ProductConfig[];
  status: 'draft' | 'configured' | 'quoted' | 'ordered';
  createdAt: Date;
  updatedAt: Date;
  metadata: {
    totalPrice?: number;
    estimatedDelivery?: Date;
    quoteRequestCount: number;
  };
}

export type AppView = 
  | 'welcome' 
  | 'upload' 
  | 'design-gallery'
  | 'product-selection' 
  | 'product-customization' 
  | 'review-quote' 
  | 'order-history';

export interface AppState {
  currentProject: DesignProject | null;
  currentView: AppView;
  selectedProductId: string | null;
  selectedAssetId: string | null;
  isLoading: boolean;
  error: string | null;
  ui: {
    sidebarOpen: boolean;
    previewMode: '2d' | '3d';
    showGrid: boolean;
  };
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface QuoteRequest {
  projectId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    company?: string;
  };
  products: ProductConfig[];
  urgency: 'standard' | 'rush' | 'urgent';
  notes?: string;
}

export interface QuoteResponse {
  id: string;
  products: Array<{
    config: ProductConfig;
    unitPrice: number;
    totalPrice: number;
    estimatedDelivery: string;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  validUntil: Date;
  estimatedDelivery: Date;
}