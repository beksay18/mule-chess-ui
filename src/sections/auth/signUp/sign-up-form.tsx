import { useState } from 'react';
import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    TextField,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import {isValidEmail} from "../../../utils/validator";

type Props = {
    onSubmit: (data: {
        firstName: string;
        lastName: string;
        username: string;
        password: string;
    }) => void;
};

export function SignUpForm({ onSubmit }: Props) {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        username: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({
        firstName: false,
        lastName: false,
        username: false,
        password: false,
    });

    const handleChange = (field: keyof typeof form, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: false }));
    };

    const handleSubmit = () => {
        const newErrors = {
            firstName: form.firstName.trim() === '',
            lastName: form.lastName.trim() === '',
            username: form.username.trim() === '' || !isValidEmail(form.username),
            password: form.password.trim() === '',
        };

        setErrors(newErrors);
        const hasError = Object.values(newErrors).some(Boolean);
        if (hasError) return;

        onSubmit(form);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <TextField
                fullWidth
                label="First Name"
                value={form.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                required
                error={errors.firstName}
                helperText={errors.firstName && 'First name is required'}
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="Last Name"
                value={form.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                required
                error={errors.lastName}
                helperText={errors.lastName && 'Last name is required'}
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="Email (Username)"
                value={form.username}
                onChange={(e) => handleChange('username', e.target.value)}
                required
                error={errors.username}
                helperText={
                    errors.username && (form.username.trim() === ''
                        ? 'Email is required'
                        : 'Invalid email format')
                }
                sx={{ mb: 2 }}
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
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                sx={{ mb: 3 }}
            />

            <Button
                fullWidth
                size="large"
                color="inherit"
                variant="contained"
                onClick={handleSubmit}
            >
                Sign Up
            </Button>
        </Box>
    );
}
