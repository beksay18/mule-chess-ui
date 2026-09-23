import { ProductType } from '../productType';

export interface ProductDimensionRequest {
    width: number;
    height: number;
}

export interface ProductDiscountRequest {
    quantity: number;
    percentage: number;
}

export interface ProductMaterialRequest {
    material: string;
    price: number;
}

export interface ProductRequest {
    name: string;
    description: string;
    price: number | null;
    isActive: boolean;
    image?: File;
    productTypeId: number | null;
    dimensions: ProductDimensionRequest[];
    discounts: ProductDiscountRequest[];
    materials: ProductMaterialRequest[];
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
    productType: ProductType;
    dimensions: ProductDimensionRequest[];
    discounts: ProductDiscountRequest[];
    materials?: ProductMaterialRequest[];
    maxWidth: number;
    maxHeight: number;
    maxQuantity: number;
    position: number | null;
}

/** Shop / custom-product display price. Prefer stored `price`, else vinyl, else first configured material, else 0. */
export function getDisplayPrice(product?: {
    price?: number | null;
    materials?: ProductMaterialRequest[] | null;
} | null): number {
    const listed = Number(product?.price);
    if (Number.isFinite(listed) && listed > 0) return listed;

    return getFallbackPriceFromMaterials(product?.materials);
}

/** Fallback used when the generic product price is no longer collected. */
export function getFallbackPriceFromMaterials(
    materials?: ProductMaterialRequest[] | null
): number {
    const rows = materials ?? [];
    const vinyl = rows.find((row) => row.material === 'vinyl' && Number(row.price) > 0);
    if (vinyl) return Number(vinyl.price);

    const first = rows.find((row) => Number(row.price) > 0);
    if (first) return Number(first.price);

    return 0;
}

export function sortDiscountsByQuantity<T extends { quantity: number }>(items: T[]): T[] {
    return [...items].sort((a, b) => (a.quantity || 0) - (b.quantity || 0));
}

export function sortProductsByPosition<T extends { position?: number | null }>(items: T[]): T[] {
    return [...items].sort((a, b) => {
        const posA = a.position ?? Number.MAX_SAFE_INTEGER;
        const posB = b.position ?? Number.MAX_SAFE_INTEGER;
        return posA - posB;
    });
}
