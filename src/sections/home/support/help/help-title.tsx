import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { alpha, useTheme } from '@mui/material/styles';
import { useRouter } from '../../../../routes/hooks';

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
    transform: 'rotate(-3deg)',
};

export default function HelpTitle() {
    const theme = useTheme();
    const router = useRouter();

    return (
        <Box sx={{ bgcolor: '#ffffff', pt: { xs: 5, md: 8 }, pb: { xs: 3, md: 4 } }}>
            <Container maxWidth="md">
                <Stack spacing={3} alignItems="center" sx={{ textAlign: 'center' }}>
                    <Box component="h1" sx={{ m: 0, maxWidth: 520 }}>
                        <Typography
                            component="span"
                            sx={{
                                display: 'block',
                                fontWeight: 800,
                                letterSpacing: '-0.03em',
                                fontSize: { xs: '2rem', md: '2.5rem' },
                                lineHeight: 1.15,
                                color: theme.palette.grey[900],
                                mb: 1.5,
                            }}
                        >
                            How can we{' '}
                            <Box component="span" sx={stickerChipSx}>
                                help?
                            </Box>
                        </Typography>
                        <Typography
                            sx={{
                                color: 'text.secondary',
                                fontSize: { xs: '1rem', md: '1.0625rem' },
                                lineHeight: 1.65,
                            }}
                        >
                            Browse answers below or reach out — we&apos;re happy to assist with
                            orders, artwork, and shipping.
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        size="large"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => router.push('/contact-us')}
                        sx={{
                            px: 4,
                            py: 1.5,
                            fontWeight: 700,
                            fontSize: '1rem',
                            borderRadius: 50,
                            bgcolor: BRAND_BLUE,
                            textTransform: 'none',
                            boxShadow: `0 8px 24px ${alpha(BRAND_BLUE, 0.25)}`,
                            '&:hover': {
                                bgcolor: '#124578',
                                transform: 'translateY(-2px)',
                            },
                        }}
                    >
                        Email support
                    </Button>
                </Stack>
            </Container>
        </Box>
    );
}
