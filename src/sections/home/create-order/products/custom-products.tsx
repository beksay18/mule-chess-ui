import * as React from 'react';
import Box from '@mui/material/Box';
import {useEffect, useState} from "react";
import {Paper} from "@mui/material";
import Grid from "@mui/material/Grid";
import {getActiveProducts, Product} from "../../../../api/product";
import {useParams} from "react-router-dom";
import CustomProductTitle from "./custom-product-title";
import {useRouter} from "../../../../routes/hooks";

export default function CustomProducts() {
    const router = useRouter();
    const { typeId } = useParams();
    const [customProducts, setCustomProducts] = useState<Product[]>([]);

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
        <Box id="logoCollection" sx={{ py: 4 }}>
            {customProducts.length === 0 ? (
                <Box textAlign="center" mt={4}>
                    No Products Found
                </Box>
            ) : (
                <Grid container spacing={3} justifyContent="center">
                    {customProducts.map((customProduct) => (
                            <Paper
                                elevation={3}
                                onClick={() => handleProductClick(customProduct.id)}
                                sx={{
                                    p: 2,
                                    width: 160,
                                    height: 100,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontWeight: 600,
                                    fontSize: '1.1rem',
                                    textAlign: 'center',
                                    '&:hover': {
                                        boxShadow: 4,
                                        transform: 'translateY(-2px)',
                                    },
                                }}
                            >
                                {customProduct.name}
                            </Paper>
                    ))}
                </Grid>
            )}
        </Box>
        </>
    );
}
