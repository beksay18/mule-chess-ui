import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import { useTheme, alpha } from '@mui/material/styles';
import { useRouter } from '../../routes/hooks';

const BRAND_BLUE = '#175195';

const STEPS = [
    { icon: PaletteOutlinedIcon, title: 'Choose a style', desc: 'Pick from our sticker options' },
    { icon: UploadOutlinedIcon, title: 'Design or upload', desc: 'Build online or send artwork' },
    { icon: LocalPrintshopOutlinedIcon, title: 'We print & ship', desc: 'Quality stickers delivered' },
] as const;

export default function HomeOverview() {
    const router = useRouter();
    const theme = useTheme();

    const headerImage = '/assets/images/home-products/cg-sticker-house.png';

    return (
        <Box
            id="hero"
            sx={{
                position: 'relative',
                width: '100%',
                overflow: 'hidden',
                bgcolor: '#ffffff',
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '10%',
                    right: { xs: '-20%', md: '5%' },
                    width: { xs: 300, md: 480 },
                    height: { xs: 300, md: 480 },
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha(BRAND_BLUE, 0.07)} 0%, transparent 70%)`,
                    pointerEvents: 'none',
                }}
            />

            <Container
                maxWidth="lg"
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    pt: { xs: 5, md: 8 },
                    pb: { xs: 4, md: 6 },
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'center',
                        gap: { xs: 5, md: 8 },
                    }}
                >
                    <Stack spacing={3.5} sx={{ flex: 1, maxWidth: { md: 520 } }}>
                        <Box component="h1" sx={{ maxWidth: 620, m: 0 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                    gap: { xs: 0.75, sm: 1.25 },
                                }}
                            >
                                <Typography
                                    component="span"
                                    sx={{
                                        fontWeight: 800,
                                        letterSpacing: '-0.04em',
                                        fontSize: { xs: '1.875rem', sm: '2.375rem', md: '2.875rem' },
                                        lineHeight: 1.1,
                                        color: theme.palette.grey[900],
                                    }}
                                >
                                    Design
                                </Typography>
                                <Box
                                    component="span"
                                    sx={{
                                        display: 'inline-flex',
                                        px: { xs: 1.25, md: 1.75 },
                                        py: { xs: 0.4, md: 0.6 },
                                        fontWeight: 800,
                                        letterSpacing: '-0.02em',
                                        fontSize: { xs: '1.75rem', sm: '2.125rem', md: '2.625rem' },
                                        lineHeight: 1.1,
                                        color: BRAND_BLUE,
                                        bgcolor: alpha(BRAND_BLUE, 0.06),
                                        border: `2px dashed ${alpha(BRAND_BLUE, 0.35)}`,
                                        borderRadius: 2.5,
                                        transform: 'rotate(-1.5deg)',
                                        boxShadow: `4px 4px 0 ${alpha(BRAND_BLUE, 0.12)}`,
                                    }}
                                >
                                    custom stickers
                                </Box>
                            </Box>

                            <Typography
                                component="span"
                                sx={{
                                    display: 'block',
                                    mt: { xs: 0.75, md: 1 },
                                    fontWeight: 800,
                                    letterSpacing: '-0.04em',
                                    fontSize: { xs: '1.875rem', sm: '2.375rem', md: '2.875rem' },
                                    lineHeight: 1.1,
                                    color: theme.palette.grey[900],
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                online for your brand
                            </Typography>
                        </Box>

                        <Typography
                            sx={{
                                color: 'text.secondary',
                                fontSize: { xs: '1.05rem', md: '1.125rem' },
                                lineHeight: 1.75,
                            }}
                        >
                            Build your sticker your way on our website — pick the size, shape,
                            and finish, upload your artwork, and we&apos;ll print it for you.
                        </Typography>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <Button
                                variant="contained"
                                size="large"
                                endIcon={<ArrowForwardIcon />}
                                onClick={() => router.push('/sticker-builder')}
                                sx={{
                                    px: 4,
                                    py: 1.6,
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    borderRadius: 2.5,
                                    bgcolor: BRAND_BLUE,
                                    textTransform: 'none',
                                    boxShadow: `0 8px 24px ${alpha(BRAND_BLUE, 0.28)}`,
                                    transition: 'all 0.25s ease',
                                    '&:hover': {
                                        bgcolor: '#124578',
                                        boxShadow: `0 12px 28px ${alpha(BRAND_BLUE, 0.38)}`,
                                        transform: 'translateY(-2px)',
                                    },
                                }}
                            >
                                Start Designing
                            </Button>

                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => router.push('/contact-us')}
                                sx={{
                                    px: 4,
                                    py: 1.6,
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    borderRadius: 2.5,
                                    color: BRAND_BLUE,
                                    borderColor: alpha(BRAND_BLUE, 0.3),
                                    textTransform: 'none',
                                    transition: 'all 0.25s ease',
                                    '&:hover': {
                                        borderColor: BRAND_BLUE,
                                        bgcolor: alpha(BRAND_BLUE, 0.04),
                                        transform: 'translateY(-2px)',
                                    },
                                }}
                            >
                                Get Samples
                            </Button>
                        </Stack>
                    </Stack>

                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            width: '100%',
                            maxWidth: { md: 460 },
                        }}
                    >
                        <Box
                            sx={{
                                position: 'relative',
                                width: '100%',
                                maxWidth: 400,
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    inset: -12,
                                    borderRadius: 4,
                                    background: `linear-gradient(135deg, ${alpha(BRAND_BLUE, 0.08)}, ${alpha(BRAND_BLUE, 0.02)})`,
                                    transform: 'rotate(3deg)',
                                }}
                            />
                            <Box
                                component="img"
                                src={headerImage}
                                alt="Custom printed stickers"
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    height: 'auto',
                                    display: 'block',
                                    borderRadius: 3,
                                    boxShadow: `0 20px 60px ${alpha(BRAND_BLUE, 0.15)}`,
                                }}
                            />
                        </Box>
                    </Box>
                </Box>

                <Box
                    sx={{
                        mt: { xs: 6, md: 8 },
                        pt: { xs: 4, md: 5 },
                        borderTop: `1px solid ${theme.palette.grey[200]}`,
                    }}
                >
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                            gap: { xs: 3, md: 4 },
                        }}
                    >
                        {STEPS.map(({ icon: Icon, title, desc }, index) => (
                            <Stack
                                key={title}
                                direction="row"
                                spacing={2}
                                alignItems="flex-start"
                            >
                                <Box
                                    sx={{
                                        width: 44,
                                        height: 44,
                                        flexShrink: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 2,
                                        bgcolor: alpha(BRAND_BLUE, 0.08),
                                        color: BRAND_BLUE,
                                    }}
                                >
                                    <Icon sx={{ fontSize: 22 }} />
                                </Box>
                                <Box>
                                    <Typography
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: '0.9375rem',
                                            color: theme.palette.grey[900],
                                            mb: 0.25,
                                        }}
                                    >
                                        {index + 1}. {title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {desc}
                                    </Typography>
                                </Box>
                            </Stack>
                        ))}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
