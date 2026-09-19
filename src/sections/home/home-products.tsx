import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme, alpha } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { getActiveProducts, Product, sortProductsByPosition } from '../../api/product';
import { getActiveProductTypes } from '../../api/productType';
import { useRouter } from '../../routes/hooks';

const BRAND_BLUE = '#175195';

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

        setProducts(
            productLists.flatMap((list) => sortProductsByPosition(list))
        );
    };

    const handleProductClick = (productId: number) => {
        router.push(`/custom-product-details/${productId}`);
    };

    if (products.length === 0) {
        return null;
    }

    return (
        <Box
            id="home-products"
            sx={{
                bgcolor: '#ffffff',
                pb: { xs: 6, md: 10 },
            }}
        >
            <Container maxWidth="lg">
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
                    justifyContent="space-between"
                    spacing={2}
                    sx={{ mb: { xs: 4, md: 5 } }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontWeight: 700,
                                fontSize: '0.8125rem',
                                letterSpacing: '0.06em',
                                textTransform: 'uppercase',
                                color: BRAND_BLUE,
                                mb: 1,
                            }}
                        >
                            Our stickers
                        </Typography>
                        <Typography
                            component="h2"
                            sx={{
                                fontWeight: 800,
                                fontSize: { xs: '1.75rem', md: '2.25rem' },
                                letterSpacing: '-0.02em',
                                color: theme.palette.grey[900],
                            }}
                        >
                            Pick one and make it yours
                        </Typography>
                    </Box>
                    <Typography
                        sx={{
                            color: 'text.secondary',
                            fontSize: '1rem',
                            maxWidth: 340,
                            lineHeight: 1.6,
                        }}
                    >
                        Select a sticker style below to start customizing size, shape, and artwork.
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
                        gap: { xs: 2.5, md: 3.5 },
                    }}
                >
                    {products.map((product, index) => (
                        <Box
                            key={product.id}
                            onClick={() => handleProductClick(product.id)}
                            sx={{
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: 3,
                                overflow: 'hidden',
                                cursor: 'pointer',
                                bgcolor: theme.palette.grey[50],
                                border: `1px solid ${theme.palette.grey[200]}`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    borderColor: alpha(BRAND_BLUE, 0.3),
                                    boxShadow: `0 20px 40px ${alpha(BRAND_BLUE, 0.12)}`,
                                    '& .product-image': {
                                        transform: 'scale(1.05)',
                                    },
                                    '& .product-name-label': {
                                        transform: 'rotate(0deg)',
                                    },
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'relative',
                                    height: { xs: 220, md: 260 },
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: '#ffffff',
                                    p: { xs: 1.5, md: 2 },
                                    overflow: 'hidden',
                                }}
                            >
                                <Typography
                                    sx={{
                                        position: 'absolute',
                                        top: 16,
                                        left: 16,
                                        fontWeight: 800,
                                        fontSize: '0.75rem',
                                        letterSpacing: '0.05em',
                                        color: alpha(BRAND_BLUE, 0.5),
                                    }}
                                >
                                    {String(index + 1).padStart(2, '0')}
                                </Typography>

                                {product.imageUrl ? (
                                    <Box
                                        component="img"
                                        className="product-image"
                                        src={`${baseURL}${product.imageUrl}`}
                                        alt={product.name}
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain',
                                            transition: 'transform 0.4s ease',
                                        }}
                                    />
                                ) : (
                                    <Box
                                        sx={{
                                            width: '60%',
                                            height: '50%',
                                            bgcolor: theme.palette.grey[200],
                                            borderRadius: 2,
                                        }}
                                    />
                                )}
                            </Box>

                            <Box
                                sx={{
                                    p: 2.5,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexGrow: 1,
                                }}
                            >
                                <Typography
                                    className="product-name-label"
                                    component="span"
                                    sx={{
                                        display: 'inline-block',
                                        px: 2,
                                        py: 0.75,
                                        fontWeight: 800,
                                        fontSize: '0.9375rem',
                                        letterSpacing: '-0.01em',
                                        color: BRAND_BLUE,
                                        border: `2px dashed ${alpha(BRAND_BLUE, 0.28)}`,
                                        borderRadius: 2,
                                        transform: `rotate(${index % 2 === 0 ? -2 : 2}deg)`,
                                        transition: 'transform 0.3s ease',
                                        textAlign: 'center',
                                    }}
                                >
                                    {product.name}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Container>
        </Box>
    );
}
