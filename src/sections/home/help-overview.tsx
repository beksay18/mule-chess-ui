import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { alpha } from '@mui/material/styles';
import { useRouter } from '../../routes/hooks';

const NAVY = '#12325f';
const MARK = '#2888A0';

export default function HelpOverview() {
    const router = useRouter();

    return (
        <Box sx={{ bgcolor: '#ffffff', py: { xs: 4, md: 6 } }}>
            <Container maxWidth="lg">
                <Box
                    sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: 4,
                        px: { xs: 3, sm: 4, md: 5 },
                        py: { xs: 3.5, md: 4.5 },
                        bgcolor: '#f7fbfc',
                        border: `1px solid ${alpha(MARK, 0.28)}`,
                        boxShadow: `0 12px 32px ${alpha(NAVY, 0.06)}`,
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: 6,
                            bgcolor: MARK,
                        },
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            right: -80,
                            top: -90,
                            width: 220,
                            height: 220,
                            borderRadius: '50%',
                            bgcolor: alpha(MARK, 0.1),
                            pointerEvents: 'none',
                        }}
                    />

                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        alignItems={{ xs: 'flex-start', md: 'center' }}
                        justifyContent="space-between"
                        spacing={{ xs: 2.5, md: 4 }}
                        sx={{ position: 'relative', pl: { xs: 1, sm: 1.5 } }}
                    >
                        <Stack spacing={0.75} sx={{ maxWidth: 560 }}>
                            <Typography
                                sx={{
                                    color: MARK,
                                    fontWeight: 800,
                                    fontSize: 12,
                                    letterSpacing: 1.4,
                                    textTransform: 'uppercase',
                                }}
                            >
                                We are here to help
                            </Typography>
                            <Typography
                                component="h2"
                                sx={{
                                    color: NAVY,
                                    fontWeight: 800,
                                    fontSize: { xs: '1.45rem', sm: '1.7rem', md: '1.85rem' },
                                    letterSpacing: '-0.02em',
                                    lineHeight: 1.2,
                                }}
                            >
                                Have a question about an event?
                            </Typography>
                            <Typography
                                sx={{
                                    color: alpha(NAVY, 0.72),
                                    fontSize: { xs: '0.95rem', sm: '1.02rem' },
                                    lineHeight: 1.6,
                                }}
                            >
                                Ask about a section, a fee, or a registration and we will write back.
                            </Typography>
                        </Stack>

                        <Button
                            variant="contained"
                            size="large"
                            endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}
                            onClick={() => router.push('/contact')}
                            sx={{
                                flexShrink: 0,
                                alignSelf: { xs: 'stretch', sm: 'flex-start', md: 'center' },
                                minWidth: { sm: 168 },
                                px: 3,
                                py: 1.35,
                                fontWeight: 800,
                                fontSize: '1rem',
                                borderRadius: 50,
                                bgcolor: MARK,
                                color: '#ffffff',
                                textTransform: 'none',
                                boxShadow: 'none',
                                '&:hover': {
                                    bgcolor: NAVY,
                                    boxShadow: `0 10px 24px ${alpha(NAVY, 0.18)}`,
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
