import { Box, Button, IconButton, InputAdornment, Link, TextField } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { useState, FormEvent } from 'react';
import { isValidEmail } from "../../utils/validator";

export function SignInForm({ onSubmit }: { onSubmit: (username: string, password: string) => void }) {
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
            sx={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}
        >
            <TextField
                fullWidth
                label="Email address"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                sx={{ mb: 3 }}
                slotProps={{ inputLabel: { shrink: true } }}
                required
                error={errors.username}
                helperText={
                    errors.username && (username.trim() === ''
                        ? 'Email is required'
                        : 'Invalid email format')
                }
            />
            <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
                Forgot password?
            </Link>
            <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                required
                error={errors.password}
                helperText={errors.password && 'Password is required'}
                slotProps={{
                    inputLabel: { shrink: true },
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
                sx={{ mb: 3 }}
            />
            <Button
                fullWidth
                size="large"
                color="inherit"
                variant="contained"
                onClick={handleSubmit}
                type="submit"
            >
                Sign in
            </Button>
        </Box>
    );
}