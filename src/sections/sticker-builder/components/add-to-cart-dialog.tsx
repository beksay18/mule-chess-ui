import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import type { StickerDesign, PriceBreakdown, ValidationResult } from '../types';
import { BRAND_BLUE, BRAND_GREEN } from '../constants';
import { getSizeLabel } from '../utils';

type AddToCartDialogProps = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    design: StickerDesign;
    previewUrl: string;
    price: PriceBreakdown;
    validation: ValidationResult;
};

export function AddToCartDialog({
    open,
    onClose,
    onConfirm,
    design,
    previewUrl,
    price,
    validation,
}: AddToCartDialogProps) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle fontWeight={800}>Add to cart</DialogTitle>
            <DialogContent>
                <Stack spacing={2}>
                    {!validation.valid &&
                        validation.issues.map((issue) => (
                            <Alert key={issue.code} severity="warning">
                                {issue.message}
                            </Alert>
                        ))}
                    <Box
                        sx={{
                            borderRadius: 2,
                            p: 3,
                            display: 'flex',
                            justifyContent: 'center',
                            backgroundImage:
                                'linear-gradient(45deg, #eceff3 25%, transparent 25%), linear-gradient(-45deg, #eceff3 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #eceff3 75%), linear-gradient(-45deg, transparent 75%, #eceff3 75%)',
                            backgroundSize: '18px 18px',
                        }}
                    >
                        {previewUrl && (
                            <Box
                                component="img"
                                src={previewUrl}
                                alt="Final sticker preview"
                                sx={{
                                    maxWidth: 260,
                                    maxHeight: 260,
                                    filter: 'drop-shadow(0 16px 18px rgba(15,23,42,0.22))',
                                }}
                            />
                        )}
                    </Box>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 1.5,
                            p: 2,
                            borderRadius: 2,
                            bgcolor: alpha(BRAND_BLUE, 0.04),
                        }}
                    >
                        <Spec label="Size" value={getSizeLabel(design.sticker)} />
                        <Spec label="Quantity" value={String(design.sticker.quantity)} />
                        <Spec label="Material" value={design.sticker.material} />
                        <Spec label="Finish" value={design.sticker.finish} />
                        <Spec label="Cut" value={design.sticker.shape} />
                        {design.sticker.qrUrl && <Spec label="QR link" value={design.sticker.qrUrl} />}
                        <Spec label="Price" value={`$${price.total.toFixed(2)}`} />
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} sx={{ textTransform: 'none' }}>
                    Keep editing
                </Button>
                <Button
                    variant="contained"
                    disabled={!validation.valid}
                    onClick={onConfirm}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 700,
                        bgcolor: BRAND_BLUE,
                        '&:hover': { bgcolor: BRAND_GREEN },
                    }}
                >
                    Confirm add to cart
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function Spec({ label, value }: { label: string; value: string }) {
    return (
        <Box>
            <Typography variant="caption" color="text.secondary">
                {label}
            </Typography>
            <Typography fontWeight={700} sx={{ textTransform: 'capitalize' }}>
                {value}
            </Typography>
        </Box>
    );
}
