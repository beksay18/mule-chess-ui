import type { ShapeKind, TextElement, ImageElement, DesignElement, StickerDesign } from './types';

import { STICKER_ICONS, STICKER_BORDER } from './constants';
import { getDisplayImageSrc, getStickerClipPath } from './utils';

function roundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
}

function applyClip(ctx: CanvasRenderingContext2D, design: StickerDesign) {
    const { width, height, sticker } = design;
    ctx.beginPath();

    if (sticker.shape === 'circle') {
        ctx.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, Math.PI * 2);
    } else if (sticker.shape === 'square' || sticker.shape === 'rectangle') {
        roundedRect(ctx, 0, 0, width, height, Math.min(width, height) * 0.08);
    } else if (sticker.shape === 'die-cut') {
        roundedRect(ctx, 0, 0, width, height, Math.min(width, height) * 0.18);
    } else {
        const path = new Path2D(svgPathFromClip(getStickerClipPath(sticker.shape, sticker.customShape), width, height));
        ctx.clip(path);
        return;
    }

    ctx.clip();
}

function svgPathFromClip(clip: string, width: number, height: number): string {
    if (clip.startsWith('circle')) {
        return `M ${width / 2} 0 A ${width / 2} ${height / 2} 0 1 0 ${width / 2} ${height} A ${width / 2} ${height / 2} 0 1 0 ${width / 2} 0`;
    }

    const points = clip
        .replace('polygon(', '')
        .replace(')', '')
        .split(',')
        .map((pair) => {
            const [x, y] = pair.trim().split(' ');
            return `${(parseFloat(x) / 100) * width} ${(parseFloat(y) / 100) * height}`;
        });

    return `M ${points.join(' L ')} Z`;
}

function drawShapePath(ctx: CanvasRenderingContext2D, kind: ShapeKind, w: number, h: number) {
    ctx.beginPath();
    switch (kind) {
        case 'circle':
            ctx.arc(w / 2, h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
            break;
        case 'ellipse':
            ctx.ellipse(w / 2, h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
            break;
        case 'rounded-rect':
            roundedRect(ctx, 0, 0, w, h, Math.min(w, h) * 0.22);
            break;
        case 'triangle':
            ctx.moveTo(w / 2, 0);
            ctx.lineTo(w, h);
            ctx.lineTo(0, h);
            ctx.closePath();
            break;
        case 'star': {
            const spikes = 5;
            const outer = Math.min(w, h) / 2;
            const inner = outer * 0.42;
            const cx = w / 2;
            const cy = h / 2;
            for (let i = 0; i < spikes * 2; i += 1) {
                const radius = i % 2 === 0 ? outer : inner;
                const angle = (Math.PI / spikes) * i - Math.PI / 2;
                const x = cx + Math.cos(angle) * radius;
                const y = cy + Math.sin(angle) * radius;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            break;
        }
        case 'heart':
            ctx.moveTo(w / 2, h * 0.82);
            ctx.bezierCurveTo(-w * 0.15, h * 0.42, w * 0.12, h * 0.02, w / 2, h * 0.32);
            ctx.bezierCurveTo(w * 0.88, h * 0.02, w * 1.15, h * 0.42, w / 2, h * 0.82);
            break;
        case 'hexagon':
            ctx.moveTo(w * 0.25, 0);
            ctx.lineTo(w * 0.75, 0);
            ctx.lineTo(w, h / 2);
            ctx.lineTo(w * 0.75, h);
            ctx.lineTo(w * 0.25, h);
            ctx.lineTo(0, h / 2);
            ctx.closePath();
            break;
        case 'line':
            ctx.moveTo(0, h / 2);
            ctx.lineTo(w, h / 2);
            break;
        case 'arrow':
            ctx.moveTo(0, h * 0.35);
            ctx.lineTo(w * 0.62, h * 0.35);
            ctx.lineTo(w * 0.62, h * 0.12);
            ctx.lineTo(w, h / 2);
            ctx.lineTo(w * 0.62, h * 0.88);
            ctx.lineTo(w * 0.62, h * 0.65);
            ctx.lineTo(0, h * 0.65);
            ctx.closePath();
            break;
        case 'rect':
        default:
            ctx.rect(0, 0, w, h);
            break;
    }
}

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('Failed to load image'));
        image.src = src;
    });
}

function drawText(ctx: CanvasRenderingContext2D, element: TextElement) {
    const font = `${element.fontStyle} ${element.fontWeight} ${element.fontSize}px "${element.fontFamily}"`;
    ctx.font = font;
    ctx.textAlign = element.textAlign;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = element.color;
    ctx.globalAlpha = element.opacity;

    const x =
        element.textAlign === 'center' ? element.width / 2 : element.textAlign === 'right' ? element.width : 0;
    const y = element.height / 2;

    if (element.outlineWidth > 0) {
        ctx.strokeStyle = element.outlineColor;
        ctx.lineWidth = element.outlineWidth * 2;
        ctx.lineJoin = 'round';
    }

    if (element.curve === 0) {
        if (element.outlineWidth > 0) ctx.strokeText(element.content, x, y);
        ctx.fillText(element.content, x, y);
        return;
    }

    const chars = Array.from(element.content);
    const radius = Math.max(80, element.width / (0.6 + Math.abs(element.curve) / 80));
    const direction = element.curve > 0 ? 1 : -1;
    const start = -((chars.length - 1) * 0.12) / 2;

    chars.forEach((char, index) => {
        const angle = start + index * 0.12 * direction;
        ctx.save();
        ctx.translate(element.width / 2, element.height / 2 + radius * 0.15 * direction);
        ctx.rotate(angle);
        ctx.translate(0, -radius * direction);
        if (element.outlineWidth > 0) ctx.strokeText(char, 0, 0);
        ctx.fillText(char, 0, 0);
        ctx.restore();
    });
}

async function drawElement(ctx: CanvasRenderingContext2D, element: DesignElement) {
    ctx.save();
    ctx.translate(element.x + element.width / 2, element.y + element.height / 2);
    ctx.rotate((element.rotation * Math.PI) / 180);
    ctx.translate(-element.width / 2, -element.height / 2);
    ctx.globalAlpha = element.opacity;

    if (element.type === 'text') {
        drawText(ctx, element);
    } else if (element.type === 'emoji') {
        ctx.font = `${Math.min(element.width, element.height) * 0.82}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(element.content, element.width / 2, element.height / 2);
    } else if (element.type === 'shape') {
        drawShapePath(ctx, element.shape, element.width, element.height);
        ctx.fillStyle = element.fill;
        if (element.shape !== 'line') ctx.fill();
        if (element.strokeWidth > 0 || element.shape === 'line') {
            ctx.strokeStyle = element.stroke;
            ctx.lineWidth = element.strokeWidth || 8;
            ctx.stroke();
        }
    } else if (element.type === 'icon') {
        const icon = STICKER_ICONS.find((item) => item.id === element.iconId);
        if (icon) {
            const path = new Path2D(icon.path);
            ctx.save();
            ctx.scale(element.width / 24, element.height / 24);
            ctx.fillStyle = element.color;
            ctx.strokeStyle = element.color;
            ctx.lineWidth = 1.4;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.fill(path);
            ctx.stroke(path);
            ctx.restore();
        }
    } else if (element.type === 'image') {
        await drawImageElement(ctx, element);
    }

    ctx.restore();
}

async function drawImageElement(ctx: CanvasRenderingContext2D, element: ImageElement) {
    try {
        const image = await loadImage(getDisplayImageSrc(element));
        const cropW = image.naturalWidth * (1 - element.crop.left - element.crop.right);
        const cropH = image.naturalHeight * (1 - element.crop.top - element.crop.bottom);
        const sx = image.naturalWidth * element.crop.left;
        const sy = image.naturalHeight * element.crop.top;

        if (element.outlineWidth > 0) {
            ctx.save();
            ctx.shadowColor = element.outlineColor;
            ctx.shadowBlur = element.outlineWidth * 2;
            ctx.drawImage(image, sx, sy, cropW, cropH, 0, 0, element.width, element.height);
            ctx.restore();
        }

        ctx.drawImage(image, sx, sy, cropW, cropH, 0, 0, element.width, element.height);
    } catch {
        ctx.fillStyle = '#e5e7eb';
        ctx.fillRect(0, 0, element.width, element.height);
    }
}

export async function renderDesignPreview(
    design: StickerDesign,
    options?: { maxSide?: number; shadow?: boolean }
): Promise<string> {
    const maxSide = options?.maxSide ?? 720;
    const scale = maxSide / Math.max(design.width, design.height);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(design.width * scale);
    canvas.height = Math.round(design.height * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.scale(scale, scale);

    if (options?.shadow) {
        ctx.save();
        ctx.shadowColor = 'rgba(15, 23, 42, 0.28)';
        ctx.shadowBlur = 28;
        ctx.shadowOffsetY = 14;
        ctx.fillStyle = '#ffffff';
        applyClip(ctx, design);
        ctx.fillRect(0, 0, design.width, design.height);
        ctx.restore();
    }

    ctx.save();
    applyClip(ctx, design);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, design.width, design.height);

    ctx.save();
    ctx.beginPath();
    ctx.rect(
        STICKER_BORDER,
        STICKER_BORDER,
        design.width - STICKER_BORDER * 2,
        design.height - STICKER_BORDER * 2
    );
    ctx.clip();

    for (const element of design.elements) {
         
        await drawElement(ctx, element);
    }

    ctx.restore();
    ctx.restore();

    return canvas.toDataURL('image/png');
}

export function exportDesignJson(design: StickerDesign): string {
    return JSON.stringify(
        {
            width: design.width,
            height: design.height,
            elements: design.elements,
            sticker: design.sticker,
            name: design.name,
            id: design.id,
        },
        null,
        2
    );
}
