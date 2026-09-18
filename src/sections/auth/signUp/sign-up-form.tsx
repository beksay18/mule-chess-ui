import { useState, FormEvent } from 'react';
import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    TextField,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Iconify } from 'src/components/iconify';
import {
    formatUsPhoneNumber,
    isValidEmail,
    isValidUsPhoneNumber,
    stripPhoneDigits,
} from '../../../utils/validator';

const BRAND_BLUE = '#175195';

const fieldSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(BRAND_BLUE, 0.4),
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: BRAND_BLUE,
        },
    },
};

type Props = {
    onSubmit: (data: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
        username: string;
        password: string;
    }) => void;
};

export function SignUpForm({ onSubmit }: Props) {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        username: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({
        firstName: false,
        lastName: false,
        phoneNumber: false,
        username: false,
        password: false,
    });

    const handleChange = (field: keyof typeof form, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: false }));
    };

    const handleSubmit = (e?: FormEvent) => {
        e?.preventDefault();

        const newErrors = {
            firstName: form.firstName.trim() === '',
            lastName: form.lastName.trim() === '',
            phoneNumber: !isValidUsPhoneNumber(form.phoneNumber),
            username: form.username.trim() === '' || !isValidEmail(form.username),
            password: form.password.trim() === '',
        };

        setErrors(newErrors);
        const hasError = Object.values(newErrors).some(Boolean);
        if (hasError) return;

        onSubmit({
            ...form,
            phoneNumber: stripPhoneDigits(form.phoneNumber),
        });
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}
        >
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2,
                    mb: 2.5,
                }}
            >
                <TextField
                    fullWidth
                    label="First name"
                    value={form.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    required
                    error={errors.firstName}
                    helperText={errors.firstName && 'First name is required'}
                    sx={fieldSx}
                />
                <TextField
                    fullWidth
                    label="Last name"
                    value={form.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    required
                    error={errors.lastName}
                    helperText={errors.lastName && 'Last name is required'}
                    sx={fieldSx}
                />
            </Box>

            <TextField
                fullWidth
                label="Phone number"
                type="tel"
                value={form.phoneNumber}
                onChange={(e) =>
                    handleChange('phoneNumber', formatUsPhoneNumber(e.target.value))
                }
                placeholder="(555) 555-5555"
                required
                error={errors.phoneNumber}
                helperText={
                    errors.phoneNumber &&
                    (stripPhoneDigits(form.phoneNumber).length === 0
                        ? 'Phone number is required'
                        : 'Enter a valid 10-digit US phone number')
                }
                slotProps={{
                    htmlInput: { inputMode: 'numeric', maxLength: 14 },
                }}
                sx={{ ...fieldSx, mb: 2.5 }}
            />

            <TextField
                fullWidth
                label="Email address"
                value={form.username}
                onChange={(e) => handleChange('username', e.target.value)}
                required
                error={errors.username}
                helperText={
                    errors.username &&
                    (form.username.trim() === '' ? 'Email is required' : 'Invalid email format')
                }
                sx={{ ...fieldSx, mb: 2.5 }}
            />

            <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
                error={errors.password}
                helperText={errors.password && 'Password is required'}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    <Iconify
                                        icon={
                                            showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'
                                        }
                                    />
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
                sx={{ ...fieldSx, mb: 3 }}
            />

            <Button
                fullWidth
                size="large"
                variant="contained"
                type="submit"
                sx={{
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: '1rem',
                    borderRadius: 50,
                    bgcolor: BRAND_BLUE,
                    textTransform: 'none',
                    boxShadow: `0 8px 24px ${alpha(BRAND_BLUE, 0.25)}`,
                    '&:hover': {
                        bgcolor: '#124578',
                        transform: 'translateY(-1px)',
                    },
                }}
            >
                Create account
            </Button>
        </Box>
    );
}
