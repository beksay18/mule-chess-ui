import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {styled} from '@mui/material/styles';
import Container from "@mui/material/Container";

const StyledTypography = styled(Typography)(({theme}) => ({
    display: 'block',
    color: theme.palette.text.secondary,
    lineHeight: 1.75,
    fontSize: theme.typography.body1.fontSize,
    whiteSpace: 'pre-line',
    textAlign: 'justify',
}));

const TitleTypography = styled(Typography)(({theme}) => ({
    position: 'relative',
    textDecoration: 'none',
    '&:hover': {cursor: 'pointer'},
    '& .arrow': {
        visibility: 'hidden',
        position: 'absolute',
        right: 0,
        top: '50%',
        transform: 'translateY(-50%)',
    },
    '&:hover .arrow': {
        visibility: 'visible',
        opacity: 0.7,
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        width: 0,
        height: '1px',
        bottom: 0,
        left: 0,
        backgroundColor: (theme.vars || theme).palette.text.primary,
        opacity: 0.3,
        transition: 'width 0.3s ease, opacity 0.3s ease',
    },
    '&:hover::before': {
        width: '100%',
    },
}));

export default function AboutUs() {

    return (
        <Container sx={{py: 5}}>
            <Typography variant="h2" color="primary" gutterBottom>
                Hello, we are CG Stickers
            </Typography>
            <Grid container spacing={8} columns={12} sx={{my: 4}}>
                <Grid size={{xs: 12, sm: 12}}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: 1,
                            height: '100%',
                        }}
                    >
                        <TitleTypography gutterBottom variant="h5" tabIndex={0}>
                            At CG Stickers, we’re obsessed with making custom sticker ordering effortless and enjoyable.
                        </TitleTypography>
                        <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                            We know your time is valuable — that’s why we’ve streamlined the entire process from start
                            to finish. Place your order in seconds, get your custom stickers delivered in just days.
                            You’ll get free digital proofs, free artwork assistance, fast production, and free shipping
                            — everything you need for a smooth, stress-free experience. That’s what makes CG Stickers a
                            favorite among creatives, small businesses, and sticker lovers alike.
                        </StyledTypography>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}
