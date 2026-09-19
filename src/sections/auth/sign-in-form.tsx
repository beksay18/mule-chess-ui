import { Box, Button, IconButton, InputAdornment, Link, TextField } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Iconify } from 'src/components/iconify';
import { useState, FormEvent } from 'react';
import { isValidEmail } from '../../utils/validator';

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

export function SignInForm({
    onSubmit,
    isSubmitting = false,
    onClearError,
}: {
    onSubmit: (username: string, password: string) => void | Promise<void>;
    isSubmitting?: boolean;
    onClearError?: () => void;
}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ username: false, password: false });

    const handleSubmit = (e?: FormEvent) => {
        e?.preventDefault();

        const newErrors = {
            username: username.trim() === '' || !isValidEmail(username),
            password: password.trim() === '',
        };

        setErrors(newErrors);

        if (!newErrors.username && !newErrors.password) {
            onSubmit(username, password);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}
        >
            <TextField
                fullWidth
                label="Email address"
                value={username}
                onChange={(e) => {
                    onClearError?.();
                    setUsername(e.target.value);
                }}
                onKeyDown={handleKeyDown}
                sx={{ ...fieldSx, mb: 2.5 }}
                slotProps={{ inputLabel: { shrink: true } }}
                required
                error={errors.username}
                helperText={
                    errors.username &&
                    (username.trim() === '' ? 'Email is required' : 'Invalid email format')
                }
            />

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mb: 1,
                }}
            >
                <Link
                    href="/contact-us"
                    variant="body2"
                    underline="hover"
                    sx={{ color: BRAND_BLUE, fontWeight: 600, fontSize: '0.8125rem' }}
                >
                    Forgot password?
                </Link>
            </Box>

            <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                    onClearError?.();
                    setPassword(e.target.value);
                }}
                onKeyDown={handleKeyDown}
                required
                error={errors.password}
                helperText={errors.password && 'Password is required'}
                slotProps={{
                    inputLabel: { shrink: true },
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
                disabled={isSubmitting}
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
                {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
        </Box>
    );
}
