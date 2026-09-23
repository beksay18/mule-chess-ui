import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import type { Product } from 'src/api/product';

import type { StickerShape, StickerFinish, CustomShapeKind, StickerMaterial } from '../types';
import type { StickerBuilderApi } from '../hooks/use-sticker-builder';

import { SHAPE_OPTIONS, FINISH_OPTIONS, MATERIAL_OPTIONS, CUSTOM_SHAPE_OPTIONS, BRAND_BLUE, BRAND_GREEN } from '../constants';
import { sizeIdForDimension, getAllowedDimensions, getAllowedQuantities, getLockedMaterial } from '../product-limits';
import { quotePack, quoteQuantityTiers } from '../pricing';
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
    const lockedMaterial = getLockedMaterial(product);

    const [useCustomQuantity, setUseCustomQuantity] = useState(() => !quantities.includes(sticker.quantity));
    const [qrDraft, setQrDraft] = useState(sticker.qrUrl || '');
    const [qrError, setQrError] = useState('');
    const [qrBusy, setQrBusy] = useState(false);
    const matchingPreset = dimensions.find(
        (dimension) => dimension.width === inches.width && dimension.height === inches.height
    );
    const sizeValue = sticker.size === 'custom' || !matchingPreset ? 'custom' : `${matchingPreset.width}x${matchingPreset.height}`;
    const quantityIsPreset = quantities.includes(sticker.quantity) && !useCustomQuantity;
    const quantityQuotes = quoteQuantityTiers(sticker, quantities, product);
    const selectedQuote = quotePack(sticker, sticker.quantity, product);

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
            <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                    Quantity
                </Typography>
                <Stack spacing={0.75}>
                    {quantityQuotes.map((quote) => {
                        const selected = quantityIsPreset && quote.quantity === sticker.quantity;
                        return (
                            <Button
                                key={quote.quantity}
                                onClick={() => {
                                    setUseCustomQuantity(false);
                                    updateSticker({ quantity: quote.quantity });
                                }}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 1,
                                    px: 1.5,
                                    py: 1,
                                    minHeight: 44,
                                    borderRadius: 1.5,
                                    textTransform: 'none',
                                    color: 'text.primary',
                                    border: `1px solid ${selected ? BRAND_BLUE : alpha(BRAND_BLUE, 0.14)}`,
                                    bgcolor: selected ? alpha(BRAND_BLUE, 0.08) : '#fff',
                                    '&:hover': {
                                        borderColor: BRAND_BLUE,
                                        bgcolor: alpha(BRAND_BLUE, 0.05),
                                    },
                                }}
                            >
                                <Typography fontWeight={700} fontSize={13}>
                                    {quote.quantity.toLocaleString()} stickers
                                    {quote.recommended ? ' ★' : ''}
                                </Typography>
                                <Stack direction="row" spacing={1} alignItems="baseline">
                                    <Typography fontWeight={800} fontSize={13}>
                                        ${quote.total.toFixed(2)}
                                    </Typography>
                                    {quote.discountPercent > 0 && (
                                        <Typography fontSize={12} fontWeight={800} sx={{ color: BRAND_GREEN }}>
                                            −{quote.discountPercent.toFixed(1)}%
                                        </Typography>
                                    )}
                                </Stack>
                            </Button>
                        );
                    })}
                    <Button
                        onClick={() => {
                            setUseCustomQuantity(true);
                            updateSticker({ quantity: Math.min(sticker.quantity || 1, maxQuantity) });
                        }}
                        sx={{
                            justifyContent: 'flex-start',
                            px: 1.5,
                            py: 1,
                            minHeight: 44,
                            borderRadius: 1.5,
                            textTransform: 'none',
                            color: 'text.primary',
                            fontWeight: 700,
                            fontSize: 13,
                            border: `1px solid ${!quantityIsPreset ? BRAND_BLUE : alpha(BRAND_BLUE, 0.14)}`,
                            bgcolor: !quantityIsPreset ? alpha(BRAND_BLUE, 0.08) : '#fff',
                            '&:hover': {
                                borderColor: BRAND_BLUE,
                                bgcolor: alpha(BRAND_BLUE, 0.05),
                            },
                        }}
                    >
                        Custom quantity
                    </Button>
                </Stack>
            </Box>
            {!quantityIsPreset && (
                <Stack spacing={0.5}>
                    <TextField
                        size="small"
                        type="number"
                        label="Custom quantity"
                        value={sticker.quantity}
                        inputProps={{ min: 1, max: maxQuantity, step: 1 }}
                        error={sticker.quantity > maxQuantity}
                        helperText={
                            sticker.quantity > maxQuantity
                                ? `Max should be ${maxQuantity}`
                                : selectedQuote.discountPercent > 0
                                  ? `$${selectedQuote.total.toFixed(2)} · ${selectedQuote.discountPercent.toFixed(1)}% off vs 50-pack rate`
                                  : `$${selectedQuote.total.toFixed(2)} · max ${maxQuantity}`
                        }
                        onChange={(event) => updateSticker({ quantity: Number(event.target.value) })}
                    />
                </Stack>
            )}
            <TextField
                select
                size="small"
                label="Material"
                value={lockedMaterial ?? sticker.material}
                disabled={Boolean(lockedMaterial)}
                helperText={lockedMaterial ? 'Set by this sticker type' : undefined}
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
            <Box
                sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border: `1px solid ${alpha(BRAND_BLUE, 0.14)}`,
                    bgcolor: alpha(BRAND_BLUE, 0.04),
                }}
            >
                <Typography variant="h6" fontWeight={800} sx={{ color: BRAND_BLUE, lineHeight: 1.2 }}>
                    ${price.total.toFixed(2)}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                    ${price.perSticker.toFixed(2)} / sticker
                </Typography>
                {price.discountPercent > 0 && (
                    <Typography variant="caption" fontWeight={700} sx={{ color: BRAND_GREEN }} display="block">
                        −{price.discountPercent.toFixed(1)}% vs 50-pack rate
                    </Typography>
                )}
            </Box>
        </Stack>
    );
}
