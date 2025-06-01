import * as React from 'react';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { getActiveProducts, Product } from '../../../../api/product';
import { useParams } from 'react-router-dom';
import CustomProductTitle from './custom-product-title';
import { useRouter } from '../../../../routes/hooks';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';

export default function CustomProducts() {
    const router = useRouter();
    const { typeId } = useParams();
    const [customProducts, setCustomProducts] = useState<Product[]>([]);

    const isDev = import.meta.env.MODE === 'development';
    const baseImageUrl = isDev ? import.meta.env.VITE_API_BASE_IMAGE_URL : '';

    useEffect(() => {
        if (typeId) {
            loadProductsByType(Number(typeId));
        }
    }, [typeId]);

    const loadProductsByType = async (id: number) => {
        const data = await getActiveProducts(id);
        setCustomProducts(data);
    };

    const handleProductClick = (productId: number) => {
        router.push(`/custom-product-details/${productId}`);
    };

    return (
        <>
            <CustomProductTitle />
            <Container sx={{ mt: 5, pb: 10 }}>
                {customProducts.length === 0 ? (
                    <Box textAlign="center" mt={4}>
                        No Products Found
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(2, 1fr)',
                                md: 'repeat(3, 1fr)',
                                lg: 'repeat(4, 1fr)',
                            },
                            gap: 4,
                        }}
                    >
                        {customProducts.map((product) => (
                            <Box
                                key={product.id}
                                onClick={() => handleProductClick(product.id)}
                                sx={{
                                    p: 1,
                                    cursor: 'pointer',
                                    transition: '0.3s',
                                    textAlign: 'center',
                                    '&:hover': {
                                        backgroundColor: '#f0f0f0',
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: 200,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {product.imageUrl ? (
                                        <Box
                                            component="img"
                                            src={`${baseImageUrl}${product.imageUrl}`}
                                            alt={product.name}
                                            sx={{
                                                maxWidth: '100%',
                                                maxHeight: '100%',
                                                objectFit: 'contain',
                                                transition: 'transform 0.3s',
                                            }}
                                        />
                                    ) : (
                                        <Box
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                backgroundColor: '#f0f0f0',
                                            }}
                                        />
                                    )}
                                </Box>
                                <Box sx={{ fontWeight: 500}}>
                                    {product.name}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}
            </Container>
        </>
    );
}
