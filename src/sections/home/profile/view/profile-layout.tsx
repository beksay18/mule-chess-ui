import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Header from '../../header';
import Footer from '../../footer';
import { ProfileMenu } from './profile-menu';
import { alpha } from '@mui/material/styles';

type ProfileLayoutProps = {
    children: React.ReactNode;
};

export function ProfileLayout({ children }: ProfileLayoutProps) {
    return (
        <>
            <Header />
            <Box
                sx={{
                    bgcolor: alpha('#175195', 0.02),
                    py: { xs: 3, md: 5 },
                    pb: { xs: 6, md: 8 },
                    minHeight: { md: 'calc(100dvh - 72px)' },
                }}
            >
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: '280px 1fr' },
                            gap: { xs: 2.5, md: 4 },
                            alignItems: 'start',
                        }}
                    >
                        <ProfileMenu />
                        <Box
                            sx={{
                                bgcolor: '#ffffff',
                                borderRadius: 3,
                                border: `1px solid ${alpha('#175195', 0.1)}`,
                                boxShadow: `0 4px 24px ${alpha('#175195', 0.05)}`,
                                p: { xs: 3, md: 4 },
                                minHeight: { md: 360 },
                            }}
                        >
                            {children}
                        </Box>
                    </Box>
                </Container>
            </Box>
            <Footer />
        </>
    );
}
