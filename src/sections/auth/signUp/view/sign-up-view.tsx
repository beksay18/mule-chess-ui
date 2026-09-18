import Box from '@mui/material/Box';
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

export function SignUpView() {
    const theme = useTheme();
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('');

    const handleSignUp = async (form: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
        username: string;
        password: string;
    }) => {
        setErrorMessage('');
        try {
            const res = await signUp(form);
            console.log(res.message);
            router.push('/sign-in');
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
                            Create your{' '}
                            <Box component="span" sx={stickerChipSx}>
                                account
                            </Box>
                        </Typography>
                        <Typography
                            sx={{
                                color: 'text.secondary',
                                fontSize: { xs: '0.975rem', md: '1rem' },
                                lineHeight: 1.6,
                            }}
                        >
                            Join to design custom stickers and keep track of your orders.
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
                        <SignUpForm onSubmit={handleSignUp} />

                        {errorMessage && (
                            <Typography
                                variant="body2"
                                color="error"
                                textAlign="center"
                                sx={{ mt: 2 }}
                            >
                                {errorMessage}
                            </Typography>
                        )}

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
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
}
