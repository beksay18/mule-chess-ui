import { Typography, Card, CardContent, Divider } from '@mui/material';
import { Icon } from '@iconify/react';
import React from 'react';

export function CustomerInfo({ order }: { order: any }) {
    return (
        <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    <Icon icon="mdi:account-outline" style={{ marginRight: 8 }} />
                    Customer
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography fontWeight={500}>{order.customerFirstName} {order.customerLastName}</Typography>
                <Typography variant="body2">{order.customerEmail}</Typography>
                <Typography variant="body2">{order.customerPhone}</Typography>
            </CardContent>
        </Card>
    );
}