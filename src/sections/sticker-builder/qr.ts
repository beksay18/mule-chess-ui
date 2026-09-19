import QRCode from 'qrcode';

import type { Product } from 'src/api/product';

import type { ImageElement, StickerDesign } from './types';
import { PRINT_SAFE_INSET, STICKER_BORDER } from './constants';

export function isQrCodeProduct(product?: Pick<Product, 'name'> | null): boolean {
    return Boolean(product?.name?.toLowerCase().includes('qr'));
}

export function findQrElement(design: StickerDesign): ImageElement | undefined {
    return design.elements.find((element): element is ImageElement => element.type === 'image' && element.purpose === 'qr');
}

export function normalizeQrUrl(raw: string): string {
    const trimmed = raw.trim();
    if (!trimmed) return '';
    if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
}

export function isValidQrUrl(raw: string): boolean {
    const value = normalizeQrUrl(raw);
    if (!value) return false;
    try {
        const parsed = new URL(value);
        if (parsed.protocol === 'mailto:' || parsed.protocol === 'tel:') return Boolean(parsed.pathname);
        return Boolean(parsed.hostname);
    } catch {
        return false;
    }
}

export async function generateQrDataUrl(url: string): Promise<string> {
    return QRCode.toDataURL(url, {
        width: 512,
        margin: 1,
        errorCorrectionLevel: 'H',
        color: {
            dark: '#111111',
            light: '#ffffff',
        },
    });
}

export function getQrPlacement(design: StickerDesign): {
    x: number;
    y: number;
    size: number;
    shift: { dx: number; dy: number };
} {
    const inset = STICKER_BORDER + PRINT_SAFE_INSET;
    const minX = inset;
    const minY = inset;
    const maxX = design.width - inset;
    const maxY = design.height - inset;
    const printableW = Math.max(80, maxX - minX);
    const printableH = Math.max(80, maxY - minY);
    const others = design.elements.filter((element) => !(element.type === 'image' && element.purpose === 'qr'));
    const size = Math.round(Math.min(printableW, printableH) * 0.28);

    if (!others.length) {
        return {
            x: minX + (printableW - size) / 2,
            y: minY + (printableH - size) / 2,
            size,
            shift: { dx: 0, dy: 0 },
        };
    }

    const bbox = others.reduce(
        (acc, element) => ({
            minX: Math.min(acc.minX, element.x),
            minY: Math.min(acc.minY, element.y),
            maxX: Math.max(acc.maxX, element.x + element.width),
            maxY: Math.max(acc.maxY, element.y + element.height),
        }),
        { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
    );

    const gap = 28;
    const artworkW = bbox.maxX - bbox.minX;
    const artworkH = bbox.maxY - bbox.minY;
    const qrSize = Math.max(72, Math.min(size, printableW - artworkW - gap));
    const groupW = artworkW + gap + qrSize;
    const groupH = Math.max(artworkH, qrSize);
    const groupX = minX + (printableW - Math.min(groupW, printableW)) / 2;
    const groupY = minY + (printableH - Math.min(groupH, printableH)) / 2;

    return {
        x: Math.min(groupX + artworkW + gap, maxX - qrSize),
        y: Math.min(Math.max(groupY + (Math.min(groupH, printableH) - qrSize) / 2, minY), maxY - qrSize),
        size: qrSize,
        shift: {
            dx: groupX - bbox.minX,
            dy: groupY + (Math.min(groupH, printableH) - artworkH) / 2 - bbox.minY,
        },
    };
}
