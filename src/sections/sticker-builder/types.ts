export type ElementType = 'text' | 'image' | 'emoji' | 'shape' | 'icon';

export type StickerShape = 'die-cut' | 'circle' | 'square' | 'rectangle' | 'custom';

export type CustomShapeKind = 'star' | 'heart' | 'hexagon' | 'shield' | 'cloud';

export type StickerSizeId = '2x2' | '3x3' | '4x4' | '5x5' | '2x4' | 'custom';

export type StickerMaterial = 'vinyl' | 'paper' | 'holographic' | 'clear';

export type StickerFinish = 'matte' | 'glossy';

export type TextAlign = 'left' | 'center' | 'right';

export type ShapeKind =
    | 'rect'
    | 'rounded-rect'
    | 'circle'
    | 'ellipse'
    | 'triangle'
    | 'star'
    | 'heart'
    | 'hexagon'
    | 'line'
    | 'arrow';

export type AlignMode = 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom';

export interface CropInsets {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export interface BaseElement {
    id: string;
    type: ElementType;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    opacity: number;
    locked: boolean;
}

export interface TextElement extends BaseElement {
    type: 'text';
    content: string;
    fontSize: number;
    fontFamily: string;
    fontWeight: 'normal' | 'bold';
    fontStyle: 'normal' | 'italic';
    textAlign: TextAlign;
    color: string;
    letterSpacing: number;
    outlineColor: string;
    outlineWidth: number;
    curve: number;
}

export interface ImageElement extends BaseElement {
    type: 'image';
    src: string;
    crop: CropInsets;
    outlineColor: string;
    outlineWidth: number;
    backgroundRemoved: boolean;
    processedSrc?: string;
    purpose?: 'qr';
    qrUrl?: string;
}

export interface EmojiElement extends BaseElement {
    type: 'emoji';
    content: string;
}

export interface ShapeElement extends BaseElement {
    type: 'shape';
    shape: ShapeKind;
    fill: string;
    stroke: string;
    strokeWidth: number;
}

export interface IconElement extends BaseElement {
    type: 'icon';
    iconId: string;
    color: string;
}

export type DesignElement = TextElement | ImageElement | EmojiElement | ShapeElement | IconElement;

export interface StickerSpec {
    shape: StickerShape;
    customShape?: CustomShapeKind;
    size: StickerSizeId;
    customWidth?: number;
    customHeight?: number;
    material: StickerMaterial;
    finish: StickerFinish;
    quantity: number;
    qrUrl?: string;
}

export interface StickerDesign {
    id: string;
    name: string;
    width: number;
    height: number;
    elements: DesignElement[];
    sticker: StickerSpec;
    createdAt: string;
    updatedAt: string;
    previewUrl?: string;
}

export interface SavedDesignRecord {
    id: string;
    name: string;
    updatedAt: string;
    createdAt: string;
    previewUrl?: string;
    design: StickerDesign;
}

export interface PriceBreakdown {
    unitPrice: number;
    perSticker: number;
    quantity: number;
    discountPercent: number;
    subtotal: number;
    total: number;
    sizeInches: { width: number; height: number };
}

export interface ValidationIssue {
    code: string;
    message: string;
}

export interface ValidationResult {
    valid: boolean;
    issues: ValidationIssue[];
}

export type TransformHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'rotate';
