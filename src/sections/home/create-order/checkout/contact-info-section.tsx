import { Box, Paper, TextField, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

import { formatUsPhoneNumber, stripPhoneDigits } from '../../../../utils/validator';

const BRAND_BLUE = '#175195';

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
                Contact
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
                <TextField
                    label="First name"
                    fullWidth
                    required
                    value={customerFirstName}
                    error={errors.firstName}
                    helperText={errors.firstName && 'First name is required'}
                    onChange={(event) => setCustomerFirstName(event.target.value)}
                />
                <TextField
                    label="Last name"
                    fullWidth
                    required
                    value={customerLastName}
                    error={errors.lastName}
                    helperText={errors.lastName && 'Last name is required'}
                    onChange={(event) => setCustomerLastName(event.target.value)}
                />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                <TextField
                    label="Email"
                    fullWidth
                    required
                    value={customerEmail}
                    error={errors.email}
                    helperText={errors.email && 'Email is required'}
                    onChange={(event) => setCustomerEmail(event.target.value)}
                />
                <TextField
                    label="Phone number"
                    type="tel"
                    fullWidth
                    required
                    value={customerPhone}
                    error={errors.phone}
                    placeholder="(555) 555-5555"
                    helperText={
                        errors.phone &&
                        (stripPhoneDigits(customerPhone).length === 0
                            ? 'Phone number is required'
                            : 'Enter a valid 10-digit US phone number')
                    }
                    onChange={(event) => setCustomerPhone(formatUsPhoneNumber(event.target.value))}
                    slotProps={{
                        htmlInput: { inputMode: 'numeric', maxLength: 14 },
                    }}
                />
            </Box>
        </Paper>
    );
}
