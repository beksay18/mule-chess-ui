import React from 'react';
import {
    Box,
    FormControl,
    InputLabel,
    MenuItem, Paper,
    Select,
    TextField,
    Typography,
} from '@mui/material';

interface ShippingAddress {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

interface ShippingInfoProps {
    shipping: ShippingAddress;
    setShipping: (value: ShippingAddress) => void;
    errors: Record<string, boolean>;
    usStates: string[];
}

export default function ShippingInfoSection({
                                                shipping,
                                                setShipping,
                                                errors,
                                                usStates,
                                            }: ShippingInfoProps) {
    return (
        <Paper sx={{p: 2, mt: 2}} variant="outlined">
            <Box>
                <Typography variant="h6" gutterBottom sx={{mb: 2, mt: 2}}>
                    Shipping Info
                </Typography>
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>

                    <TextField
                        label="Address Line 1"
                        fullWidth
                        required
                        value={shipping.addressLine1}
                        error={errors.addressLine1}
                        helperText={errors.addressLine1 && 'Address Line 1 is required'}
                        onChange={(e) => setShipping({...shipping, addressLine1: e.target.value})}
                    />

                    <TextField
                        label="Address Line 2"
                        fullWidth
                        value={shipping.addressLine2}
                        onChange={(e) => setShipping({...shipping, addressLine2: e.target.value})}
                    />

                    <Box sx={{display: 'flex', gap: 2, flexDirection: {xs: 'column', md: 'row'}}}>
                        <TextField
                            label="City"
                            fullWidth
                            required
                            value={shipping.city}
                            error={errors.city}
                            helperText={errors.city && 'City is required'}
                            onChange={(e) => setShipping({...shipping, city: e.target.value})}
                        />
                        <FormControl fullWidth required error={errors.state}>
                            <InputLabel>State</InputLabel>
                            <Select
                                value={shipping.state}
                                onChange={(e) => setShipping({...shipping, state: e.target.value})}
                                label="State"
                            >
                                {usStates.map((state) => (
                                    <MenuItem key={state} value={state}>
                                        {state}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.state && (
                                <Typography variant="caption" color="error">
                                    State is required
                                </Typography>
                            )}
                        </FormControl>
                    </Box>

                    <Box sx={{display: 'flex', gap: 2, flexDirection: {xs: 'column', md: 'row'}}}>
                        <TextField
                            label="Postal Code"
                            fullWidth
                            required
                            value={shipping.postalCode}
                            error={errors.postalCode}
                            helperText={errors.postalCode && 'Postal Code is required'}
                            onChange={(e) => setShipping({...shipping, postalCode: e.target.value})}
                        />
                        <TextField
                            label="Country"
                            fullWidth
                            disabled
                            value={shipping.country}
                        />
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
}
