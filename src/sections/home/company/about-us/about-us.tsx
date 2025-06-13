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

const TitleTypography = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    position: 'relative',
    marginBottom: theme.spacing(2),
    '&:hover': { cursor: 'pointer' },
    '&::before': {
        content: '""',
        position: 'absolute',
        width: 0,
        height: 2,
        bottom: 0,
        left: 0,
        backgroundColor: theme.palette.primary.main,
        transition: 'width 0.3s ease',
    },
    '&:hover::before': {
        width: '100%',
    },
}));

const StyledImage = styled('img')(({ theme }) => ({
    width: '100%',
    maxWidth: 480,
    borderRadius: 16,
    boxShadow: theme.shadows[3],
    objectFit: 'cover',
    margin: 'auto',
}));

export default function AboutUs() {
    return (
        <Container sx={{ py: 10 }}>
            <Typography variant="h2" color="primary" gutterBottom>
                Hello, we are CG Stickers
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
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                    <StyledImage src="/assets/images/product/product-14.webp" alt="About CG Stickers" />
                </Box>

                <Box sx={{ flex: 1 }}>
                    <TitleTypography variant="h5">
                        At CG Stickers, we’re obsessed with making custom sticker ordering effortless and enjoyable.
                    </TitleTypography>
                    <StyledTypography variant="body1">
                        We know your time is valuable — that’s why we’ve streamlined the entire process from start to finish.
                        Place your order in seconds and get your custom stickers in just days.
                        Enjoy free digital proofs, artwork assistance, fast turnaround, and shipping — all on us.
                        That’s why creators, small businesses, and sticker lovers trust CG Stickers.
                    </StyledTypography>
                </Box>
            </Box>
        </Container>
    );
}
