import React from 'react';
import {Box, Paper, TextField, Typography} from '@mui/material';

interface ContactInfoProps {
    customerFirstName: string;
    setCustomerFirstName: (value: string) => void;
    customerLastName: string;
    setCustomerLastName: (value: string) => void;
    customerEmail: string;
    setCustomerEmail: (value: string) => void;
    customerPhone: string;
    setCustomerPhone: (value: string) => void;
    errors: { firstName: boolean; lastName: boolean; email: boolean; phone: boolean };
}

export default function ContactInfoSection({
                                               customerFirstName,
                                               setCustomerFirstName,
                                               customerLastName,
                                               setCustomerLastName,
                                               customerEmail,
                                               setCustomerEmail,
                                               customerPhone,
                                               setCustomerPhone,
                                               errors,
                                           }: ContactInfoProps) {
    return (
        <Paper sx={{p: 3}} variant="outlined">
            <Box>
                <Typography variant="h6" gutterBottom sx={{mb: 2}}>
                    Contact Info
                </Typography>
                <Box sx={{display: 'flex', flexDirection: {xs: 'column', md: 'row'}, gap: 2, mb: 2}}>
                    <TextField
                        label="First Name"
                        fullWidth
                        required
                        value={customerFirstName}
                        error={errors.firstName}
                        helperText={errors.firstName && 'First Name is required'}
                        onChange={(e) => setCustomerFirstName(e.target.value)}
                    />
                    <TextField
                        label="Last Name"
                        fullWidth
                        required
                        value={customerLastName}
                        error={errors.lastName}
                        helperText={errors.lastName && 'Last Name is required'}
                        onChange={(e) => setCustomerLastName(e.target.value)}
                    />
                </Box>
                <Box sx={{display: 'flex', flexDirection: {xs: 'column', md: 'row'}, gap: 2}}>
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
        </Paper>
    );
}
