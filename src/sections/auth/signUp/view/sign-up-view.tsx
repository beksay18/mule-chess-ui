import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import { useRouter } from 'src/routes/hooks';
import { signUp } from '../../../../api/auth';
import { SignUpForm } from '../sign-up-form';

const BRAND_BLUE = '#175195';

export function SignUpView() {
    const theme = useTheme();
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('');
    const [createdEmail, setCreatedEmail] = useState('');

    const handleSignUp = async (form: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
        username: string;
        password: string;
    }) => {
        setErrorMessage('');
        try {
            await signUp(form);
            setCreatedEmail(form.username);
        } catch (error: any) {
            const message =
                error?.response?.data?.message || 'Sign-up failed. Please try again.';
            setErrorMessage(message);
            console.error('Sign-up failed:', error);
        }
    };

    return (
        <Box
            sx={{
                flex: 1,
                bgcolor: '#f6f8fb',
                minHeight: { xs: 'calc(100dvh - 64px)', md: 'calc(100dvh - 72px)' },
                pt: { xs: 6, md: 7 },
                pb: { xs: 6, md: 8 },
            }}
        >
            <Container maxWidth="sm">
                <Stack spacing={2.5} alignItems="center">
                    <Box component="h1" sx={{ m: 0, textAlign: 'center', maxWidth: 420 }}>
                        <Typography
                            component="span"
                            sx={{
                                display: 'block',
                                fontWeight: 800,
                                letterSpacing: '-0.03em',
                                fontSize: { xs: '2rem', md: '2.25rem' },
                                lineHeight: 1.15,
                                color: theme.palette.grey[900],
                                mb: 1,
                            }}
                        >
                            {createdEmail ? (
                                'Account created'
                            ) : (
                                'Create your account'
                            )}
                        </Typography>
                        <Typography
                            sx={{
                                color: 'text.secondary',
                                fontSize: { xs: '0.975rem', md: '1rem' },
                                lineHeight: 1.6,
                            }}
                        >
                            {createdEmail
                                ? 'Sign in with the email and password you just used.'
                                : 'Create an account to register for Mule Chess events.'}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: 480,
                            p: { xs: 3, md: 3.5 },
                            borderRadius: 3,
                            bgcolor: '#ffffff',
                            border: `1px solid ${alpha(BRAND_BLUE, 0.12)}`,
                            boxShadow: `0 8px 32px ${alpha(BRAND_BLUE, 0.08)}`,
                        }}
                    >
                        {createdEmail ? (
                            <Stack spacing={2.5} alignItems="center" sx={{ textAlign: 'center' }}>
                                <Typography
                                    sx={{
                                        fontWeight: 800,
                                        fontSize: '1.25rem',
                                        color: theme.palette.grey[900],
                                    }}
                                >
                                    Your account is ready
                                </Typography>
                                <Typography sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                                    We created an account for {createdEmail}. Sign in with that email
                                    and the password you just chose.
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={() => router.push('/sign-in')}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        bgcolor: BRAND_BLUE,
                                        borderRadius: 2,
                                        px: 3,
                                        '&:hover': { bgcolor: '#124578' },
                                    }}
                                >
                                    Sign in
                                </Button>
                            </Stack>
                        ) : (
                            <SignUpForm onSubmit={handleSignUp} />
                        )}

                        {errorMessage && !createdEmail && (
                            <Typography
                                variant="body2"
                                color="error"
                                textAlign="center"
                                sx={{ mt: 2 }}
                            >
                                {errorMessage}
                            </Typography>
                        )}

                        {!createdEmail && (
                        <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary', textAlign: 'center', mt: 3 }}
                        >
                            Already have an account?{' '}
                            <Link
                                href="/sign-in"
                                underline="hover"
                                sx={{ fontWeight: 700, color: BRAND_BLUE }}
                            >
                                Sign in
                            </Link>
                        </Typography>
                        )}
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
}
