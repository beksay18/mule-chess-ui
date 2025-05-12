import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function HomeOverview() {
    return (
        <Box
            id="hero"
            sx={(theme) => ({
                width: '100%',
                backgroundRepeat: 'no-repeat',
                backgroundImage:
                    'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
            })}
        >
            <Container
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    pt: { xs: 10, sm: 16 },
                    pb: { xs: 8, sm: 12 },
                }}
            >
                <Stack
                    spacing={2}
                    useFlexGap
                    sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' } }}
                >
                    <Typography
                        variant="h2"
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: 'center',
                            fontSize: 'clamp(3rem, 10vw, 3.5rem)',
                        }}
                    >
                        Create&nbsp;custom&nbsp;
                        <Typography
                            component="span"
                            variant="h2"
                            sx={(theme) => ({
                                fontSize: 'inherit',
                                color: 'primary.main',
                                ...theme.applyStyles('dark', {
                                    color: 'primary.light',
                                }),
                            })}
                        >
                            stickers
                        </Typography>,&nbsp;
                        <Typography
                            component="span"
                            variant="h2"
                            sx={(theme) => ({
                                fontSize: 'inherit',
                                color: 'primary.main',
                                ...theme.applyStyles('dark', {
                                    color: 'primary.light',
                                }),
                            })}
                        >
                            labels
                        </Typography>
                        &nbsp;and&nbsp;more
                    </Typography>
                    <Typography
                        sx={{
                            textAlign: 'center',
                            color: 'text.secondary',
                            width: { sm: '100%', md: '80%' },
                        }}
                    >
                        Enjoy free digital proofs, quick production, and complimentary express shipping.
                    </Typography>
                    <Button
                        sx={{
                            mt: { xs: 2, sm: 0 },
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
                        onClick={() => {
                            console.log('Contact Us clicked');
                        }}
                    >
                        Shop Stickers
                    </Button>
                </Stack>
            </Container>
        </Box>
    );
}
