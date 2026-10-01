import { useState } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import { confirmPasswordReset, requestPasswordReset } from 'src/api/auth';
import { isValidEmail } from 'src/utils/validator';

const BRAND_BLUE = '#175195';

function errorText(error: unknown, fallback: string) {
    const response = (error as { response?: { data?: { message?: string } } })?.response;
    return response?.data?.message || fallback;
}

export function ForgotPasswordView() {
    const [email, setEmail] = useState('');
    const [lastName, setLastName] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState<'email' | 'code' | 'done'>('email');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [sending, setSending] = useState(false);

    const sendCode = async () => {
        const username = email.trim();
        const name = lastName.trim();
        if (!isValidEmail(username)) {
            setError('Enter the email on your account.');
            return;
        }
        if (!name) {
            setError('Enter the last name on your account.');
            return;
        }
        setSending(true);
        setError('');
        setMessage('');
        try {
            const result = await requestPasswordReset(username, name);
            setEmail(username);
            setLastName(name);
            setMessage(result.message);
            setStep('code');
        } catch (err) {
            setError(errorText(err, 'The verification email could not be sent. The password was not changed.'));
        } finally {
            setSending(false);
        }
    };

    const confirmCode = async () => {
        if (!/^\d{6}$/.test(code.trim())) {
            setError('Enter the 6-digit code from your email. The password was not changed.');
            return;
        }
        setSending(true);
        setError('');
        setMessage('');
        try {
            const result = await confirmPasswordReset(email, lastName, code.trim());
            setMessage(result.message);
            setStep('done');
        } catch (err) {
            setError(errorText(err, 'That code does not match this email, so the password was not changed.'));
        } finally {
            setSending(false);
        }
    };

    return (
        <Box
            sx={{
                bgcolor: '#ffffff',
                py: { xs: 5, md: 8 },
                minHeight: { xs: 'calc(100dvh - 64px)', md: 'calc(100dvh - 72px)' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
            }}
        >
            <Container maxWidth="sm">
                <Stack spacing={3} alignItems="center">
                    <Box sx={{ textAlign: 'center', maxWidth: 440 }}>
                        <Typography sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '2.25rem' }, letterSpacing: '-0.03em' }}>
                            Forgot password
                        </Typography>
                        <Typography sx={{ color: 'text.secondary', mt: 1, lineHeight: 1.6 }}>
                            Enter the email and last name on the account. We send a code only when both match.
                            The password changes only after you enter that code.
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: 480,
                            p: { xs: 3, md: 3.5 },
                            borderRadius: 3,
                            border: `1px solid ${alpha(BRAND_BLUE, 0.12)}`,
                            boxShadow: `0 8px 32px ${alpha(BRAND_BLUE, 0.08)}`,
                        }}
                    >
                        <Stack spacing={2}>
                            {error && <Alert severity="error">{error}</Alert>}
                            {message && <Alert severity="success">{message}</Alert>}

                            {step === 'email' && (
                                <>
                                    <TextField
                                        label="Email address"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        fullWidth
                                        autoComplete="email"
                                    />
                                    <TextField
                                        label="Last name"
                                        value={lastName}
                                        onChange={(event) => setLastName(event.target.value)}
                                        fullWidth
                                        autoComplete="family-name"
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={sendCode}
                                        disabled={sending}
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 700,
                                            borderRadius: 50,
                                            py: 1.25,
                                            bgcolor: BRAND_BLUE,
                                            '&:hover': { bgcolor: '#124578' },
                                        }}
                                    >
                                        {sending ? 'Sending…' : 'Send verification code'}
                                    </Button>
                                </>
                            )}

                            {step === 'code' && (
                                <>
                                    <TextField label="Email address" value={email} fullWidth disabled />
                                    <TextField label="Last name" value={lastName} fullWidth disabled />
                                    <TextField
                                        label="6-digit code"
                                        value={code}
                                        onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                                        fullWidth
                                        autoComplete="one-time-code"
                                        slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 6 } }}
                                        helperText="This code only verifies your email. The new password is sent after the code matches."
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={confirmCode}
                                        disabled={sending}
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 700,
                                            borderRadius: 50,
                                            py: 1.25,
                                            bgcolor: BRAND_BLUE,
                                            '&:hover': { bgcolor: '#124578' },
                                        }}
                                    >
                                        {sending ? 'Checking…' : 'Verify and send new password'}
                                    </Button>
                                </>
                            )}

                            {step === 'done' && (
                                <Button
                                    component={Link}
                                    href="/sign-in"
                                    variant="contained"
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        borderRadius: 50,
                                        py: 1.25,
                                        bgcolor: BRAND_BLUE,
                                        '&:hover': { bgcolor: '#124578' },
                                    }}
                                >
                                    Sign in
                                </Button>
                            )}

                            {step !== 'done' && (
                                <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                                    Remember your password?{' '}
                                    <Link href="/sign-in" underline="hover" sx={{ fontWeight: 700, color: BRAND_BLUE }}>
                                        Sign in
                                    </Link>
                                </Typography>
                            )}
                        </Stack>
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
}
