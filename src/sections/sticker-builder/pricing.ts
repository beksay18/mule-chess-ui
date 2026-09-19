import type { Product } from 'src/api/product';

import type { StickerSpec, PriceBreakdown } from './types';

import { getSizeInches } from './utils';

const SIZE_BASE: Record<string, number> = {
    '2x2': 0.48,
    '3x3': 0.68,
    '4x4': 0.98,
    '5x5': 1.38,
    '2x4': 0.78,
};

const MATERIAL_MULTIPLIER: Record<StickerSpec['material'], number> = {
    vinyl: 1,
    paper: 0.82,
    holographic: 1.48,
    clear: 1.22,
};

const FINISH_MULTIPLIER: Record<StickerSpec['finish'], number> = {
    matte: 1,
    glossy: 1.08,
};

const CUT_MULTIPLIER: Record<StickerSpec['shape'], number> = {
    'die-cut': 1.16,
    circle: 1,
    square: 1,
    rectangle: 1,
    custom: 1.24,
};

const QUANTITY_DISCOUNTS: { quantity: number; percentage: number }[] = [
    { quantity: 1000, percentage: 55 },
    { quantity: 500, percentage: 50 },
    { quantity: 250, percentage: 40 },
    { quantity: 100, percentage: 32 },
    { quantity: 50, percentage: 22 },
    { quantity: 25, percentage: 12 },
    { quantity: 10, percentage: 0 },
];

function getCustomSizeBase(width: number, height: number): number {
    const area = Math.max(width, 0.5) * Math.max(height, 0.5);
    return Math.max(0.42, area * 0.21);
}

export function getQuantityDiscount(
    quantity: number,
    tiers?: { quantity: number; percentage: number }[]
): number {
    const source = [...(tiers?.length ? tiers : QUANTITY_DISCOUNTS)].sort(
        (a, b) => b.quantity - a.quantity
    );
    const match = source.find((tier) => quantity >= tier.quantity);
    return match?.percentage ?? 0;
}

export function calculatePrice(sticker: StickerSpec, product?: Product | null): PriceBreakdown {
    const sizeInches = getSizeInches(sticker);
    const sizeBase = product
        ? product.price
        : sticker.size === 'custom'
          ? getCustomSizeBase(sizeInches.width, sizeInches.height)
          : SIZE_BASE[sticker.size] ?? getCustomSizeBase(sizeInches.width, sizeInches.height);

    const unitPrice = Number(
        (
            product
                ? sizeBase
                : sizeBase *
                  MATERIAL_MULTIPLIER[sticker.material] *
                  FINISH_MULTIPLIER[sticker.finish] *
                  CUT_MULTIPLIER[sticker.shape]
        ).toFixed(2)
    );

    const quantity = Math.max(1, sticker.quantity);
    const discountPercent = getQuantityDiscount(quantity, product?.discounts);
    const subtotal = unitPrice * quantity;
    const total = subtotal * (1 - discountPercent / 100);

    return {
        unitPrice,
        quantity,
        discountPercent,
        subtotal: Number(subtotal.toFixed(2)),
        total: Number(total.toFixed(2)),
        sizeInches,
    };
}
