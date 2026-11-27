import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { alpha } from '@mui/material/styles';
import { useRouter } from '../../routes/hooks';

const BRAND_BLUE = '#175195';
const BRAND_BLUE_LIGHT = '#2d8fd5';

export default function HelpOverview() {
    const router = useRouter();

    return (
        <Box sx={{ bgcolor: '#ffffff', py: { xs: 4, md: 6 } }}>
            <Container maxWidth="lg">
                <Box
                    sx={{
                        borderRadius: 4,
                        px: { xs: 3, sm: 5, md: 6 },
                        py: { xs: 4, sm: 5 },
                        background: `linear-gradient(135deg, ${BRAND_BLUE} 0%, ${BRAND_BLUE_LIGHT} 100%)`,
                        boxShadow: `0 16px 40px ${alpha(BRAND_BLUE, 0.22)}`,
                    }}
                >
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        alignItems={{ xs: 'center', md: 'center' }}
                        justifyContent="space-between"
                        spacing={{ xs: 3, md: 4 }}
                    >
                        <Stack spacing={1.25} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                            <Typography
                                component="h2"
                                sx={{
                                    color: '#ffffff',
                                    fontWeight: 800,
                                    fontSize: { xs: '1.5rem', sm: '1.875rem', md: '2rem' },
                                    letterSpacing: '-0.02em',
                                    lineHeight: 1.2,
                                }}
                            >
                                Have a question about an event?
                            </Typography>

                            <Typography
                                sx={{
                                    color: alpha('#ffffff', 0.9),
                                    fontSize: { xs: '0.95rem', sm: '1.05rem' },
                                    lineHeight: 1.65,
                                    maxWidth: 480,
                                }}
                            >
                                Ask about a section, a fee, or a registration and we will write back.
                            </Typography>
                        </Stack>

                        <Button
                            variant="contained"
                            size="large"
                            endIcon={
                                <ArrowForwardIcon
                                    sx={{
                                        fontSize: 20,
                                        transition: 'transform 0.25s ease',
                                    }}
                                />
                            }
                            onClick={() => router.push('/contact')}
                            sx={{
                                flexShrink: 0,
                                minWidth: { xs: '100%', sm: 220 },
                                px: 4,
                                py: 1.75,
                                fontWeight: 800,
                                fontSize: '1.0625rem',
                                letterSpacing: '0.01em',
                                borderRadius: 50,
                                bgcolor: '#ffffff',
                                color: BRAND_BLUE,
                                textTransform: 'none',
                                boxShadow: `0 6px 20px ${alpha('#000000', 0.18)}`,
                                transition: 'all 0.25s ease',
                                '& .MuiButton-endIcon': {
                                    ml: 1,
                                },
                                '&:hover': {
                                    bgcolor: '#ffffff',
                                    transform: 'translateY(-3px)',
                                    boxShadow: `0 12px 28px ${alpha('#000000', 0.22)}`,
                                    '& .MuiButton-endIcon': {
                                        transform: 'translateX(4px)',
                                    },
                                },
                            }}
                        >
                            Contact Us
                        </Button>
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
}
