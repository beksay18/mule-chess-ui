import * as React from 'react';
import {
    Box,
    Button,
    Card,
    Container,
    Typography,
    Paper,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

export default function Features() {

    return (
        <Box
            id="hero"
            sx={{
                width: '100%',
                backgroundRepeat: 'no-repeat',
                backgroundImage:
                    'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
                py: 8,
            }}
        >
            <Container id="features">
                <Typography
                    component="h2"
                    variant="h2"
                    gutterBottom
                    sx={{ color: 'text.primary', textAlign: 'left', mb: 3 }}
                >
                    CART
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 4,
                    }}
                >
                    <Card
                        variant="outlined"
                        sx={{
                            flex: 7,
                            minHeight: 400,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#f5f5f5',
                        }}
                    >
                        <Box
                            sx={{
                                width: 300,
                                height: 300,
                                backgroundImage: 'url(/placeholder.png)',
                                backgroundSize: 'contain',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center',
                            }}
                        />
                    </Card>

                    <Box sx={{ flex: 3 }}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography variant="body1" fontWeight="bold" sx={{mr: 1}}>Subtotal: </Typography>
                                <Typography variant="body1">
                                    $904
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex',}}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    endIcon={<LockIcon />}
                                    sx={{
                                        textTransform: 'none',
                                        height: 60,
                                        fontSize: '1.2rem',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Checkout
                                </Button>
                            </Box>
                            <Typography variant="body1">
                                or continue shopping
                            </Typography>
                        </Paper>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
