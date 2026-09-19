import { ProductType } from '../productType';

export interface ProductDimensionRequest {
    width: number;
    height: number;
}

export interface ProductDiscountRequest {
    quantity: number;
    percentage: number;
}

export interface ProductRequest {
    name: string;
    description: string;
    price: number | null;
    isActive: boolean;
    image?: File;
    backgroundImage?: File;
    productTypeId: number | null;
    dimensions: ProductDimensionRequest[];
    discounts: ProductDiscountRequest[];
    maxWidth: number;
    maxHeight: number;
    maxQuantity: number;
    position?: number | null;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    isActive: boolean;
    imageUrl?: string;
    backgroundImageUrl?: string;
    productType: ProductType;
    dimensions: ProductDimensionRequest[];
    discounts: ProductDiscountRequest[];
    maxWidth: number;
    maxHeight: number;
    maxQuantity: number;
    position: number | null;
}

export function sortProductsByPosition<T extends { position?: number | null }>(items: T[]): T[] {
    return [...items].sort((a, b) => {
        const posA = a.position ?? Number.MAX_SAFE_INTEGER;
        const posB = b.position ?? Number.MAX_SAFE_INTEGER;
        return posA - posB;
    });
}
