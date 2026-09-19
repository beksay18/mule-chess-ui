import type { DesignElement, StickerDesign, ValidationResult } from './types';

import { STICKER_BORDER, PRINT_SAFE_INSET } from './constants';
import type { ProductLimits } from './product-limits';
import { getSizeInches } from './utils';

function isInsidePrintableArea(element: DesignElement, design: StickerDesign): boolean {
    const inset = STICKER_BORDER + PRINT_SAFE_INSET;
    const minX = inset;
    const minY = inset;
    const maxX = design.width - inset;
    const maxY = design.height - inset;

    return (
        element.x >= minX - 4 &&
        element.y >= minY - 4 &&
        element.x + element.width <= maxX + 4 &&
        element.y + element.height <= maxY + 4
    );
}

export function validateDesign(
    design: StickerDesign,
    limits?: ProductLimits | null,
    options?: { requireQr?: boolean }
): ValidationResult {
    const issues: ValidationResult['issues'] = [];

    if (!design.elements.length) {
        issues.push({
            code: 'empty',
            message: 'Add at least one text, image, or shape before ordering.',
        });
    }

    const overflowing = design.elements.filter((element) => !isInsidePrintableArea(element, design));
    if (overflowing.length) {
        issues.push({
            code: 'overflow',
            message: `${overflowing.length} element${overflowing.length === 1 ? '' : 's'} sit outside the printable area. Move them inward from the sticker edge.`,
        });
    }

    const inches = getSizeInches(design.sticker);
    const maxWidth = limits?.maxWidth;
    const maxHeight = limits?.maxHeight;
    const maxQuantity = limits?.maxQuantity;

    if (inches.width < 0.5 || inches.height < 0.5) {
        issues.push({
            code: 'size',
            message: 'Size must be at least 0.5" on each side.',
        });
    }

    if (maxWidth && inches.width > maxWidth) {
        issues.push({
            code: 'max-width',
            message: `Width cannot exceed ${maxWidth}" for this product.`,
        });
    }

    if (maxHeight && inches.height > maxHeight) {
        issues.push({
            code: 'max-height',
            message: `Height cannot exceed ${maxHeight}" for this product.`,
        });
    }

    if (design.sticker.quantity < 1) {
        issues.push({
            code: 'quantity',
            message: 'Choose a quantity of at least 1.',
        });
    }

    if (maxQuantity && design.sticker.quantity > maxQuantity) {
        issues.push({
            code: 'max-quantity',
            message: `Quantity cannot exceed ${maxQuantity} for this product.`,
        });
    }

    if (options?.requireQr) {
        const hasQr = design.elements.some((element) => element.type === 'image' && element.purpose === 'qr');
        if (!design.sticker.qrUrl?.trim() || !hasQr) {
            issues.push({
                code: 'qr-url',
                message: 'Add a link to generate the QR code next to this sticker.',
            });
        }
    }

    return {
        valid: issues.length === 0,
        issues,
    };
}
