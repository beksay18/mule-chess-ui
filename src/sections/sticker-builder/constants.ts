import type {
    ShapeKind,
    StickerShape,
    StickerFinish,
    StickerSizeId,
    CustomShapeKind,
    StickerMaterial,
} from './types';

export const BRAND_BLUE = '#175195';
export const BRAND_GREEN = '#06853D';

export const CANVAS_BASE = 1000;
export const GRID_SIZE = 20;
export const STICKER_BORDER = 36;
export const PRINT_SAFE_INSET = 16;
export const MIN_ELEMENT_SIZE = 24;
export const DEFAULT_ZOOM = 0.72;
export const MIN_ZOOM = 0.25;
export const MAX_ZOOM = 2.5;
export const DESIGNS_STORAGE_KEY = 'mule-chess-designs';

export const FONT_FAMILIES = [
    'DM Sans',
    'Barlow',
    'Montserrat',
    'Oswald',
    'Pacifico',
    'Permanent Marker',
    'Arial',
    'Georgia',
    'Impact',
    'Verdana',
    'Trebuchet MS',
    'Times New Roman',
    'Courier New',
] as const;

export const SIZE_OPTIONS: { id: StickerSizeId; label: string; width: number; height: number }[] = [
    { id: '2x2', label: '2" × 2"', width: 2, height: 2 },
    { id: '3x3', label: '3" × 3"', width: 3, height: 3 },
    { id: '4x4', label: '4" × 4"', width: 4, height: 4 },
    { id: '5x5', label: '5" × 5"', width: 5, height: 5 },
    { id: '2x4', label: '2" × 4"', width: 2, height: 4 },
    { id: 'custom', label: 'Custom', width: 3, height: 3 },
];

export const QUANTITY_OPTIONS = [50, 100, 200, 300, 500, 1000, 2000, 3000, 5000];

export const MATERIAL_OPTIONS: { id: StickerMaterial; label: string; hint: string }[] = [
    { id: 'vinyl', label: 'Vinyl', hint: 'Durable outdoor' },
    { id: 'paper', label: 'Paper', hint: 'Indoor & events' },
    { id: 'holographic', label: 'Holographic', hint: 'Rainbow finish' },
    { id: 'clear', label: 'Clear', hint: 'See-through vinyl' },
];

export const FINISH_OPTIONS: { id: StickerFinish; label: string }[] = [
    { id: 'matte', label: 'Matte' },
    { id: 'glossy', label: 'Glossy' },
];

export const SHAPE_OPTIONS: { id: StickerShape; label: string }[] = [
    { id: 'die-cut', label: 'Die-cut' },
    { id: 'circle', label: 'Circle' },
    { id: 'square', label: 'Square' },
    { id: 'rectangle', label: 'Rectangle' },
    { id: 'custom', label: 'Custom' },
];

export const CUSTOM_SHAPE_OPTIONS: { id: CustomShapeKind; label: string }[] = [
    { id: 'star', label: 'Star' },
    { id: 'heart', label: 'Heart' },
    { id: 'hexagon', label: 'Hexagon' },
    { id: 'shield', label: 'Shield' },
    { id: 'cloud', label: 'Cloud' },
];

export const ADDABLE_SHAPES: { id: ShapeKind; label: string }[] = [
    { id: 'rect', label: 'Square' },
    { id: 'rounded-rect', label: 'Rounded' },
    { id: 'circle', label: 'Circle' },
    { id: 'ellipse', label: 'Oval' },
    { id: 'triangle', label: 'Triangle' },
    { id: 'star', label: 'Star' },
    { id: 'heart', label: 'Heart' },
    { id: 'hexagon', label: 'Hexagon' },
    { id: 'line', label: 'Line' },
    { id: 'arrow', label: 'Arrow' },
];

export const EMOJI_SET = [
    '😀', '😎', '🤩', '😍', '🥳', '😇', '🤗', '😜',
    '🔥', '⭐', '✨', '💫', '❤️', '💜', '💙', '💚',
    '🌈', '☀️', '🌙', '⚡', '🌸', '🍀', '🎵', '🎯',
    '🚀', '🎨', '📸', '💡', '🏆', '💎', '🍕', '☕',
    '🐶', '🐱', '🦋', '🌊', '🌴', '🎈', '🎉', '👑',
];

export interface StickerIconDef {
    id: string;
    label: string;
    viewBox: string;
    path: string;
}

export const STICKER_ICONS: StickerIconDef[] = [
    {
        id: 'star',
        label: 'Star',
        viewBox: '0 0 24 24',
        path: 'M12 2l2.9 6.9L22 10l-5 4.4L18.2 22 12 18.6 5.8 22 7 14.4 2 10l7.1-1.1z',
    },
    {
        id: 'heart',
        label: 'Heart',
        viewBox: '0 0 24 24',
        path: 'M12 21s-6.7-4.4-9.3-8.1C.4 10 1.1 6.4 4.1 5.1 6.4 4.1 8.7 5 12 8c3.3-3 5.6-3.9 7.9-2.9 3 1.3 3.7 4.9 1.4 7.8C18.7 16.6 12 21 12 21z',
    },
    {
        id: 'bolt',
        label: 'Bolt',
        viewBox: '0 0 24 24',
        path: 'M13 2L4 14h7l-1 8 10-14h-7l0-6z',
    },
    {
        id: 'leaf',
        label: 'Leaf',
        viewBox: '0 0 24 24',
        path: 'M5 19c8-1 14-8 15-16-8 1-15 8-15 16zm0 0c3-6 8-11 14-14',
    },
    {
        id: 'music',
        label: 'Music',
        viewBox: '0 0 24 24',
        path: 'M9 18a3 3 0 1 0 0 1V7l10-2v10a3 3 0 1 0 0 1V4L9 6v12z',
    },
    {
        id: 'camera',
        label: 'Camera',
        viewBox: '0 0 24 24',
        path: 'M9 5l1.5-2h3L15 5h4a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4zm3 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    },
    {
        id: 'pin',
        label: 'Pin',
        viewBox: '0 0 24 24',
        path: 'M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12zm0-9a3 3 0 1 1 0-6 3 3 0 0 1 0 6z',
    },
    {
        id: 'sun',
        label: 'Sun',
        viewBox: '0 0 24 24',
        path: 'M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0-5v3m0 14v3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1M2 12h3m14 0h3M4.2 19.8l2.1-2.1m11.4-11.4 2.1-2.1',
    },
    {
        id: 'moon',
        label: 'Moon',
        viewBox: '0 0 24 24',
        path: 'M16 12a7 7 0 0 1-8.7 6.8A7 7 0 1 0 16 12z',
    },
    {
        id: 'check',
        label: 'Check',
        viewBox: '0 0 24 24',
        path: 'M20 6L9 17l-5-5',
    },
    {
        id: 'smile',
        label: 'Smile',
        viewBox: '0 0 24 24',
        path: 'M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm-4-8c.8 1.7 2.3 3 4 3s3.2-1.3 4-3M9 10h.01M15 10h.01',
    },
    {
        id: 'crown',
        label: 'Crown',
        viewBox: '0 0 24 24',
        path: 'M3 17l2-10 5 5 2-7 2 7 5-5 2 10H3zm0 3h18',
    },
    {
        id: 'flame',
        label: 'Flame',
        viewBox: '0 0 24 24',
        path: 'M12 2s5 5 5 10a5 5 0 0 1-10 0c0-2 2-5 3-6 0 3 2 3 2 3s-1-4 0-7z',
    },
    {
        id: 'spark',
        label: 'Spark',
        viewBox: '0 0 24 24',
        path: 'M12 2l1.2 6.8L20 10l-6.8 1.2L12 18l-1.2-6.8L4 10l6.8-1.2z',
    },
    {
        id: 'cloud',
        label: 'Cloud',
        viewBox: '0 0 24 24',
        path: 'M7 18a5 5 0 0 1-.4-10 6 6 0 0 1 11.3 1.7A4 4 0 0 1 18 18H7z',
    },
    {
        id: 'diamond',
        label: 'Diamond',
        viewBox: '0 0 24 24',
        path: 'M3 9l4-6h10l4 6-9 13L3 9zm0 0h18',
    },
];

export const DEFAULT_COLORS = [
    '#111111',
    '#175195',
    '#06853D',
    '#E11D48',
    '#F59E0B',
    '#7C3AED',
    '#0EA5E9',
    '#FFFFFF',
];
