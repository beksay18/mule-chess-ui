import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useTheme, alpha } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { getActiveProducts, Product, sortProductsByPosition } from '../../api/product';
import { getActiveProductTypes } from '../../api/productType';
import { useRouter } from '../../routes/hooks';

const BRAND_BLUE = '#175195';
const BRAND_GREEN = '#06853D';

const CARD_TONES = [
    { wash: '#E8F1FA', accent: BRAND_BLUE, rotate: -2.4 },
    { wash: '#E7F6EE', accent: BRAND_GREEN, rotate: 1.8 },
    { wash: '#F4EEF8', accent: '#6B3FA0', rotate: -1.2 },
    { wash: '#FFF4E8', accent: '#C45C12', rotate: 2.2 },
    { wash: '#EEF7F4', accent: '#0F6E56', rotate: -1.8 },
    { wash: '#F8EEF2', accent: '#9B2D5C', rotate: 1.4 },
];

function getProductHook(name: string) {
    const value = name.toLowerCase();
    if (value.includes('qr')) return 'Scan-ready codes';
    if (value.includes('holograph')) return 'Color-shift finish';
    if (value.includes('vehicle') || value.includes('cartoon')) return 'Fleet-ready art';
    if (value.includes('sequential') || value.includes('number')) return 'Numbered in sequence';
    if (value.includes('service')) return 'Dates, logs, and labels';
    if (value.includes('die')) return 'Cut to your shape';
    return 'Custom printed';
}

export default function HomeProducts() {
    const router = useRouter();
    const theme = useTheme();
    const [products, setProducts] = useState<Product[]>([]);

    const isDev = import.meta.env.MODE === 'development';
    const baseURL = isDev ? import.meta.env.VITE_API_BASE_IMAGE_URL : '';

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        const productTypes = await getActiveProductTypes();
        const featuredTypes = productTypes.filter((type) => type.position === 1);

        if (featuredTypes.length === 0) {
            setProducts([]);
            return;
        }

        const productLists = await Promise.all(
            featuredTypes.map((type) => getActiveProducts(type.id))
        );

        setProducts(productLists.flatMap((list) => sortProductsByPosition(list)));
    };

    const handleProductClick = (productId: number) => {
        router.push(`/sticker-builder?productId=${productId}`);
    };

    if (products.length === 0) {
        return null;
    }

    return (
        <Box
            id="home-products"
            sx={{
                position: 'relative',
                overflow: 'hidden',
                bgcolor: '#f6f8fb',
                py: { xs: 6, md: 10 },
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `radial-gradient(${alpha(BRAND_BLUE, 0.09)} 1.2px, transparent 1.2px)`,
                    backgroundSize: '22px 22px',
                    pointerEvents: 'none',
                }}
            />

            <Container maxWidth="lg" sx={{ position: 'relative' }}>
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    alignItems={{ xs: 'flex-start', md: 'flex-end' }}
                    justifyContent="space-between"
                    spacing={2.5}
                    sx={{ mb: { xs: 4, md: 6 } }}
                >
                    <Box>
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                px: 1.25,
                                py: 0.4,
                                mb: 1.25,
                                borderRadius: 999,
                                bgcolor: alpha(BRAND_BLUE, 0.08),
                                border: `1px dashed ${alpha(BRAND_BLUE, 0.28)}`,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    fontSize: '0.72rem',
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                    color: BRAND_BLUE,
                                }}
                            >
                                Sticker shop
                            </Typography>
                        </Box>
                        <Typography
                            component="h2"
                            sx={{
                                fontWeight: 800,
                                fontSize: { xs: '1.85rem', md: '2.6rem' },
                                letterSpacing: '-0.035em',
                                lineHeight: 1.1,
                                color: theme.palette.grey[900],
                                maxWidth: 520,
                            }}
                        >
                            Peel one off the sheet and start designing
                        </Typography>
                    </Box>
                    <Typography
                        sx={{
                            color: 'text.secondary',
                            fontSize: '1.02rem',
                            maxWidth: 360,
                            lineHeight: 1.65,
                        }}
                    >
                        Six print-ready styles. Click a sticker to open the builder with that type already selected.
                    </Typography>
                </Stack>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                        },
                        gap: { xs: 2.25, md: 3 },
                    }}
                >
                    {products.map((product, index) => {
                        const tone = CARD_TONES[index % CARD_TONES.length];
                        const imageSrc = product.imageUrl?.startsWith('http')
                            ? product.imageUrl
                            : `${baseURL}${product.imageUrl || ''}`;

                        return (
                            <Box
                                key={product.id}
                                role="button"
                                tabIndex={0}
                                aria-label={`Open ${product.name} in sticker builder`}
                                onClick={() => handleProductClick(product.id)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                        event.preventDefault();
                                        handleProductClick(product.id);
                                    }
                                }}
                                sx={{
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    minHeight: { xs: 300, md: 340 },
                                    p: { xs: 2, md: 2.5 },
                                    borderRadius: '28px',
                                    cursor: 'pointer',
                                    overflow: 'hidden',
                                    bgcolor: tone.wash,
                                    border: `1px solid ${alpha(tone.accent, 0.14)}`,
                                    boxShadow: `0 10px 30px ${alpha(tone.accent, 0.08)}`,
                                    transition: 'transform 280ms ease, box-shadow 280ms ease',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: `0 24px 48px ${alpha(tone.accent, 0.18)}`,
                                        '& .product-sticker': {
                                            transform: `rotate(0deg) scale(1.06)`,
                                            filter: `drop-shadow(0 22px 18px ${alpha('#0f172a', 0.22)})`,
                                        },
                                        '& .design-cta': {
                                            opacity: 1,
                                            transform: 'translateY(0)',
                                        },
                                    },
                                    '&:focus-visible': {
                                        outline: `3px solid ${alpha(tone.accent, 0.45)}`,
                                        outlineOffset: 3,
                                    },
                                }}
                            >
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Box
                                        sx={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: '50%',
                                            display: 'grid',
                                            placeItems: 'center',
                                            bgcolor: '#fff',
                                            color: tone.accent,
                                            fontWeight: 800,
                                            fontSize: 13,
                                            letterSpacing: '0.04em',
                                            boxShadow: `0 0 0 4px ${alpha('#fff', 0.55)}`,
                                        }}
                                    >
                                        {String(index + 1).padStart(2, '0')}
                                    </Box>
                                    <Typography
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: 12,
                                            color: alpha(tone.accent, 0.8),
                                        }}
                                    >
                                        {getProductHook(product.name)}
                                    </Typography>
                                </Stack>

                                <Box
                                    sx={{
                                        flex: 1,
                                        minHeight: { xs: 180, md: 200 },
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        py: 2,
                                    }}
                                >
                                    {product.imageUrl ? (
                                        <Box
                                            component="img"
                                            className="product-sticker"
                                            src={imageSrc}
                                            alt={product.name}
                                            sx={{
                                                width: '78%',
                                                maxHeight: { xs: 170, md: 200 },
                                                objectFit: 'contain',
                                                transform: `rotate(${tone.rotate}deg)`,
                                                filter: `drop-shadow(0 14px 12px ${alpha('#0f172a', 0.16)})`,
                                                transition: 'transform 320ms ease, filter 320ms ease',
                                            }}
                                        />
                                    ) : (
                                        <Box
                                            sx={{
                                                width: '50%',
                                                height: 120,
                                                borderRadius: 3,
                                                bgcolor: alpha('#fff', 0.7),
                                            }}
                                        />
                                    )}
                                </Box>

                                <Stack
                                    direction="row"
                                    alignItems="flex-end"
                                    justifyContent="space-between"
                                    spacing={1.5}
                                >
                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography
                                            sx={{
                                                fontWeight: 800,
                                                fontSize: { xs: '1.05rem', md: '1.15rem' },
                                                letterSpacing: '-0.02em',
                                                color: theme.palette.grey[900],
                                                lineHeight: 1.2,
                                            }}
                                        >
                                            {product.name}
                                        </Typography>
                                        <Typography
                                            className="design-cta"
                                            sx={{
                                                mt: 0.6,
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: 0.5,
                                                fontWeight: 800,
                                                fontSize: 13,
                                                color: tone.accent,
                                                opacity: { xs: 1, md: 0.72 },
                                                transform: { xs: 'none', md: 'translateY(4px)' },
                                                transition: 'opacity 220ms ease, transform 220ms ease',
                                            }}
                                        >
                                            Design this
                                            <ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            width: 28,
                                            height: 28,
                                            borderRadius: '7px 2px 10px 2px',
                                            bgcolor: alpha('#fff', 0.7),
                                            border: `1px dashed ${alpha(tone.accent, 0.28)}`,
                                            flexShrink: 0,
                                        }}
                                    />
                                </Stack>
                            </Box>
                        );
                    })}
                </Box>
            </Container>
        </Box>
    );
}
