import type {
    ShapeKind,
    CropInsets,
    IconElement,
    StickerSpec,
    TextElement,
    EmojiElement,
    ImageElement,
    ShapeElement,
    StickerShape,
    DesignElement,
    StickerDesign,
    StickerSizeId,
    CustomShapeKind,
} from './types';

import { CANVAS_BASE, SIZE_OPTIONS, STICKER_ICONS } from './constants';

export function createId(prefix = 'el'): string {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

export function snapValue(value: number, grid: number, enabled: boolean): number {
    if (!enabled) return value;
    return Math.round(value / grid) * grid;
}

export function nowIso(): string {
    return new Date().toISOString();
}

export function getSizeInches(sticker: StickerSpec): { width: number; height: number } {
    if (sticker.size === 'custom') {
        return {
            width: sticker.customWidth || 3,
            height: sticker.customHeight || 3,
        };
    }

    const found = SIZE_OPTIONS.find((option) => option.id === sticker.size);
    return { width: found?.width ?? 3, height: found?.height ?? 3 };
}

export function getCanvasSize(sticker: StickerSpec): { width: number; height: number } {
    const inches = getSizeInches(sticker);
    const longest = Math.max(inches.width, inches.height) || 1;
    const scale = CANVAS_BASE / longest;
    return {
        width: Math.round(inches.width * scale),
        height: Math.round(inches.height * scale),
    };
}

export function getSizeLabel(sticker: StickerSpec): string {
    const inches = getSizeInches(sticker);
    return `${inches.width}" × ${inches.height}"`;
}

export function createDefaultSpec(): StickerSpec {
    return {
        shape: 'die-cut',
        size: '3x3',
        material: 'vinyl',
        finish: 'matte',
        quantity: 50,
        customWidth: 3,
        customHeight: 3,
        customShape: 'star',
    };
}

export function createEmptyDesign(name = 'Untitled sticker'): StickerDesign {
    const sticker = createDefaultSpec();
    const size = getCanvasSize(sticker);
    const timestamp = nowIso();

    return {
        id: createId('design'),
        name,
        width: size.width,
        height: size.height,
        elements: [createTextElement(size.width, size.height)],
        sticker,
        createdAt: timestamp,
        updatedAt: timestamp,
    };
}

export function cloneDesign(design: StickerDesign): StickerDesign {
    return structuredClone(design);
}

export function createTextElement(canvasWidth: number, canvasHeight: number): TextElement {
    return {
        id: createId('text'),
        type: 'text',
        name: 'Text',
        content: 'My Sticker',
        x: canvasWidth / 2 - 180,
        y: canvasHeight / 2 - 40,
        width: 360,
        height: 90,
        rotation: 0,
        opacity: 1,
        locked: false,
        fontSize: 64,
        fontFamily: 'DM Sans',
        fontWeight: 'bold',
        fontStyle: 'normal',
        textAlign: 'center',
        color: '#111111',
        letterSpacing: 0,
        outlineColor: '#ffffff',
        outlineWidth: 0,
        curve: 0,
    };
}

export function createEmojiElement(
    content: string,
    canvasWidth: number,
    canvasHeight: number
): EmojiElement {
    return {
        id: createId('emoji'),
        type: 'emoji',
        name: `Emoji ${content}`,
        content,
        x: canvasWidth / 2 - 50,
        y: canvasHeight / 2 - 50,
        width: 100,
        height: 100,
        rotation: 0,
        opacity: 1,
        locked: false,
    };
}

export function createShapeElement(
    shape: ShapeKind,
    canvasWidth: number,
    canvasHeight: number
): ShapeElement {
    const isLine = shape === 'line';
    return {
        id: createId('shape'),
        type: 'shape',
        name: shape,
        shape,
        x: canvasWidth / 2 - 80,
        y: canvasHeight / 2 - (isLine ? 8 : 80),
        width: 160,
        height: isLine ? 16 : 160,
        rotation: 0,
        opacity: 1,
        locked: false,
        fill: '#175195',
        stroke: '#0b2c52',
        strokeWidth: 0,
    };
}

export function createIconElement(
    iconId: string,
    canvasWidth: number,
    canvasHeight: number
): IconElement {
    const icon = STICKER_ICONS.find((item) => item.id === iconId);
    return {
        id: createId('icon'),
        type: 'icon',
        name: icon?.label || 'Icon',
        iconId,
        color: '#175195',
        x: canvasWidth / 2 - 50,
        y: canvasHeight / 2 - 50,
        width: 100,
        height: 100,
        rotation: 0,
        opacity: 1,
        locked: false,
    };
}

export function createImageElement(
    src: string,
    canvasWidth: number,
    canvasHeight: number,
    naturalWidth = 400,
    naturalHeight = 400
): ImageElement {
    const maxSide = 360;
    const ratio = naturalWidth / naturalHeight || 1;
    const width = ratio >= 1 ? maxSide : maxSide * ratio;
    const height = ratio >= 1 ? maxSide / ratio : maxSide;

    return {
        id: createId('image'),
        type: 'image',
        name: 'Image',
        src,
        processedSrc: undefined,
        backgroundRemoved: false,
        crop: { top: 0, right: 0, bottom: 0, left: 0 },
        outlineColor: '#ffffff',
        outlineWidth: 0,
        x: canvasWidth / 2 - width / 2,
        y: canvasHeight / 2 - height / 2,
        width,
        height,
        rotation: 0,
        opacity: 1,
        locked: false,
    };
}

export function createQrElement(src: string, qrUrl: string, x: number, y: number, size: number): ImageElement {
    return {
        id: createId('qr'),
        type: 'image',
        name: 'QR code',
        src,
        qrUrl,
        purpose: 'qr',
        processedSrc: undefined,
        backgroundRemoved: false,
        crop: { top: 0, right: 0, bottom: 0, left: 0 },
        outlineColor: '#ffffff',
        outlineWidth: 0,
        x,
        y,
        width: size,
        height: size,
        rotation: 0,
        opacity: 1,
        locked: false,
    };
}

export function getElementCenter(element: DesignElement): { x: number; y: number } {
    return {
        x: element.x + element.width / 2,
        y: element.y + element.height / 2,
    };
}

export function getDisplayImageSrc(element: ImageElement): string {
    return element.processedSrc || element.src;
}

export function normalizeCrop(crop: CropInsets): CropInsets {
    return {
        top: clamp(crop.top, 0, 0.45),
        right: clamp(crop.right, 0, 0.45),
        bottom: clamp(crop.bottom, 0, 0.45),
        left: clamp(crop.left, 0, 0.45),
    };
}

export function applySizeToDesign(design: StickerDesign, size: StickerSizeId): StickerDesign {
    const next = cloneDesign(design);
    next.sticker.size = size;
    const canvas = getCanvasSize(next.sticker);
    const scaleX = canvas.width / (design.width || canvas.width);
    const scaleY = canvas.height / (design.height || canvas.height);

    next.width = canvas.width;
    next.height = canvas.height;
    next.elements = next.elements.map((element) => ({
        ...element,
        x: element.x * scaleX,
        y: element.y * scaleY,
        width: element.width * scaleX,
        height: element.height * scaleY,
    }));

    return next;
}

export function getStickerClipPath(shape: StickerShape, customShape?: CustomShapeKind): string {
    if (shape === 'circle') return 'circle(50% at 50% 50%)';
    if (shape === 'square' || shape === 'rectangle') return 'inset(0 round 8%)';
    if (shape === 'die-cut') return 'inset(0 round 18%)';

    switch (customShape) {
        case 'heart':
            return 'polygon(50% 92%, 8% 52%, 8% 32%, 24% 16%, 42% 20%, 50% 34%, 58% 20%, 76% 16%, 92% 32%, 92% 52%)';
        case 'hexagon':
            return 'polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0 50%)';
        case 'shield':
            return 'polygon(50% 4%, 94% 16%, 90% 58%, 50% 96%, 10% 58%, 6% 16%)';
        case 'cloud':
            return 'polygon(22% 68%, 14% 52%, 22% 34%, 40% 28%, 52% 18%, 70% 24%, 84% 38%, 88% 58%, 76% 72%, 36% 76%)';
        case 'star':
        default:
            return 'polygon(50% 4%, 61% 38%, 98% 38%, 68% 60%, 79% 96%, 50% 74%, 21% 96%, 32% 60%, 2% 38%, 39% 38%)';
    }
}

export function getElementLabel(element: DesignElement): string {
    if (element.type === 'text') return element.content.slice(0, 24) || 'Text';
    if (element.type === 'emoji') return element.content;
    return element.name;
}

export function readImageFile(file: File): Promise<{ src: string; width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const allowed = ['image/png', 'image/jpeg', 'image/webp'];
        if (!allowed.includes(file.type)) {
            reject(new Error('Please upload a PNG, JPG, or WebP image.'));
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const src = String(reader.result || '');
            const image = new Image();
            image.onload = () => resolve({ src, width: image.naturalWidth, height: image.naturalHeight });
            image.onerror = () => reject(new Error('Could not read that image.'));
            image.src = src;
        };
        reader.onerror = () => reject(new Error('Could not read that file.'));
        reader.readAsDataURL(file);
    });
}

export function removeImageBackground(src: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Canvas is not available.'));
                return;
            }

            ctx.drawImage(image, 0, 0);
            const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = data.data;
            const width = canvas.width;
            const height = canvas.height;
            const sample = (x: number, y: number) => {
                const i = (y * width + x) * 4;
                return [pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]] as const;
            };

            const corners = [
                sample(0, 0),
                sample(width - 1, 0),
                sample(0, height - 1),
                sample(width - 1, height - 1),
            ];
            const avg = corners.reduce(
                (acc, color) => [acc[0] + color[0], acc[1] + color[1], acc[2] + color[2]],
                [0, 0, 0]
            );
            const target = [avg[0] / 4, avg[1] / 4, avg[2] / 4];
            const threshold = 42;

            for (let i = 0; i < pixels.length; i += 4) {
                const dr = pixels[i] - target[0];
                const dg = pixels[i + 1] - target[1];
                const db = pixels[i + 2] - target[2];
                const dist = Math.sqrt(dr * dr + dg * dg + db * db);
                const nearWhite = pixels[i] > 236 && pixels[i + 1] > 236 && pixels[i + 2] > 236;
                if (dist < threshold || nearWhite) {
                    pixels[i + 3] = 0;
                }
            }

            ctx.putImageData(data, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        image.onerror = () => reject(new Error('Could not process that image.'));
        image.src = src;
    });
}
