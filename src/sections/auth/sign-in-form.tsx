import { Box, Link, Button, TextField, IconButton, InputAdornment } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Iconify } from 'src/components/iconify';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { isValidEmail } from '../../utils/validator';

const NAVY = '#12325f';
const MARK = '#2888A0';

const fieldSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(MARK, 0.5),
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: MARK,
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
                    href="/forgot-password"
                    variant="body2"
                    underline="hover"
                    sx={{ color: MARK, fontWeight: 600, fontSize: '0.8125rem' }}
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
                    bgcolor: NAVY,
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                        bgcolor: MARK,
                    },
                }}
            >
                {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
        </Box>
    );
}
