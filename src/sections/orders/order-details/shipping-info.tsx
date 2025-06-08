import { Typography, Card, CardContent, Divider } from '@mui/material';
import { Icon } from '@iconify/react';
import React from 'react';

export function ShippingInfo({ shippingAddress }: { shippingAddress: any }) {
    return (
        <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    <Icon icon="mdi:truck-delivery-outline" style={{ marginRight: 8 }} />
                    Shipping Address
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography>{shippingAddress.addressLine1}</Typography>
                {shippingAddress.addressLine2 && <Typography>{shippingAddress.addressLine2}</Typography>}
                <Typography>{shippingAddress.city}, {shippingAddress.state}</Typography>
                <Typography>{shippingAddress.postalCode}, {shippingAddress.country}</Typography>
            </CardContent>
        </Card>
    );
}