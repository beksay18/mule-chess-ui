import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

const BRAND_BLUE = '#175195';

const stickerChipSx = {
    position: 'relative' as const,
    display: 'inline-block',
    px: { xs: 2, md: 2.5 },
    py: { xs: 0.5, md: 0.75 },
    mx: 0.5,
    fontWeight: 800,
    color: BRAND_BLUE,
    border: `2px dashed ${alpha(BRAND_BLUE, 0.3)}`,
    borderRadius: 2.5,
    transform: 'rotate(-2deg)',
};

export default function BlogTitle() {
    const theme = useTheme();

    return (
        <Box sx={{ bgcolor: '#ffffff', pt: { xs: 5, md: 8 }, pb: { xs: 3, md: 4 } }}>
            <Container maxWidth="md">
                <Stack spacing={2} alignItems="center" sx={{ textAlign: 'center' }}>
                    <Typography
                        sx={{
                            fontWeight: 700,
                            fontSize: '0.8125rem',
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            color: BRAND_BLUE,
                        }}
                    >
                        From the CG Sticker House
                    </Typography>
                    <Box component="h1" sx={{ m: 0, maxWidth: 540 }}>
                        <Typography
                            component="span"
                            sx={{
                                display: 'block',
                                fontWeight: 800,
                                letterSpacing: '-0.03em',
                                fontSize: { xs: '2rem', md: '2.75rem' },
                                lineHeight: 1.15,
                                color: theme.palette.grey[900],
                                mb: 1.5,
                            }}
                        >
                            Tips, ideas &{' '}
                            <Box component="span" sx={stickerChipSx}>
                                inspiration
                            </Box>
                        </Typography>
                        <Typography
                            sx={{
                                color: 'text.secondary',
                                fontSize: { xs: '1rem', md: '1.0625rem' },
                                lineHeight: 1.65,
                            }}
                        >
                            Guides on design, marketing, and getting the most from your custom
                            stickers.
                        </Typography>
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
}
