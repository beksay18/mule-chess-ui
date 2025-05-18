import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

interface OrderSummaryProps {
    subtotal: number;
}

export default function OrderSummary({ subtotal }: OrderSummaryProps) {
    return (
        <Paper
            elevation={3}
            sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <Typography variant="body1" fontWeight="bold">Order Summary</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" fontWeight="bold" sx={{ mr: 1 }}>
                    Order total:
                </Typography>
                <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
            </Box>
        </Paper>
    );
}
