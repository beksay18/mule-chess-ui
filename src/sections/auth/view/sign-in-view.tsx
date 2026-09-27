import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useCallback, useState } from 'react';
import Link from '@mui/material/Link';
import { alpha, useTheme } from '@mui/material/styles';
import { useRouter } from 'src/routes/hooks';
import { signIn } from '../../../api/auth';
import { SessionStorage } from '../../../api';
import { SignInForm } from '../sign-in-form';
import { SocialLoginButton } from '../social-login-button';

const BRAND_BLUE = '#175195';

const stickerChipSx = {
    position: 'relative' as const,
    display: 'inline-block',
    px: { xs: 2, md: 2.5 },
    py: { xs: 0.5, md: 0.75 },
    mx: 0.5,
    fontWeight: 800,
    color: BRAND_BLUE,
    border: `2px dashed ${alpha(BRAND_BLUE, 0.3)}`,
    borderRadius: 2.5,
    transform: 'rotate(-3deg)',
};

export function SignInView() {
    const theme = useTheme();
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
                    res.role === 'ROLE_ADMIN' ? '/dashboard' : res.role === 'ROLE_MANAGER' ? '/user' : '/'
                );
            } catch (error: any) {
                const message =
                    error?.response?.data?.message ||
                    'Incorrect email or password. Please try again.';
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
                bgcolor: '#ffffff',
                py: { xs: 5, md: 8 },
                minHeight: { xs: 'calc(100dvh - 64px)', md: 'calc(100dvh - 72px)' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
            }}
        >
            <Container maxWidth="sm">
                <Stack spacing={4} alignItems="center">
                    <Box component="h1" sx={{ m: 0, textAlign: 'center', maxWidth: 400 }}>
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
                            Welcome{' '}
                            <Box component="span" sx={stickerChipSx}>
                                back
                            </Box>
                        </Typography>
                        <Typography
                            sx={{
                                color: 'text.secondary',
                                fontSize: { xs: '0.975rem', md: '1rem' },
                                lineHeight: 1.6,
                            }}
                        >
                            Sign in to manage orders and continue designing stickers.
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: 420,
                            p: { xs: 3, md: 3.5 },
                            borderRadius: 3,
                            bgcolor: '#ffffff',
                            border: `1px solid ${alpha(BRAND_BLUE, 0.12)}`,
                            boxShadow: `0 8px 32px ${alpha(BRAND_BLUE, 0.08)}`,
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
                                sx={{ fontWeight: 700, color: BRAND_BLUE }}
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
