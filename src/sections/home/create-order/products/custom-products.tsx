import * as React from 'react';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { getActiveProducts, Product } from '../../../../api/product';
import { useParams } from 'react-router-dom';
import CustomProductTitle from './custom-product-title';
import { useRouter } from '../../../../routes/hooks';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import ProductListSidebar from "./product-list-sidebar";

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
                <Box sx={{ display: 'flex', gap: 2 }}>
                    {/* Main block (80%) */}
                    <Box sx={{ flex: '0 0 85%' }}>
                        <Paper sx={{ p: 3 }}>
                            Main 80% block
                        </Paper>
                    </Box>

                    <Box sx={{ flex: '0 0 15%' }}>
                        <ProductListSidebar
                            products={customProducts}
                            onProductClick={handleProductClick}
                            baseImageUrl={baseImageUrl}
                        />
                    </Box>
                </Box>
            </Container>
        </>
    );
}
