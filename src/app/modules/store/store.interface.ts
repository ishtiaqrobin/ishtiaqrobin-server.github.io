import { OrderStatus, ProductStatus } from "../../../generated/prisma";

// Product interfaces
export interface CreateProductInput {
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  previewUrl?: string;
  price: number;
  discountPrice?: number;
  currency?: string;
  status?: ProductStatus;
  isFeatured?: boolean;
  sortOrder?: number;
  techStack?: string[];
  includes?: string[];
}

export interface UpdateProductInput {
  title?: string;
  slug?: string;
  description?: string;
  thumbnail?: string;
  previewUrl?: string;
  price?: number;
  discountPrice?: number;
  currency?: string;
  status?: ProductStatus;
  isFeatured?: boolean;
  sortOrder?: number;
  techStack?: string[];
  includes?: string[];
}

// Product Image interfaces
export interface CreateProductImageInput {
  url: string;
  alt?: string;
  sortOrder?: number;
  productId: string;
}

// Order interfaces
export interface CreateOrderInput {
  buyerName: string;
  buyerEmail: string;
  amount: number;
  currency?: string;
  paymentMethod?: string;
  transactionId?: string;
  productId: string;
}

export interface UpdateOrderInput {
  status?: OrderStatus;
  paymentMethod?: string;
  transactionId?: string;
  paidAt?: Date;
  downloadToken?: string;
  downloadCount?: number;
  downloadExpiry?: Date;
}
