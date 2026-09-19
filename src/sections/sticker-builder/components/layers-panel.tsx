import { useState } from 'react';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { alpha } from '@mui/material/styles';

import type { StickerBuilderApi } from '../hooks/use-sticker-builder';
import { BRAND_BLUE } from '../constants';
import { getElementLabel } from '../utils';

type LayersPanelProps = {
    api: StickerBuilderApi;
};

export function LayersPanel({ api }: LayersPanelProps) {
    const { design, selectedId, setSelectedId, toggleLock, duplicateSelected, deleteSelected, reorderLayers } = api;
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const layers = [...design.elements].reverse();

    return (
        <Stack spacing={1}>
            <Typography variant="subtitle2" fontWeight={700}>
                Layers
            </Typography>
            {layers.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                    Added elements will appear here. Drag to change stacking order.
                </Typography>
            )}
            {layers.map((element, visualIndex) => {
                const actualIndex = design.elements.length - 1 - visualIndex;
                const active = element.id === selectedId;
                return (
                    <Box
                        key={element.id}
                        draggable
                        onDragStart={() => setDragIndex(actualIndex)}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={() => {
                            if (dragIndex === null || dragIndex === actualIndex) return;
                            reorderLayers(dragIndex, actualIndex);
                            setDragIndex(null);
                        }}
                        onClick={() => setSelectedId(element.id)}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            px: 1,
                            py: 0.75,
                            borderRadius: 1.5,
                            cursor: 'pointer',
                            bgcolor: active ? alpha(BRAND_BLUE, 0.08) : 'transparent',
                            border: `1px solid ${active ? alpha(BRAND_BLUE, 0.24) : alpha('#0f172a', 0.06)}`,
                        }}
                    >
                        <DragIndicatorIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                        <Typography noWrap sx={{ flex: 1, fontSize: 13, fontWeight: active ? 700 : 500 }}>
                            {getElementLabel(element)}
                        </Typography>
                        <IconButton
                            size="small"
                            onClick={(event) => {
                                event.stopPropagation();
                                toggleLock(element.id);
                            }}
                        >
                            {element.locked ? (
                                <LockOutlinedIcon sx={{ fontSize: 16 }} />
                            ) : (
                                <LockOpenOutlinedIcon sx={{ fontSize: 16 }} />
                            )}
                        </IconButton>
                        <IconButton
                            size="small"
                            disabled={!active}
                            onClick={(event) => {
                                event.stopPropagation();
                                duplicateSelected();
                            }}
                        >
                            <ContentCopyIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                        <IconButton
                            size="small"
                            disabled={!active || element.locked}
                            onClick={(event) => {
                                event.stopPropagation();
                                deleteSelected();
                            }}
                        >
                            <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Box>
                );
            })}
        </Stack>
    );
}
