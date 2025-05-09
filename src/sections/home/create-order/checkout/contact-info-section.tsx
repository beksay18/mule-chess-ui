import React from 'react';
import { Box, TextField, Typography } from '@mui/material';

interface ContactInfoProps {
    customerEmail: string;
    setCustomerEmail: (value: string) => void;
    customerPhone: string;
    setCustomerPhone: (value: string) => void;
    errors: { email: boolean; phone: boolean };
}

export default function ContactInfoSection({
                                               customerEmail,
                                               setCustomerEmail,
                                               customerPhone,
                                               setCustomerPhone,
                                               errors,
                                           }: ContactInfoProps) {
    return (
        <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Contact Info
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                <TextField
                    label="Email"
                    fullWidth
                    required
                    value={customerEmail}
                    error={errors.email}
                    helperText={errors.email && 'Email is required'}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                />
                <TextField
                    label="Phone Number"
                    fullWidth
                    required
                    value={customerPhone}
                    error={errors.phone}
                    helperText={errors.phone && 'Phone Number is required'}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                />
            </Box>
        </Box>
    );
}
