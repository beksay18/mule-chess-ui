import * as React from 'react';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { getActiveProducts, Product } from '../../../../api/product';
import { useParams } from 'react-router-dom';
import CustomProductTitle from './custom-product-title';
import { useRouter } from '../../../../routes/hooks';
import Container from '@mui/material/Container';

export default function CustomProducts() {
    const router = useRouter();
    const { typeId } = useParams();
    const [customProducts, setCustomProducts] = useState<Product[]>([]);

    const baseImageUrl = import.meta.env.VITE_API_BASE_IMAGE_URL;

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
            <Container sx={{ mt: 3 }}>
                {customProducts.length === 0 ? (
                    <Box textAlign="center" mt={4}>
                        No Products Found
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: '1fr 1fr',
                                md: '1fr 1fr 1fr 1fr',
                            },
                            gap: 3,
                        }}
                    >
                        {customProducts.map((product) => (
                            <Box
                                key={product.id}
                                onClick={() => handleProductClick(product.id)}
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    backgroundColor: '#fff',
                                    borderRadius: 2,
                                    boxShadow: 'none',
                                    transition: '0.3s',
                                    '&:hover': {
                                        boxShadow: 4,
                                        transform: 'translateY(-2px)',
                                    },
                                }}
                            >
                                {product.imageUrl ? (
                                    <Box
                                        component="img"
                                        src={`${baseImageUrl}${product.imageUrl}`}
                                        alt={product.name}
                                        sx={{
                                            width: '100%',
                                            maxHeight: 150,
                                            objectFit: 'contain',
                                            mb: 1,
                                            borderRadius: 1,
                                        }}
                                    />
                                ) : (
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: 150,
                                            backgroundColor: '#f5f5f5',
                                            mb: 1,
                                            borderRadius: 1,
                                        }}
                                    />
                                )}
                                {product.name}
                            </Box>
                        ))}
                    </Box>
                )}
            </Container>
        </>
    );
}
