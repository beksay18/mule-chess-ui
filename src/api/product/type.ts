import { ProductType } from '../productType';

export interface ProductDimensionRequest {
    width: number;
    height: number;
}

export interface ProductPricingRequest {
    quantity: number;
    basePrice: number;
    discountPercent: number;
}

export interface ProductRequest {
    name: string;
    description: string;
    isActive: boolean;
    productTypeId: number | null;
    dimensions: ProductDimensionRequest[];
    pricings: ProductPricingRequest[];
}

export interface Product {
    id: number;
    name: string;
    description: string;
    isActive: boolean;
    productType: ProductType;
    dimensions: ProductDimensionRequest[];
    pricings: ProductPricingRequest[];
}
