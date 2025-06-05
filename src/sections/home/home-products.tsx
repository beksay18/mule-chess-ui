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
                            lg: 'repeat(4, 1fr)',
                        },
                        gap: 3,
                    }}
                >
                    {productTypes.map((productType) => (
                        <Box
                            key={productType.id}
                            onClick={() => handleTypeClick(productType.id)}
                            sx={{
                                p: 2,
                                backgroundColor: '#dde4ef',
                                borderRadius: 3,
                                boxShadow: 1,
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                '&:hover': {
                                    boxShadow: 4,
                                    transform: 'translateY(-5px)',
                                },
                            }}
                        >
                            {productType.imageUrl && (
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: 140,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        mb: 2,
                                        borderRadius: 2,
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={`${baseURL}${productType.imageUrl}`}
                                        alt={productType.name}
                                        sx={{
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            objectFit: 'contain',
                                        }}
                                    />
                                </Box>
                            )}
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    fontWeight: 600,
                                    fontSize: '1rem',
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
