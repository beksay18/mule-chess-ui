import { Box, Typography, Divider } from '@mui/material';
import {useCallback, useState} from 'react';
import { useRouter } from 'src/routes/hooks';
import { signIn } from '../../../api/auth';
import { SessionStorage } from '../../../api';
import {SignInForm} from "../sign-in-form";
import {SocialLoginButton} from "../social-login-button";

export function SignInView() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('');

    const handleSignIn = useCallback(async (username: string, password: string) => {
        try {
            const res = await signIn({ username, password });

            SessionStorage.setJSONValue('access-token', { 'access-token': res.accessToken });
            SessionStorage.setJSONValue('current-user', {
                userId: res.id,
                username: res.username,
                role: res.role,
                person: res.person,
            });

            router.push(res.role === 'ROLE_ADMIN' ? '/dashboard' : '/');
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Sign-in failed. Please try again.';
            setErrorMessage(message);
            console.error('Sign-in failed:', error);
        }
    }, [router]);

    return (
        <>
            <Box sx={{ gap: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 5 }}>
                <Typography variant="h5">Sign in</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Don’t have an account?
                    <Box component="span" sx={{ ml: 0.5 }}><a href="/sign-up">Get started</a></Box>
                </Typography>
            </Box>

            <SignInForm onSubmit={handleSignIn} />

            {errorMessage && (
                <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                    {errorMessage}
                </Typography>
            )}

            <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
                <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}>
                    OR
                </Typography>
            </Divider>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <SocialLoginButton />
            </Box>
        </>
    );
}
