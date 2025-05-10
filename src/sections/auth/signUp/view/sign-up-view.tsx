import { Box, Typography, Divider } from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import { SignUpForm } from '../sign-up-form';
import {signUp} from "../../../../api/auth";

export function SignUpView() {
    const router = useRouter();

    const handleSignUp = async (form: {
        firstName: string;
        lastName: string;
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
        <>
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
        </>
    );
}
