import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState, useCallback } from 'react';
import Link from '@mui/material/Link';
import { alpha } from '@mui/material/styles';
import { useRouter } from 'src/routes/hooks';
import { signIn } from '../../../api/auth';
import { SessionStorage } from '../../../api';
import { SignInForm } from '../sign-in-form';
import { SocialLoginButton } from '../social-login-button';

const NAVY = '#12325f';
const MARK = '#2888A0';

export function SignInView() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSignIn = useCallback(
        async (username: string, password: string) => {
            setErrorMessage('');
            setIsSubmitting(true);
            try {
                const res = await signIn({ username, password });

                SessionStorage.setJSONValue('access-token', { 'access-token': res.accessToken });
                SessionStorage.setJSONValue('current-user', {
                    userId: res.id,
                    username: res.username,
                    role: res.role,
                    person: res.person,
                });

                router.push(
                    res.role === 'ROLE_ADMIN' || res.role === 'ROLE_MANAGER' ? '/dashboard' : '/'
                );
            } catch (error: any) {
                const apiMessage = error?.response?.data?.message;
                const message =
                    apiMessage === 'Bad credentials' || apiMessage === 'User not found'
                        ? 'Incorrect email or password. Please try again.'
                        : apiMessage || 'Incorrect email or password. Please try again.';
                setErrorMessage(message);
                console.error('Sign-in failed:', error);
            } finally {
                setIsSubmitting(false);
            }
        },
        [router]
    );

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
                            sx={{
                                color: MARK,
                                fontWeight: 800,
                                fontSize: 12,
                                letterSpacing: 1.4,
                                textTransform: 'uppercase',
                                mb: 0.75,
                            }}
                        >
                            Mule Chess
                        </Typography>
                        <Typography
                            component="span"
                            sx={{
                                display: 'block',
                                fontWeight: 800,
                                letterSpacing: '-0.03em',
                                fontSize: { xs: '2rem', md: '2.25rem' },
                                lineHeight: 1.15,
                                color: NAVY,
                            }}
                        >
                            Sign in
                        </Typography>
                        <Typography
                            sx={{
                                mt: 1,
                                color: alpha(NAVY, 0.68),
                                fontSize: { xs: '0.975rem', md: '1rem' },
                                lineHeight: 1.6,
                            }}
                        >
                            Sign in to register for tournaments and keep your entries under your name.
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: 420,
                            p: { xs: 3, md: 3.5 },
                            borderRadius: 3,
                            bgcolor: '#ffffff',
                            border: `1px solid ${alpha(MARK, 0.22)}`,
                            boxShadow: `0 16px 40px ${alpha(NAVY, 0.06)}`,
                        }}
                    >
                        {errorMessage && (
                            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
                                {errorMessage}
                            </Alert>
                        )}

                        <SignInForm
                            onSubmit={handleSignIn}
                            isSubmitting={isSubmitting}
                            onClearError={() => setErrorMessage('')}
                        />

                        <Divider sx={{ my: 3 }}>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: 'text.secondary',
                                    fontWeight: 600,
                                    letterSpacing: '0.06em',
                                }}
                            >
                                OR
                            </Typography>
                        </Divider>

                        <SocialLoginButton onError={setErrorMessage} />

                        <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary', textAlign: 'center', mt: 3 }}
                        >
                            Don&apos;t have an account?{' '}
                            <Link
                                href="/sign-up"
                                underline="hover"
                                sx={{ fontWeight: 700, color: MARK }}
                            >
                                Create one
                            </Link>
                        </Typography>
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
}
