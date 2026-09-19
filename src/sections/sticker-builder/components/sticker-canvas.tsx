import { useRef } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import type { DesignElement, TransformHandle } from '../types';

import { GRID_SIZE, BRAND_BLUE, STICKER_BORDER, MIN_ELEMENT_SIZE, PRINT_SAFE_INSET } from '../constants';
import { getStickerClipPath } from '../utils';
import { ElementVisual } from './element-visual';

import type { StickerBuilderApi } from '../hooks/use-sticker-builder';

const HANDLES: TransformHandle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

function cursorForHandle(handle: TransformHandle): string {
    if (handle === 'rotate') return 'grab';
    if (handle === 'n' || handle === 's') return 'ns-resize';
    if (handle === 'e' || handle === 'w') return 'ew-resize';
    if (handle === 'ne' || handle === 'sw') return 'nesw-resize';
    return 'nwse-resize';
}

type StickerCanvasProps = {
    api: StickerBuilderApi;
};

export function StickerCanvas({ api }: StickerCanvasProps) {
    const stageRef = useRef<HTMLDivElement | null>(null);
    const {
        design,
        selected,
        selectedId,
        setSelectedId,
        zoom,
        snapToGrid,
        editingTextId,
        setEditingTextId,
        updateElement,
        beginTransform,
        snapIfNeeded,
    } = api;

    const clipPath = getStickerClipPath(design.sticker.shape, design.sticker.customShape);

    const toDesignPoint = (clientX: number, clientY: number) => {
        const rect = stageRef.current?.getBoundingClientRect();
        if (!rect) return { x: 0, y: 0 };
        return {
            x: ((clientX - rect.left) / rect.width) * design.width,
            y: ((clientY - rect.top) / rect.height) * design.height,
        };
    };

    const startDrag = (event: React.PointerEvent, element: DesignElement) => {
        if (element.locked) {
            setSelectedId(element.id);
            return;
        }
        event.stopPropagation();
        event.preventDefault();
        setSelectedId(element.id);
        beginTransform();
        const origin = toDesignPoint(event.clientX, event.clientY);
        const startX = element.x;
        const startY = element.y;

        const onMove = (moveEvent: PointerEvent) => {
            const point = toDesignPoint(moveEvent.clientX, moveEvent.clientY);
            updateElement(
                element.id,
                {
                    x: snapIfNeeded(startX + point.x - origin.x),
                    y: snapIfNeeded(startY + point.y - origin.y),
                },
                false
            );
        };

        const onUp = () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
        };

        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
    };

    const startResize = (event: React.PointerEvent, handle: TransformHandle, element: DesignElement) => {
        event.stopPropagation();
        event.preventDefault();
        if (element.locked) return;
        beginTransform();
        const origin = toDesignPoint(event.clientX, event.clientY);
        const start = { ...element };
        const keepRatio = element.type === 'image' || element.type === 'emoji' || element.type === 'icon';
        const ratio = start.width / start.height || 1;

        const onMove = (moveEvent: PointerEvent) => {
            const point = toDesignPoint(moveEvent.clientX, moveEvent.clientY);
            const dx = point.x - origin.x;
            const dy = point.y - origin.y;
            let x = start.x;
            let y = start.y;
            let width = start.width;
            let height = start.height;

            if (handle.includes('e')) width = start.width + dx;
            if (handle.includes('s')) height = start.height + dy;
            if (handle.includes('w')) {
                width = start.width - dx;
                x = start.x + dx;
            }
            if (handle.includes('n')) {
                height = start.height - dy;
                y = start.y + dy;
            }

            if (keepRatio && (handle === 'nw' || handle === 'ne' || handle === 'se' || handle === 'sw')) {
                height = width / ratio;
                if (handle.includes('n')) y = start.y + start.height - height;
                if (handle.includes('w')) x = start.x + start.width - width;
            }

            width = Math.max(MIN_ELEMENT_SIZE, width);
            height = Math.max(MIN_ELEMENT_SIZE, height);

            updateElement(
                element.id,
                {
                    x: snapIfNeeded(x),
                    y: snapIfNeeded(y),
                    width: snapIfNeeded(width),
                    height: snapIfNeeded(height),
                },
                false
            );
        };

        const onUp = () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
        };

        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
    };

    const startRotate = (event: React.PointerEvent, element: DesignElement) => {
        event.stopPropagation();
        event.preventDefault();
        if (element.locked) return;
        beginTransform();
        const center = {
            x: element.x + element.width / 2,
            y: element.y + element.height / 2,
        };

        const onMove = (moveEvent: PointerEvent) => {
            const point = toDesignPoint(moveEvent.clientX, moveEvent.clientY);
            const angle = (Math.atan2(point.y - center.y, point.x - center.x) * 180) / Math.PI + 90;
            updateElement(element.id, { rotation: Math.round(angle) }, false);
        };

        const onUp = () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
        };

        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
    };

    return (
        <Box
            sx={{
                position: 'relative',
                flex: 1,
                minWidth: 0,
                minHeight: { xs: 360, md: 0 },
                overflow: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#eef2f6',
                backgroundImage:
                    'linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)',
                backgroundSize: '24px 24px',
                backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0',
            }}
            onPointerDown={() => {
                setSelectedId(null);
                setEditingTextId(null);
            }}
        >
            <Box
                ref={stageRef}
                sx={{
                    position: 'relative',
                    width: design.width,
                    height: design.height,
                    flexShrink: 0,
                    transform: `scale(${zoom})`,
                    transformOrigin: 'center center',
                    my: 6,
                }}
            >
                {snapToGrid && (
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            pointerEvents: 'none',
                            opacity: 0.22,
                            backgroundImage: `linear-gradient(to right, ${alpha('#111827', 0.18)} 1px, transparent 1px), linear-gradient(to bottom, ${alpha('#111827', 0.18)} 1px, transparent 1px)`,
                            backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
                            zIndex: 0,
                        }}
                    />
                )}

                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        bgcolor: '#ffffff',
                        clipPath,
                        boxShadow: `0 18px 40px ${alpha('#0f172a', 0.18)}`,
                    }}
                />

                <Box
                    sx={{
                        position: 'absolute',
                        inset: STICKER_BORDER,
                        border: `1px dashed ${alpha(BRAND_BLUE, 0.45)}`,
                        pointerEvents: 'none',
                        zIndex: 2,
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        inset: STICKER_BORDER + PRINT_SAFE_INSET,
                        border: `1px dashed ${alpha('#e11d48', 0.28)}`,
                        pointerEvents: 'none',
                        zIndex: 2,
                    }}
                />

                {design.elements.map((element) => {
                    const isSelected = element.id === selectedId;
                    return (
                        <Box
                            key={element.id}
                            onPointerDown={(event) => startDrag(event, element)}
                            onDoubleClick={() => {
                                if (element.type === 'text' && !element.locked) {
                                    setSelectedId(element.id);
                                    setEditingTextId(element.id);
                                }
                            }}
                            sx={{
                                position: 'absolute',
                                left: element.x,
                                top: element.y,
                                width: element.width,
                                height: element.height,
                                opacity: element.opacity,
                                transform: `rotate(${element.rotation}deg)`,
                                transformOrigin: 'center center',
                                cursor: element.locked ? 'default' : 'move',
                                zIndex: isSelected ? 5 : 3,
                                outline: isSelected ? `2px solid ${BRAND_BLUE}` : 'none',
                                outlineOffset: 2,
                            }}
                        >
                            <ElementVisual
                                element={element}
                                editing={editingTextId === element.id}
                                onTextChange={(value) => updateElement(element.id, { content: value } as Partial<DesignElement>, false)}
                                onTextBlur={() => setEditingTextId(null)}
                            />
                        </Box>
                    );
                })}

                {selected && (
                    <Box
                        sx={{
                            position: 'absolute',
                            left: selected.x,
                            top: selected.y,
                            width: selected.width,
                            height: selected.height,
                            transform: `rotate(${selected.rotation}deg)`,
                            transformOrigin: 'center center',
                            pointerEvents: 'none',
                            zIndex: 6,
                        }}
                    >
                        {HANDLES.map((handle) => {
                            const style = handlePosition(handle);
                            return (
                                <Box
                                    key={handle}
                                    onPointerDown={(event) => startResize(event, handle, selected)}
                                    sx={{
                                        position: 'absolute',
                                        width: 12,
                                        height: 12,
                                        bgcolor: '#ffffff',
                                        border: `2px solid ${BRAND_BLUE}`,
                                        borderRadius: 0.4,
                                        pointerEvents: 'auto',
                                        cursor: cursorForHandle(handle),
                                        ...style,
                                    }}
                                />
                            );
                        })}
                        <Box
                            onPointerDown={(event) => startRotate(event, selected)}
                            sx={{
                                position: 'absolute',
                                left: '50%',
                                top: -28,
                                width: 14,
                                height: 14,
                                ml: '-7px',
                                borderRadius: '50%',
                                bgcolor: BRAND_BLUE,
                                pointerEvents: 'auto',
                                cursor: 'grab',
                            }}
                        />
                    </Box>
                )}
            </Box>

            <Typography
                sx={{
                    position: 'absolute',
                    bottom: 12,
                    left: 16,
                    fontSize: 12,
                    color: 'text.secondary',
                    bgcolor: alpha('#ffffff', 0.86),
                    px: 1,
                    py: 0.4,
                    borderRadius: 1,
                }}
            >
                Blue dashed line is the sticker border · red is the safe print area
            </Typography>
        </Box>
    );
}

function handlePosition(handle: TransformHandle): Record<string, string | number> {
    const map: Record<Exclude<TransformHandle, 'rotate'>, Record<string, string | number>> = {
        nw: { left: -6, top: -6 },
        n: { left: '50%', top: -6, ml: '-6px' },
        ne: { right: -6, top: -6 },
        e: { right: -6, top: '50%', mt: '-6px' },
        se: { right: -6, bottom: -6 },
        s: { left: '50%', bottom: -6, ml: '-6px' },
        sw: { left: -6, bottom: -6 },
        w: { left: -6, top: '50%', mt: '-6px' },
    };
    return handle === 'rotate' ? {} : map[handle];
}
