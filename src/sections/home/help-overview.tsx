import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {useRouter} from "../../routes/hooks";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    backdropFilter: 'blur(24px)',
    padding: theme.spacing(2.5, 3.75),
    flexWrap: 'wrap',
    gap: theme.spacing(10),
}));

export default function HelpOverview() {
    const router = useRouter();

    const handleContactUsClick = () => {
        router.push(`/contact-us`);
    };

    return (
        <Box
            sx={{
                background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
                py: 4,
            }}
        >
            <Container>
                <StyledToolbar variant="dense">
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{
                            color: 'white',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            fontSize: { xs: '1.5rem', sm: '2rem' },
                        }}
                    >
                        Have any questions for us?
                    </Typography>

                    <Button
                        sx={{
                            mt: { xs: 2, sm: 0 }, // stack button on mobile
                            px: 4,
                            py: 1.5,
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            borderRadius: 2,
                            backgroundColor: 'white',
                            color: '#1976d2',
                            textTransform: 'none',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                backgroundColor: '#f0f0f0',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                                transform: 'scale(1.05)',
                            },
                        }}
                        onClick={() => handleContactUsClick()}
                    >
                        Contact Us
                    </Button>
                </StyledToolbar>
            </Container>
        </Box>
    );
}
