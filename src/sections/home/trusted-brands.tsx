import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const logos = [
    '/assets/images/brands/logo.webp',
    '/assets/images/brands/logo.webp',
    '/assets/images/brands/logo.webp',
    '/assets/images/brands/logo.webp',
    '/assets/images/brands/logo.webp',
];

export default function TrustedBrands() {
    return (
        <Box sx={{ py: 6, backgroundColor: '#f9f9f9' }}>
            <Container>
                <Typography
                    variant="h5"
                    fontWeight="bold"
                    textAlign="center"
                    gutterBottom
                >
                    Trusted brands
                </Typography>

                <Box
                    sx={{
                        mt: 4,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 4,
                    }}
                >
                    {logos.map((logo, index) => (
                        <Box
                            key={index}
                            component="img"
                            src={logo}
                            alt={`Brand ${index + 1}`}
                            sx={{
                                height: 50,
                                width: 120,
                                objectFit: 'contain',
                                filter: 'grayscale(100%)',
                                opacity: 0.8,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    filter: 'none',
                                    opacity: 1,
                                },
                            }}
                        />
                    ))}
                </Box>
            </Container>
        </Box>
    );
}
