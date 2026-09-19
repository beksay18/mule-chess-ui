import type { Product, ProductDiscountRequest, ProductDimensionRequest } from 'src/api/product';

import type { StickerDesign, StickerSizeId } from './types';

import { SIZE_OPTIONS } from './constants';
import { clamp, getCanvasSize, getSizeInches } from './utils';

export type ProductLimits = {
    maxWidth: number;
    maxHeight: number;
    maxQuantity: number;
    dimensions: ProductDimensionRequest[];
    discounts: ProductDiscountRequest[];
    unitPrice: number;
};

export function getProductLimits(product: Product | null): ProductLimits | null {
    if (!product) return null;

    return {
        maxWidth: product.maxWidth,
        maxHeight: product.maxHeight,
        maxQuantity: product.maxQuantity,
        dimensions: product.dimensions || [],
        discounts: product.discounts || [],
        unitPrice: product.price,
    };
}

export function sizeIdForDimension(width: number, height: number): StickerSizeId {
    const match = SIZE_OPTIONS.find((option) => option.id !== 'custom' && option.width === width && option.height === height);
    return match?.id ?? 'custom';
}

export function getAllowedDimensions(limits: ProductLimits | null): ProductDimensionRequest[] {
    if (!limits) {
        return SIZE_OPTIONS.filter((option) => option.id !== 'custom').map((option) => ({
            width: option.width,
            height: option.height,
        }));
    }

    const fromProduct = limits.dimensions.filter(
        (dimension) => dimension.width <= limits.maxWidth && dimension.height <= limits.maxHeight
    );

    if (fromProduct.length) return fromProduct;

    return SIZE_OPTIONS.filter(
        (option) => option.id !== 'custom' && option.width <= limits.maxWidth && option.height <= limits.maxHeight
    ).map((option) => ({ width: option.width, height: option.height }));
}

export function getAllowedQuantities(limits: ProductLimits | null): number[] {
    if (!limits) return [10, 25, 50, 100, 250, 500, 1000];

    const fromProduct = limits.discounts
        .map((tier) => tier.quantity)
        .filter((quantity) => quantity > 0 && quantity <= limits.maxQuantity)
        .sort((a, b) => a - b);

    return [...new Set(fromProduct)];
}

export function clampDesignToProduct(design: StickerDesign, product: Product): StickerDesign {
    const limits = getProductLimits(product);
    if (!limits) return design;

    const inches = getSizeInches(design.sticker);
    const width = clamp(inches.width, 0.5, limits.maxWidth);
    const height = clamp(inches.height, 0.5, limits.maxHeight);
    const quantity = clamp(design.sticker.quantity, 1, limits.maxQuantity);
    const allowed = getAllowedDimensions(limits);
    const matchesPreset = allowed.some((dimension) => dimension.width === width && dimension.height === height);
    const size = matchesPreset ? sizeIdForDimension(width, height) : 'custom';

    const nextSticker = {
        ...design.sticker,
        size,
        customWidth: width,
        customHeight: height,
        quantity,
    };
    const canvas = getCanvasSize(nextSticker);

    if (
        design.sticker.size === nextSticker.size &&
        design.sticker.customWidth === width &&
        design.sticker.customHeight === height &&
        design.sticker.quantity === quantity &&
        design.width === canvas.width &&
        design.height === canvas.height
    ) {
        return design;
    }

    return {
        ...design,
        sticker: nextSticker,
        width: canvas.width,
        height: canvas.height,
    };
}
