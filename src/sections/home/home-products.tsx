import * as React from 'react';
import Box from '@mui/material/Box';
import { useEffect, useState } from "react";
import { getActiveProductTypes, ProductType } from "../../api/productType";
import { Paper } from "@mui/material";
import Grid from "@mui/material/Grid";
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
        <Box sx={{ py: 2, backgroundColor: '#eaecec' }}>
            <Grid container spacing={3} justifyContent="center">
                {productTypes.map((productType) => (
                        <Box
                            onClick={() => handleTypeClick(productType.id)}
                            sx={{
                                p: 2,
                                width: 180,
                                height: 180,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                cursor: 'pointer',
                                '&:hover': {
                                    boxShadow: 4,
                                    transform: 'translateY(-2px)',
                                },
                            }}
                        >
                            {productType.imageUrl ? (
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: 180,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        mb: 1,
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
                            ) : null}

                            <Box sx={{ fontWeight: 600, fontSize: '1rem' }}>
                                {productType.name}
                            </Box>
                        </Box>
                ))}
            </Grid>
        </Box>
    );
}
