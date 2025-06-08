import { Box, Typography, Card, CardContent, Divider, Stack, Chip } from '@mui/material';
import React from 'react';

export function OrderSummary({ payment, totalAmount }: { payment: any; totalAmount: number }) {
    return (
        <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">Order Summary</Typography>
                    <Chip
                        label={payment ? payment.paymentStatus.toUpperCase() : 'UNPAID'}
                        color={payment?.paymentStatus === 'paid' ? 'success' : 'warning'}
                        sx={{ fontWeight: 500 }}
                    />
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={1}>
                    <Typography>Subtotal: ${payment ? payment.amount.toFixed(2) : '0.00'}</Typography>
                    <Typography>Discount: $0.00</Typography>
                    <Typography>Shipping: $0.00</Typography>
                    <Typography variant="subtitle1" fontWeight={600} mt={1}>
                        Order Total: ${totalAmount.toFixed(2)}
                    </Typography>
                </Stack>
            </CardContent>
        </Card>
    );
}