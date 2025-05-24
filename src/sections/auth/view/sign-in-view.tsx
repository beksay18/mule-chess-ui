import {Box, Typography, Divider, Card, CardContent, Button} from '@mui/material';
import {useCallback, useState} from 'react';
import {useRouter} from 'src/routes/hooks';
import {signIn} from '../../../api/auth';
import {SessionStorage} from '../../../api';
import {SignInForm} from '../sign-in-form';
import {SocialLoginButton} from '../social-login-button';
import Container from "@mui/material/Container";

export function SignInView() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('');

    const handleSignIn = useCallback(async (username: string, password: string) => {
        try {
            const res = await signIn({username, password});

            SessionStorage.setJSONValue('access-token', {'access-token': res.accessToken});
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
        <Container id="features" sx={{py: 15}}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    bgcolor: 'background.default',
                    px: 2,
                }}
            >
                <Card
                    sx={{
                        width: '100%',
                        maxWidth: 420,
                        p: 3,
                        borderRadius: 3,
                        boxShadow: 3,
                    }}
                >
                    <CardContent>
                        <Box sx={{gap: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 5}}>
                            <Typography variant="h5">Log in</Typography>
                            <Typography variant="body2" sx={{color: 'text.secondary'}}>
                                Don’t have an account?
                                <Box component="span" sx={{ml: 0.5}}>
                                    <a href="/sign-up"
                                       style={{color: '#1976d2', textDecoration: 'none', fontWeight: 500}}>
                                        Get started
                                    </a>
                                </Box>
                            </Typography>
                        </Box>

                        <SignInForm onSubmit={handleSignIn}/>

                        {errorMessage && (
                            <Typography variant="body2" color="error" sx={{mt: 2}}>
                                {errorMessage}
                            </Typography>
                        )}

                        <Divider sx={{my: 3, '&::before, &::after': {borderTopStyle: 'dashed'}}}>
                            <Typography variant="overline"
                                        sx={{color: 'text.secondary', fontWeight: 'fontWeightMedium'}}>
                                OR
                            </Typography>
                        </Divider>

                        <Box sx={{display: 'flex', justifyContent: 'center'}}>
                            <SocialLoginButton/>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}
