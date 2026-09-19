import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import type { StickerDesign } from '../types';
import { getSizeLabel } from '../utils';

type LivePreviewProps = {
    previewUrl: string;
    design: StickerDesign;
};

export function LivePreview({ previewUrl, design }: LivePreviewProps) {
    return (
        <Box>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                Finished sticker
            </Typography>
            <Box
                sx={{
                    borderRadius: 2,
                    p: 3,
                    minHeight: 220,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundImage:
                        'linear-gradient(45deg, #eceff3 25%, transparent 25%), linear-gradient(-45deg, #eceff3 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #eceff3 75%), linear-gradient(-45deg, transparent 75%, #eceff3 75%)',
                    backgroundSize: '18px 18px',
                    backgroundPosition: '0 0, 0 9px, 9px -9px, -9px 0',
                    border: `1px solid ${alpha('#0f172a', 0.06)}`,
                }}
            >
                {previewUrl ? (
                    <Box
                        component="img"
                        src={previewUrl}
                        alt="Sticker preview"
                        sx={{
                            maxWidth: 1,
                            maxHeight: 240,
                            filter: 'drop-shadow(0 16px 18px rgba(15,23,42,0.22))',
                        }}
                    />
                ) : (
                    <Typography variant="body2" color="text.secondary">
                        Add artwork to see a realistic preview.
                    </Typography>
                )}
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                {getSizeLabel(design.sticker)} · {design.sticker.material} · {design.sticker.finish} ·{' '}
                {design.sticker.shape}
            </Typography>
        </Box>
    );
}
