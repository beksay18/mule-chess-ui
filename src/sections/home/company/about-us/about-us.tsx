import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import { alpha, useTheme } from '@mui/material/styles';
import { useRouter } from '../../../../routes/hooks';

const BRAND_BLUE = '#175195';

const VALUES = [
    {
        icon: AutoAwesomeOutlinedIcon,
        title: 'Design online',
        desc: 'Upload your artwork, pick size and finish, and preview your stickers before you order.',
    },
    {
        icon: PrintOutlinedIcon,
        title: 'Quality you can feel',
        desc: 'Professional printing with durable materials — stickers that look great and hold up.',
    },
    {
        icon: GroupsOutlinedIcon,
        title: 'Built for creators',
        desc: 'From side projects to growing brands — we serve artists and businesses across the U.S.',
    },
] as const;

const stickerChipSx = {
    position: 'relative' as const,
    display: 'inline-block',
    px: { xs: 2, md: 2.5 },
    py: { xs: 0.5, md: 0.75 },
    mx: 0.5,
    fontWeight: 800,
    color: BRAND_BLUE,
    bgcolor: '#ffffff',
    border: `2px solid ${alpha(BRAND_BLUE, 0.15)}`,
    outline: `2px dashed ${alpha(BRAND_BLUE, 0.3)}`,
    outlineOffset: 3,
    borderRadius: 2.5,
    transform: 'rotate(-3deg)',
    boxShadow: `
        4px 4px 0 ${alpha(BRAND_BLUE, 0.15)},
        0 8px 20px ${alpha(BRAND_BLUE, 0.12)}
    `,
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: -6,
        right: -6,
        width: 14,
        height: 14,
        bgcolor: alpha(BRAND_BLUE, 0.08),
        borderRadius: '0 0 6px 0',
        transform: 'rotate(12deg)',
    },
};

export default function AboutUs() {
    const theme = useTheme();
    const router = useRouter();

    const scrollToHomeProducts = () => {
        router.push('/');
        setTimeout(() => {
            document.getElementById('home-products')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    return (
        <Box sx={{ bgcolor: '#ffffff' }}>
            {/* Hero */}
            <Box sx={{ py: { xs: 5, md: 8 } }}>
                <Container maxWidth="md">
                    <Stack spacing={3} alignItems="center" sx={{ textAlign: 'center' }}>
                        <Box component="h1" sx={{ m: 0, maxWidth: 560 }}>
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
                                We help your ideas{' '}
                                <Box component="span" sx={stickerChipSx}>
                                    stick
                                </Box>
                            </Typography>
                            <Typography
                                sx={{
                                    color: 'text.secondary',
                                    fontSize: { xs: '1rem', md: '1.125rem' },
                                    lineHeight: 1.7,
                                    maxWidth: 520,
                                    mx: 'auto',
                                }}
                            >
                                Complete Graphics Sticker House is a modern platform for creating and ordering
                                custom stickers online — built for artists, small businesses, and
                                anyone who loves great design.
                            </Typography>
                        </Box>
                    </Stack>
                </Container>
            </Box>

            {/* Story + image */}
            <Box sx={{ pb: { xs: 6, md: 8 } }}>
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: 'center',
                            gap: { xs: 5, md: 8 },
                        }}
                    >
                        <Box
                            sx={{
                                flex: 1,
                                width: '100%',
                                maxWidth: { md: 380 },
                                mx: { xs: 'auto', md: 0 },
                            }}
                        >
                            <Box sx={{ position: 'relative', width: '100%' }}>
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        inset: -14,
                                        borderRadius: 4,
                                        border: `2px dashed ${alpha(BRAND_BLUE, 0.2)}`,
                                        transform: 'rotate(-4deg)',
                                        pointerEvents: 'none',
                                    }}
                                />
                                <Box
                                    component="img"
                                    src="/assets/images/home-products/cg-sticker-house.png"
                                    alt="Complete Graphics Sticker House"
                                    sx={{
                                        position: 'relative',
                                        width: '100%',
                                        borderRadius: 3,
                                        display: 'block',
                                        boxShadow: `0 20px 50px ${alpha(BRAND_BLUE, 0.15)}`,
                                    }}
                                />
                            </Box>
                        </Box>

                        <Stack spacing={3} sx={{ flex: 1.2 }}>
                            <Box>
                                <Typography
                                    sx={{
                                        fontWeight: 800,
                                        fontSize: '1.25rem',
                                        color: theme.palette.grey[900],
                                        mb: 1,
                                    }}
                                >
                                    Our mission
                                </Typography>
                                <Typography sx={{ color: 'text.secondary', lineHeight: 1.75 }}>
                                    Make high-quality sticker production accessible, fast, and
                                    enjoyable. We combine smart online tools with beautiful print
                                    products so you can go from idea to finished stickers without
                                    the hassle.
                                </Typography>
                            </Box>

                            <Box>
                                <Typography
                                    sx={{
                                        fontWeight: 800,
                                        fontSize: '1.25rem',
                                        color: theme.palette.grey[900],
                                        mb: 1,
                                    }}
                                >
                                    Our story
                                </Typography>
                                <Typography sx={{ color: 'text.secondary', lineHeight: 1.75 }}>
                                    Complete Graphics Sticker House was founded in Chicago in 2024 by a team
                                    passionate about blending cutting-edge web technology with
                                    premium print. We built a streamlined ordering experience — with
                                    smart tools and AI — so customers can design and preview their
                                    stickers instantly.
                                </Typography>
                            </Box>

                            <Box>
                                <Typography
                                    sx={{
                                        fontWeight: 800,
                                        fontSize: '1.25rem',
                                        color: theme.palette.grey[900],
                                        mb: 1,
                                    }}
                                >
                                    Where we&apos;re headed
                                </Typography>
                                <Typography sx={{ color: 'text.secondary', lineHeight: 1.75 }}>
                                    We proudly serve creators, entrepreneurs, and communities across
                                    the U.S. and beyond. Backed by mentors and advisors, we&apos;re
                                    growing every day thanks to the trust of our customers. At
                                    Complete Graphics Sticker House, our obsession is helping your ideas stick —
                                    literally.
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>
                </Container>
            </Box>

            {/* Values */}
            <Box
                sx={{
                    py: { xs: 5, md: 7 },
                    bgcolor: alpha(BRAND_BLUE, 0.03),
                    borderTop: `1px solid ${alpha(BRAND_BLUE, 0.08)}`,
                    borderBottom: `1px solid ${alpha(BRAND_BLUE, 0.08)}`,
                }}
            >
                <Container maxWidth="lg">
                    <Typography
                        sx={{
                            fontWeight: 800,
                            fontSize: { xs: '1.375rem', md: '1.5rem' },
                            color: theme.palette.grey[900],
                            textAlign: 'center',
                            mb: { xs: 4, md: 5 },
                        }}
                    >
                        What we stand for
                    </Typography>

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                            gap: { xs: 3, md: 4 },
                        }}
                    >
                        {VALUES.map(({ icon: Icon, title, desc }) => (
                            <Box
                                key={title}
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    bgcolor: '#ffffff',
                                    border: `1px solid ${alpha(BRAND_BLUE, 0.1)}`,
                                    boxShadow: `0 4px 20px ${alpha(BRAND_BLUE, 0.06)}`,
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: `0 12px 32px ${alpha(BRAND_BLUE, 0.12)}`,
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 2,
                                        bgcolor: alpha(BRAND_BLUE, 0.08),
                                        color: BRAND_BLUE,
                                        mb: 2,
                                    }}
                                >
                                    <Icon sx={{ fontSize: 24 }} />
                                </Box>
                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: '1.0625rem',
                                        color: theme.palette.grey[900],
                                        mb: 0.75,
                                    }}
                                >
                                    {title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: 'text.secondary', lineHeight: 1.7 }}
                                >
                                    {desc}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* CTA */}
            <Box sx={{ py: { xs: 5, md: 7 } }}>
                <Container maxWidth="sm">
                    <Stack spacing={3} alignItems="center" sx={{ textAlign: 'center' }}>
                        <Typography
                            sx={{
                                fontWeight: 800,
                                fontSize: { xs: '1.375rem', md: '1.625rem' },
                                color: theme.palette.grey[900],
                                letterSpacing: '-0.02em',
                            }}
                        >
                            Ready to create your stickers?
                        </Typography>
                        <Typography sx={{ color: 'text.secondary', lineHeight: 1.65 }}>
                            Browse our sticker options, upload your design, and we&apos;ll handle
                            the rest.
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%' }}>
                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                endIcon={<ArrowForwardIcon />}
                                onClick={scrollToHomeProducts}
                                sx={{
                                    py: 1.6,
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
                                Start Designing
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                fullWidth
                                onClick={() => router.push('/contact-us')}
                                sx={{
                                    py: 1.6,
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    borderRadius: 50,
                                    color: BRAND_BLUE,
                                    borderColor: alpha(BRAND_BLUE, 0.3),
                                    textTransform: 'none',
                                    '&:hover': {
                                        borderColor: BRAND_BLUE,
                                        bgcolor: alpha(BRAND_BLUE, 0.04),
                                    },
                                }}
                            >
                                Contact Us
                            </Button>
                        </Stack>
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
}
