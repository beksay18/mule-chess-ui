import React from 'react';
import { Box, Paper, Typography, Divider } from '@mui/material';

interface LineItem {
    productId: number;
    name: string;
    quantity: number;
    width: number;
    height: number;
    percentage: number;
    customDimension?: boolean;
    price: number;
}

interface OrderSummaryProps {
    items: LineItem[];
}

export default function OrderSummary({ items }: OrderSummaryProps) {
    const subtotal = items.reduce((sum, item) => {
        const discountedPrice = item.price * (1 - item.percentage / 100);
        return sum + item.quantity * discountedPrice;
    }, 0);

    return (
        <Paper elevation={3} sx={{ p: 3, backgroundColor: '#f9f9f9' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                Order Summary
            </Typography>

            {items.map((item, idx) => {
                const discountedPrice = item.price * (1 - item.percentage / 100);
                const itemTotal = item.quantity * discountedPrice;

                return (
                    <Box key={idx} sx={{ mb: 1 }}>
                        <Typography variant="body2">
                            <strong>{item.name}</strong>
                        </Typography>
                        <Typography variant="body2">
                            {item.quantity} × ${discountedPrice.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Size: {item.width}&quot; × {item.height}&quot; | {item.percentage}% off
                        </Typography>
                        <Typography variant="body2">Item Total: ${itemTotal.toFixed(2)}</Typography>
                        <Divider sx={{ my: 1 }} />
                    </Box>
                );
            })}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Typography variant="body1" fontWeight="bold">Total:</Typography>
                <Typography variant="body1" fontWeight="bold">${subtotal.toFixed(2)}</Typography>
            </Box>
        </Paper>
    );
}
