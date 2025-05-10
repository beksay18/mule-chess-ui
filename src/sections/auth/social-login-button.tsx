import { Button } from '@mui/material';
import { Iconify } from 'src/components/iconify';

export function SocialLoginButton() {
    return (
        <Button
            variant="outlined"
            color="inherit"
            startIcon={<Iconify width={20} icon="socials:google" />}
            sx={{ fontSize: '0.85rem', textTransform: 'none', px: 2, py: 1, borderRadius: 2 }}
        >
            Login with Google
        </Button>
    );
}
