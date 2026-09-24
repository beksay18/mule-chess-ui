import type { Product } from 'src/api/product';

import type { StickerMaterial, StickerSpec, PriceBreakdown } from './types';

import { getSizeInches } from './utils';

export const BASELINE_QUANTITY = 50;

export const PACK_QUANTITIES = [50, 100, 200, 300, 500, 1000, 2000, 3000, 5000];

const MATERIAL_RATE = 0.0185;

const MATERIAL_MULTIPLIER: Record<StickerSpec['material'], number> = {
    vinyl: 1,
    paper: 0.88,
    holographic: 1.85,
    clear: 1.18,
};

const FINISH_MULTIPLIER: Record<StickerSpec['finish'], number> = {
    matte: 0.95,
    glossy: 1,
};

const CUT_MULTIPLIER: Record<StickerSpec['shape'], number> = {
    'die-cut': 1,
    circle: 0.94,
    square: 0.94,
    rectangle: 0.94,
    custom: 1.06,
};

const SETUP_BASE = 32;
const SETUP_PER_INCH_PERIMETER = 1.2;
const LABOR_BASE = 2.4;
const LABOR_PER_INCH_PERIMETER = 0.02;
const LABOR_EXPONENT = 0.55;

const REFERENCE_SPEC: StickerSpec = {
    shape: 'die-cut',
    size: '3x3',
    material: 'vinyl',
    finish: 'matte',
    quantity: BASELINE_QUANTITY,
};

export interface PackQuote {
    quantity: number;
    total: number;
    perSticker: number;
    discountPercent: number;
    recommended?: boolean;
}

export type PricingSource = {
    price?: number | null;
    materials?: { material: string; price: number }[] | null;
    discounts?: { quantity: number; percentage: number }[] | null;
} | null;

function money(value: number): number {
    return Math.max(1, Math.round(value));
}

function money2(value: number): number {
    return Number(Math.max(0, value).toFixed(2));
}

function specMultipliers(sticker: StickerSpec) {
    return {
        material: MATERIAL_MULTIPLIER[sticker.material] ?? 1,
        finish: FINISH_MULTIPLIER[sticker.finish] ?? 1,
        cut: CUT_MULTIPLIER[sticker.shape] ?? 1,
    };
}

function rawPackTotal(width: number, height: number, quantity: number, sticker: StickerSpec): number {
    const qty = Math.max(1, quantity);
    const area = Math.max(width, 0.5) * Math.max(height, 0.5);
    const perimeter = 2 * (Math.max(width, 0.5) + Math.max(height, 0.5));
    const { material, finish, cut } = specMultipliers(sticker);

    const setup = SETUP_BASE + SETUP_PER_INCH_PERIMETER * perimeter;
    const labor = LABOR_BASE + LABOR_PER_INCH_PERIMETER * perimeter;
    const vinyl = qty * area * MATERIAL_RATE * material * finish;
    const cutting = labor * qty ** LABOR_EXPONENT;

    return (setup + vinyl + cutting) * cut;
}

function unscaledListUnit(sticker: StickerSpec): number {
    const size = getSizeInches(sticker);
    const total = money(rawPackTotal(size.width, size.height, BASELINE_QUANTITY, sticker));
    return money2(total / BASELINE_QUANTITY);
}

export function getConfiguredMaterialPrice(
    material: StickerMaterial,
    source?: PricingSource
): number | undefined {
    const match = source?.materials?.find((row) => row.material === material);
    const materialPrice = Number(match?.price);
    if (Number.isFinite(materialPrice) && materialPrice > 0) return materialPrice;
    return undefined;
}

function packScale(sticker: StickerSpec, source?: PricingSource): number {
    if (!source) return 1;

    const own = getConfiguredMaterialPrice(sticker.material, source);
    if (own != null) {
        const formula = unscaledListUnit({ ...REFERENCE_SPEC, material: sticker.material });
        return formula > 0 ? own / formula : 1;
    }

    const vinyl = getConfiguredMaterialPrice('vinyl', source);
    if (vinyl == null) return 1;

    const formulaVinyl = unscaledListUnit({ ...REFERENCE_SPEC, material: 'vinyl' });
    return formulaVinyl > 0 ? vinyl / formulaVinyl : 1;
}

function formulaPackTotal(
    sticker: StickerSpec,
    quantity: number,
    source?: PricingSource
): number {
    const size = getSizeInches(sticker);
    return money(rawPackTotal(size.width, size.height, quantity, sticker) * packScale(sticker, source));
}

function hasAdminDiscounts(source?: PricingSource): boolean {
    return Boolean(source?.discounts?.length);
}

export function getPackTotal(
    sticker: StickerSpec,
    quantity = sticker.quantity,
    source?: PricingSource
): number {
    const qty = Math.max(1, quantity);
    if (hasAdminDiscounts(source)) {
        const listUnit = getListUnitPrice(sticker, source);
        const discount = getQuantityDiscount(qty, source?.discounts ?? undefined);
        return money(listUnit * qty * (1 - discount / 100));
    }

    return formulaPackTotal(sticker, qty, source);
}

export function getListUnitPrice(sticker: StickerSpec, source?: PricingSource): number {
    return money2(formulaPackTotal(sticker, BASELINE_QUANTITY, source) / BASELINE_QUANTITY);
}

export function getDiscountPercent(
    sticker: StickerSpec,
    quantity = sticker.quantity,
    source?: PricingSource
): number {
    const qty = Math.max(1, quantity);
    if (hasAdminDiscounts(source)) {
        return money2(Math.max(0, getQuantityDiscount(qty, source?.discounts ?? undefined)));
    }

    if (qty <= BASELINE_QUANTITY) return 0;

    const listUnit = getListUnitPrice(sticker, source);
    const listTotal = listUnit * qty;
    const pack = formulaPackTotal(sticker, qty, source);
    if (listTotal <= 0) return 0;

    return money2(Math.max(0, (1 - pack / listTotal) * 100));
}

export function quotePack(
    sticker: StickerSpec,
    quantity = sticker.quantity,
    source?: PricingSource
): PackQuote {
    const qty = Math.max(1, quantity);
    const total = getPackTotal(sticker, qty, source);
    const discountPercent = getDiscountPercent(sticker, qty, source);
    return {
        quantity: qty,
        total,
        perSticker: money2(total / qty),
        discountPercent,
        recommended: qty === 300,
    };
}

export function quoteQuantityTiers(
    sticker: StickerSpec,
    quantities: number[],
    source?: PricingSource
): PackQuote[] {
    return quantities.map((quantity) => quotePack(sticker, quantity, source));
}

export function getQuantityDiscount(
    quantity: number,
    tiers?: { quantity: number; percentage: number }[]
): number {
    if (!tiers?.length) {
        return getDiscountPercent(
            {
                shape: 'die-cut',
                size: '3x3',
                material: 'vinyl',
                finish: 'glossy',
                quantity,
            },
            quantity
        );
    }

    const source = [...tiers].sort((a, b) => b.quantity - a.quantity);
    const match = source.find((tier) => quantity >= tier.quantity);
    return match?.percentage ?? 0;
}

export function calculatePrice(sticker: StickerSpec, product?: Product | PricingSource): PriceBreakdown {
    const sizeInches = getSizeInches(sticker);
    const quantity = Math.max(1, sticker.quantity);
    const quote = quotePack(sticker, quantity, product);
    const listUnit = getListUnitPrice(sticker, product);
    const subtotal = money2(listUnit * quantity);

    return {
        unitPrice: listUnit,
        perSticker: quote.perSticker,
        quantity,
        discountPercent: quote.discountPercent,
        subtotal,
        total: quote.total,
        sizeInches,
    };
}
