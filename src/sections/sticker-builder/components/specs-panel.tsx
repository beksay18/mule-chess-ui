import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import type { Product } from 'src/api/product';

import type { StickerShape, StickerFinish, CustomShapeKind, StickerMaterial } from '../types';
import type { StickerBuilderApi } from '../hooks/use-sticker-builder';

import { SHAPE_OPTIONS, FINISH_OPTIONS, MATERIAL_OPTIONS, CUSTOM_SHAPE_OPTIONS } from '../constants';
import { sizeIdForDimension, getAllowedDimensions, getAllowedQuantities } from '../product-limits';
import { isQrCodeProduct } from '../qr';
import { getSizeInches } from '../utils';

type SpecsPanelProps = {
    api: StickerBuilderApi;
    products: Product[];
    product: Product | null;
    onProductChange: (product: Product) => void;
};

export function SpecsPanel({ api, products, product, onProductChange }: SpecsPanelProps) {
    const { design, updateSticker, applyQrLink, price, limits } = api;
    const { sticker } = design;
    const inches = getSizeInches(sticker);
    const dimensions = getAllowedDimensions(limits);
    const quantities = getAllowedQuantities(limits);
    const maxWidth = limits?.maxWidth ?? 12;
    const maxHeight = limits?.maxHeight ?? 12;
    const maxQuantity = limits?.maxQuantity ?? 1000;
    const showQrField = isQrCodeProduct(product);

    const [useCustomQuantity, setUseCustomQuantity] = useState(() => !quantities.includes(sticker.quantity));
    const [qrDraft, setQrDraft] = useState(sticker.qrUrl || '');
    const [qrError, setQrError] = useState('');
    const [qrBusy, setQrBusy] = useState(false);
    const matchingPreset = dimensions.find(
        (dimension) => dimension.width === inches.width && dimension.height === inches.height
    );
    const sizeValue = sticker.size === 'custom' || !matchingPreset ? 'custom' : `${matchingPreset.width}x${matchingPreset.height}`;
    const quantityIsPreset = quantities.includes(sticker.quantity) && !useCustomQuantity;
    const quantityValue = quantityIsPreset ? String(sticker.quantity) : 'custom';

    useEffect(() => {
        setQrDraft(sticker.qrUrl || '');
        setQrError('');
    }, [product?.id, sticker.qrUrl]);

    const handleApplyQr = async () => {
        setQrBusy(true);
        setQrError('');
        try {
            await applyQrLink(qrDraft);
        } catch (error) {
            setQrError(error instanceof Error ? error.message : 'Could not generate that QR code.');
        } finally {
            setQrBusy(false);
        }
    };

    return (
        <Stack spacing={2}>
            <Typography variant="subtitle2" fontWeight={700}>
                Sticker specs
            </Typography>
            {products.length > 0 && (
                <TextField
                    select
                    size="small"
                    label="Sticker type"
                    value={product?.id ?? ''}
                    onChange={(event) => {
                        const next = products.find((item) => item.id === Number(event.target.value));
                        if (next) onProductChange(next);
                    }}
                >
                    {products.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                            {item.name}
                        </MenuItem>
                    ))}
                </TextField>
            )}
            {showQrField && (
                <Stack spacing={1}>
                    <TextField
                        size="small"
                        label="QR link"
                        placeholder="https://your-site.com"
                        value={qrDraft}
                        error={Boolean(qrError)}
                        helperText={qrError || 'This link becomes a QR code next to your sticker.'}
                        onChange={(event) => {
                            setQrDraft(event.target.value);
                            setQrError('');
                        }}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                event.preventDefault();
                                void handleApplyQr();
                            }
                        }}
                    />
                    <Button
                        variant="contained"
                        size="small"
                        disabled={qrBusy || !qrDraft.trim()}
                        onClick={() => void handleApplyQr()}
                        sx={{ textTransform: 'none', fontWeight: 700 }}
                    >
                        {sticker.qrUrl ? 'Update QR code' : 'Add QR next to sticker'}
                    </Button>
                </Stack>
            )}
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
                value={sizeValue}
                onChange={(event) => {
                    const value = event.target.value;
                    if (value === 'custom') {
                        updateSticker({
                            size: 'custom',
                            customWidth: Math.min(inches.width, maxWidth),
                            customHeight: Math.min(inches.height, maxHeight),
                        });
                        return;
                    }
                    const [width, height] = value.split('x').map(Number);
                    updateSticker({
                        size: sizeIdForDimension(width, height),
                        customWidth: width,
                        customHeight: height,
                    });
                }}
            >
                {dimensions.map((dimension) => (
                    <MenuItem key={`${dimension.width}x${dimension.height}`} value={`${dimension.width}x${dimension.height}`}>
                        {dimension.width}&quot; × {dimension.height}&quot;
                    </MenuItem>
                ))}
                <MenuItem value="custom">Custom</MenuItem>
            </TextField>
            {sizeValue === 'custom' && (
                <Stack direction="row" spacing={1}>
                    <TextField
                        size="small"
                        type="number"
                        label="Width (in)"
                        value={sticker.customWidth ?? inches.width}
                        inputProps={{ min: 0.5, max: maxWidth, step: 0.25 }}
                        error={(sticker.customWidth ?? inches.width) > maxWidth}
                        helperText={`Max should be ${maxWidth}"`}
                        onChange={(event) =>
                            updateSticker({
                                size: 'custom',
                                customWidth: Number(event.target.value),
                            })
                        }
                    />
                    <TextField
                        size="small"
                        type="number"
                        label="Height (in)"
                        value={sticker.customHeight ?? inches.height}
                        inputProps={{ min: 0.5, max: maxHeight, step: 0.25 }}
                        error={(sticker.customHeight ?? inches.height) > maxHeight}
                        helperText={`Max should be ${maxHeight}"`}
                        onChange={(event) =>
                            updateSticker({
                                size: 'custom',
                                customHeight: Number(event.target.value),
                            })
                        }
                    />
                </Stack>
            )}
            <TextField
                select
                size="small"
                label="Quantity"
                value={quantityValue}
                onChange={(event) => {
                    const value = event.target.value;
                    if (value === 'custom') {
                        setUseCustomQuantity(true);
                        updateSticker({ quantity: Math.min(sticker.quantity || 1, maxQuantity) });
                        return;
                    }
                    setUseCustomQuantity(false);
                    updateSticker({ quantity: Number(value) });
                }}
            >
                {quantities.map((quantity) => (
                    <MenuItem key={quantity} value={String(quantity)}>
                        {quantity}
                    </MenuItem>
                ))}
                <MenuItem value="custom">Custom</MenuItem>
            </TextField>
            {!quantityIsPreset && (
                <Stack spacing={0.5}>
                    <TextField
                        size="small"
                        type="number"
                        label="Custom quantity"
                        value={sticker.quantity}
                        inputProps={{ min: 1, max: maxQuantity, step: 1 }}
                        error={sticker.quantity > maxQuantity}
                        helperText={`Max should be ${maxQuantity}`}
                        onChange={(event) => updateSticker({ quantity: Number(event.target.value) })}
                    />
                </Stack>
            )}
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
