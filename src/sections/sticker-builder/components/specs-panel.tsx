import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import type { StickerShape, StickerFinish, StickerSizeId, CustomShapeKind, StickerMaterial } from '../types';
import type { StickerBuilderApi } from '../hooks/use-sticker-builder';

import {
    SIZE_OPTIONS,
    SHAPE_OPTIONS,
    FINISH_OPTIONS,
    MATERIAL_OPTIONS,
    QUANTITY_OPTIONS,
    CUSTOM_SHAPE_OPTIONS,
} from '../constants';

type SpecsPanelProps = {
    api: StickerBuilderApi;
};

export function SpecsPanel({ api }: SpecsPanelProps) {
    const { design, updateSticker, price } = api;
    const { sticker } = design;

    return (
        <Stack spacing={2}>
            <Typography variant="subtitle2" fontWeight={700}>
                Sticker specs
            </Typography>
            <TextField
                select
                size="small"
                label="Cut type"
                value={sticker.shape}
                onChange={(event) => updateSticker({ shape: event.target.value as StickerShape })}
            >
                {SHAPE_OPTIONS.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
            {sticker.shape === 'custom' && (
                <TextField
                    select
                    size="small"
                    label="Custom shape"
                    value={sticker.customShape || 'star'}
                    onChange={(event) => updateSticker({ customShape: event.target.value as CustomShapeKind })}
                >
                    {CUSTOM_SHAPE_OPTIONS.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            )}
            <TextField
                select
                size="small"
                label="Size"
                value={sticker.size}
                onChange={(event) => updateSticker({ size: event.target.value as StickerSizeId })}
            >
                {SIZE_OPTIONS.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
            {sticker.size === 'custom' && (
                <Stack direction="row" spacing={1}>
                    <TextField
                        size="small"
                        type="number"
                        label='Width "'
                        value={sticker.customWidth ?? 3}
                        inputProps={{ min: 0.5, max: 12, step: 0.25 }}
                        onChange={(event) => updateSticker({ customWidth: Number(event.target.value) })}
                    />
                    <TextField
                        size="small"
                        type="number"
                        label='Height "'
                        value={sticker.customHeight ?? 3}
                        inputProps={{ min: 0.5, max: 12, step: 0.25 }}
                        onChange={(event) => updateSticker({ customHeight: Number(event.target.value) })}
                    />
                </Stack>
            )}
            <TextField
                select
                size="small"
                label="Quantity"
                value={sticker.quantity}
                onChange={(event) => updateSticker({ quantity: Number(event.target.value) })}
            >
                {QUANTITY_OPTIONS.map((quantity) => (
                    <MenuItem key={quantity} value={quantity}>
                        {quantity}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                select
                size="small"
                label="Material"
                value={sticker.material}
                onChange={(event) => updateSticker({ material: event.target.value as StickerMaterial })}
            >
                {MATERIAL_OPTIONS.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                        {option.label} — {option.hint}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                select
                size="small"
                label="Finish"
                value={sticker.finish}
                onChange={(event) => updateSticker({ finish: event.target.value as StickerFinish })}
            >
                {FINISH_OPTIONS.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
            <Box>
                <Typography variant="caption" color="text.secondary">
                    Estimated total
                </Typography>
                <Typography variant="h6" fontWeight={800}>
                    ${price.total.toFixed(2)}
                </Typography>
                {price.discountPercent > 0 && (
                    <Typography variant="caption" color="success.main">
                        {price.discountPercent}% quantity discount applied
                    </Typography>
                )}
            </Box>
        </Stack>
    );
}
