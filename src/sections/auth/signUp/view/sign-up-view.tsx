import {Box, Typography, Divider, Card, CardContent} from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import { SignUpForm } from '../sign-up-form';
import {signUp} from "../../../../api/auth";
import Container from "@mui/material/Container";

export function SignUpView() {
    const router = useRouter();

    const handleSignUp = async (form: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
        username: string;
        password: string;
    }) => {
        try {
            const res = await signUp(form);
            console.log(res.message);
            router.push('/sign-in');
        } catch (error) {
            console.error('Sign-up failed:', error);
        }
    };

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
            <Box sx={{ gap: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 5 }}>
                <Typography variant="h5">Create Account</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Already have an account?
                    <Box component="span" sx={{ ml: 0.5 }}>
                        <a href="/sign-in">Sign in</a>
                    </Box>
                </Typography>
            </Box>

            <SignUpForm onSubmit={handleSignUp} />
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}
