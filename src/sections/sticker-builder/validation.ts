import type { DesignElement, StickerDesign, ValidationResult } from './types';

import { STICKER_BORDER, PRINT_SAFE_INSET } from './constants';

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

export function validateDesign(design: StickerDesign): ValidationResult {
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

    if (design.sticker.quantity < 1) {
        issues.push({
            code: 'quantity',
            message: 'Choose a quantity of at least 1.',
        });
    }

    const inches = {
        width: design.sticker.size === 'custom' ? design.sticker.customWidth || 0 : 1,
        height: design.sticker.size === 'custom' ? design.sticker.customHeight || 0 : 1,
    };
    if (design.sticker.size === 'custom' && (inches.width < 0.5 || inches.height < 0.5)) {
        issues.push({
            code: 'size',
            message: 'Custom size must be at least 0.5" on each side.',
        });
    }

    return {
        valid: issues.length === 0,
        issues,
    };
}
