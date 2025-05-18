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
}
