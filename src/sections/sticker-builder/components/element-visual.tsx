import Box from '@mui/material/Box';

import type { ShapeKind, DesignElement } from '../types';

import { STICKER_ICONS } from '../constants';
import { getDisplayImageSrc } from '../utils';

function shapeSvgPath(kind: ShapeKind): string {
    switch (kind) {
        case 'circle':
            return 'M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20z';
        case 'ellipse':
            return 'M12 4a10 8 0 1 1 0 16 10 8 0 0 1 0-16z';
        case 'rounded-rect':
            return 'M5 3h14a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3z';
        case 'triangle':
            return 'M12 3l10 18H2L12 3z';
        case 'star':
            return 'M12 2l2.9 6.9L22 10l-5 4.4L18.2 22 12 18.6 5.8 22 7 14.4 2 10l7.1-1.1z';
        case 'heart':
            return 'M12 21s-6.7-4.4-9.3-8.1C.4 10 1.1 6.4 4.1 5.1 6.4 4.1 8.7 5 12 8c3.3-3 5.6-3.9 7.9-2.9 3 1.3 3.7 4.9 1.4 7.8C18.7 16.6 12 21 12 21z';
        case 'hexagon':
            return 'M7 3h10l5 9-5 9H7L2 12 7 3z';
        case 'line':
            return 'M2 12h20';
        case 'arrow':
            return 'M3 10h11V6l7 6-7 6v-4H3z';
        case 'rect':
        default:
            return 'M3 3h18v18H3z';
    }
}

function CurvedText({
    id,
    content,
    color,
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle,
    letterSpacing,
    outlineColor,
    outlineWidth,
    curve,
}: {
    id: string;
    content: string;
    color: string;
    fontFamily: string;
    fontSize: number;
    fontWeight: string;
    fontStyle: string;
    letterSpacing: number;
    outlineColor: string;
    outlineWidth: number;
    curve: number;
}) {
    const sweep = Math.max(40, Math.min(160, 80 + Math.abs(curve) * 0.6));
    const invert = curve < 0;
    const path = invert
        ? `M 10 ${sweep} A 180 180 0 0 1 390 ${sweep}`
        : `M 10 40 A 180 180 0 0 0 390 40`;

    return (
        <svg viewBox="0 0 400 140" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
            <defs>
                <path id={`${id}-curve`} d={path} fill="none" />
            </defs>
            <text
                fill={color}
                stroke={outlineWidth ? outlineColor : 'none'}
                strokeWidth={outlineWidth * 2}
                style={{
                    fontFamily,
                    fontSize,
                    fontWeight,
                    fontStyle,
                    letterSpacing,
                    paintOrder: 'stroke',
                }}
            >
                <textPath href={`#${id}-curve`} startOffset="50%" textAnchor="middle">
                    {content}
                </textPath>
            </text>
        </svg>
    );
}

type ElementVisualProps = {
    element: DesignElement;
    editing?: boolean;
    onTextChange?: (value: string) => void;
    onTextBlur?: () => void;
};

export function ElementVisual({ element, editing, onTextChange, onTextBlur }: ElementVisualProps) {
    if (element.type === 'text') {
        if (editing) {
            return (
                <Box
                    component="textarea"
                    value={element.content}
                    autoFocus
                    onChange={(event) => onTextChange?.(event.target.value)}
                    onBlur={onTextBlur}
                    onPointerDown={(event) => event.stopPropagation()}
                    sx={{
                        width: 1,
                        height: 1,
                        border: 0,
                        resize: 'none',
                        outline: 'none',
                        bgcolor: 'transparent',
                        color: element.color,
                        fontFamily: element.fontFamily,
                        fontSize: element.fontSize,
                        fontWeight: element.fontWeight,
                        fontStyle: element.fontStyle,
                        letterSpacing: `${element.letterSpacing}px`,
                        textAlign: element.textAlign,
                        lineHeight: 1.1,
                        p: 0,
                    }}
                />
            );
        }

        if (element.curve !== 0) {
            return (
                <CurvedText
                    id={element.id}
                    content={element.content}
                    color={element.color}
                    fontFamily={element.fontFamily}
                    fontSize={element.fontSize}
                    fontWeight={element.fontWeight}
                    fontStyle={element.fontStyle}
                    letterSpacing={element.letterSpacing}
                    outlineColor={element.outlineColor}
                    outlineWidth={element.outlineWidth}
                    curve={element.curve}
                />
            );
        }

        return (
            <Box
                sx={{
                    width: 1,
                    height: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent:
                        element.textAlign === 'center'
                            ? 'center'
                            : element.textAlign === 'right'
                              ? 'flex-end'
                              : 'flex-start',
                    color: element.color,
                    fontFamily: element.fontFamily,
                    fontSize: element.fontSize,
                    fontWeight: element.fontWeight,
                    fontStyle: element.fontStyle,
                    letterSpacing: `${element.letterSpacing}px`,
                    textAlign: element.textAlign,
                    lineHeight: 1.1,
                    WebkitTextStroke:
                        element.outlineWidth > 0
                            ? `${element.outlineWidth}px ${element.outlineColor}`
                            : undefined,
                    overflow: 'hidden',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                }}
            >
                {element.content}
            </Box>
        );
    }

    if (element.type === 'emoji') {
        return (
            <Box
                sx={{
                    width: 1,
                    height: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: Math.min(element.width, element.height) * 0.78,
                    lineHeight: 1,
                    userSelect: 'none',
                }}
            >
                {element.content}
            </Box>
        );
    }

    if (element.type === 'shape') {
        return (
            <Box
                component="svg"
                viewBox="0 0 24 24"
                sx={{ width: 1, height: 1, display: 'block', overflow: 'visible' }}
            >
                <path
                    d={shapeSvgPath(element.shape)}
                    fill={element.shape === 'line' ? 'none' : element.fill}
                    stroke={element.strokeWidth > 0 || element.shape === 'line' ? element.stroke : 'none'}
                    strokeWidth={element.shape === 'line' ? 2.4 : element.strokeWidth / 6}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />
            </Box>
        );
    }

    if (element.type === 'icon') {
        const icon = STICKER_ICONS.find((item) => item.id === element.iconId);
        return (
            <Box
                component="svg"
                viewBox={icon?.viewBox || '0 0 24 24'}
                sx={{ width: 1, height: 1, display: 'block' }}
            >
                <path
                    d={icon?.path || ''}
                    fill={element.color}
                    stroke={element.color}
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />
            </Box>
        );
    }

    const crop = element.crop;
    return (
        <Box
            sx={{
                width: 1,
                height: 1,
                overflow: 'hidden',
                clipPath: `inset(${crop.top * 100}% ${crop.right * 100}% ${crop.bottom * 100}% ${crop.left * 100}%)`,
                filter:
                    element.outlineWidth > 0
                        ? `drop-shadow(0 0 0 ${element.outlineWidth}px ${element.outlineColor})`
                        : undefined,
            }}
        >
            <Box
                component="img"
                src={getDisplayImageSrc(element)}
                alt={element.name}
                draggable={false}
                sx={{
                    width: 1,
                    height: 1,
                    objectFit: 'cover',
                    display: 'block',
                    pointerEvents: 'none',
                    userSelect: 'none',
                }}
            />
        </Box>
    );
}
