import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useEffect, useState } from "react";
import { getActiveProductTypes, ProductType } from "../../api/productType";
import { useRouter } from "../../routes/hooks";

export default function HomeProducts() {
    const router = useRouter();
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);

    const isDev = import.meta.env.MODE === 'development';
    const baseURL = isDev ? import.meta.env.VITE_API_BASE_IMAGE_URL : '';

    useEffect(() => {
        loadProductTypes();
    }, []);

    const loadProductTypes = async () => {
        const data = await getActiveProductTypes();
        setProductTypes(data);
    };

    const handleTypeClick = (typeId: number) => {
        router.push(`/custom-products/${typeId}`);
    };

    return (
        <Box sx={{ py: 2, backgroundColor: '#f4f6f8' }}>
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                            lg: 'repeat(3, 1fr)',
                        },
                        gap: 3,
                    }}
                >
                    {productTypes.map((productType) => (
                        <Box
                            key={productType.id}
                            onClick={() => handleTypeClick(productType.id)}
                            sx={{
                                p: 3,
                                background: 'linear-gradient(135deg, #f2f5f9, #ffffff)',
                                borderRadius: 4,
                                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                cursor: 'pointer',
                                '&:hover': {
                                    transform: 'translateY(-6px) scale(1.02)',
                                    boxShadow: '0 10px 28px rgba(0, 0, 0, 0.1)',
                                },
                            }}
                        >

                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    mb: 2,
                                }}
                            >
                                <Box
                                    component="img"
                                    src={`${baseURL}${productType.imageUrl}`}
                                    alt={productType.name}
                                    sx={{
                                        width: 120,
                                        maxHeight: 120,
                                        objectFit: 'contain',
                                        borderRadius: 2,
                                        transition: 'transform 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                        },
                                    }}
                                />
                            </Box>

                            <Box
                                sx={{
                                    textAlign: 'center',
                                    fontWeight: 700,
                                    fontSize: '1.05rem',
                                    color: '#333',
                                }}
                            >
                                {productType.name}
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Container>
        </Box>
    );
}
