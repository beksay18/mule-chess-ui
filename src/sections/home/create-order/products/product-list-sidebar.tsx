import * as React from 'react';
import Box from '@mui/material/Box';
import { Product } from '../../../../api/product';

type Props = {
    products: Product[];
    onProductClick: (productId: number) => void;
    baseImageUrl: string;
};

export default function ProductListSidebar({ products, onProductClick, baseImageUrl }: Props) {
    if (products.length === 0) {
        return <Box textAlign="center" mt={4}>No Products Found</Box>;
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {products.map((product) => (
                <Box
                    key={product.id}
                    onClick={() => onProductClick(product.id)}
                    sx={{
                        p: 1,
                        cursor: 'pointer',
                        transition: '0.3s',
                        textAlign: 'center',
                        '&:hover': {
                            backgroundColor: '#f0f0f0',
                        },
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            height: 50,
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
                                }}
                            />
                        ) : (
                            <Box sx={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0' }} />
                        )}
                    </Box>
                    <Box sx={{ fontWeight: 500 }}>{product.name}</Box>
                </Box>
            ))}
        </Box>
    );
}
