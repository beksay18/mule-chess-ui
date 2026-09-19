import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

const BRAND_BLUE = '#175195';

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
        <Paper
            elevation={0}
            sx={{
                p: { xs: 2.5, md: 3 },
                borderRadius: 3,
                border: `1px solid ${alpha(BRAND_BLUE, 0.12)}`,
                boxShadow: `0 4px 24px ${alpha(BRAND_BLUE, 0.05)}`,
            }}
        >
            <Typography sx={{ fontWeight: 800, fontSize: '1.0625rem', color: '#0f172a', mb: 2 }}>
                Shipping address
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    label="Address line 1"
                    fullWidth
                    required
                    value={shipping.addressLine1}
                    error={errors.addressLine1}
                    helperText={errors.addressLine1 && 'Address is required'}
                    onChange={(event) => setShipping({ ...shipping, addressLine1: event.target.value })}
                />
                <TextField
                    label="Address line 2"
                    fullWidth
                    value={shipping.addressLine2}
                    onChange={(event) => setShipping({ ...shipping, addressLine2: event.target.value })}
                />
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                    <TextField
                        label="City"
                        fullWidth
                        required
                        value={shipping.city}
                        error={errors.city}
                        helperText={errors.city && 'City is required'}
                        onChange={(event) => setShipping({ ...shipping, city: event.target.value })}
                    />
                    <FormControl fullWidth required error={errors.state}>
                        <InputLabel>State</InputLabel>
                        <Select
                            value={shipping.state}
                            label="State"
                            onChange={(event) => setShipping({ ...shipping, state: event.target.value })}
                        >
                            {usStates.map((state) => (
                                <MenuItem key={state} value={state}>
                                    {state}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.state && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                                State is required
                            </Typography>
                        )}
                    </FormControl>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                    <TextField
                        label="Postal code"
                        fullWidth
                        required
                        value={shipping.postalCode}
                        error={errors.postalCode}
                        helperText={errors.postalCode && 'Postal code is required'}
                        onChange={(event) => setShipping({ ...shipping, postalCode: event.target.value })}
                    />
                    <TextField label="Country" fullWidth disabled value={shipping.country} />
                </Box>
            </Box>
        </Paper>
    );
}
