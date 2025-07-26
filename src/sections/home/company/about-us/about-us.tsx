import * as React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTypography = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    lineHeight: 1.8,
    fontSize: theme.typography.body1.fontSize,
    whiteSpace: 'pre-line',
    textAlign: 'justify',
}));

const StyledImage = styled('img')(({ theme }) => ({
    width: '100%',
    maxWidth: 300,
    borderRadius: 16,
    boxShadow: theme.shadows[3],
    objectFit: 'cover',
    margin: 'auto',
}));

export default function AboutUs() {
    return (
        <Container sx={{ py: 5 }}>
            <Typography variant="h3" gutterBottom>
                About Us
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    gap: 6,
                    mt: 4,
                }}
            >
                <Box sx={{ flex: '0 0 30%'}}>
                    <StyledImage src="/assets/images/sakai-sticker.png" />
                </Box>

                <Box sx={{ flex: '0 0 70%' }}>
                    <StyledTypography variant="body1">
                        SAKAI is a modern platform dedicated to simplifying the way people create and order custom stickers online.
                        Our mission is to make high-quality sticker production accessible, fast, and enjoyable — whether you are an artist, small business owner, or just someone who loves creative design.
                        <br /><br />
                        SAKAI was founded in Chicago in 2024 and is operated by a team passionate about blending cutting-edge web technology with beautiful print products. We’ve built a streamlined ordering experience using smart tools and AI to help customers design and preview their stickers instantly.
                        <br /><br />
                        We proudly serve creators, entrepreneurs, and communities across the U.S. and beyond, and we’re continuously growing thanks to the trust and love of our customers. Our platform is part of a new wave of e-commerce startups focused on creativity, customization, and exceptional user experience.
                        <br /><br />
                        We’re also backed by incredible mentors and advisors, and we are currently exploring partnerships with accelerator programs to expand our reach and impact. At SAKAI, our obsession is helping your ideas stick — literally.
                    </StyledTypography>
                </Box>
            </Box>
        </Container>
    );
}
