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

export default function Returns() {

    return (
        <Container sx={{py: 5}}>
            <Typography variant="h2" color="primary" gutterBottom>
                Returns
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
                            Problems with your order?
                        </TitleTypography>
                        <TitleTypography gutterBottom tabIndex={0}>
                            Email us: support@cgstickers.com
                        </TitleTypography>
                        <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                            If you have a problem with your order, please let us know within 30 days of receiving your
                            products. We will be unable to replace or refund any orders brought to our attention after
                            30 days of confirmed delivery by USPS or UPS.
                            It is important to note that every order we produce is 100% custom. We do not allow returns
                            or refunds for reasons that is unrelated to quality. i.e.- we will not refund your order if
                            you decide you do not want it. We will not refund or reprint your order if you ordered the
                            wrong size or prefer a different product. We try to be fair if the mistake is on our end
                            without a doubt we will fix it and make it right.
                        </StyledTypography>
                        <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                            If your order has an issue due to set up, printing, laminating or packaging please let us
                            know. We will look into the issue and if needed, reprint your order. Refunds will not be
                            given for these issues; only reprints.
                        </StyledTypography>
                        <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                            If you do feel that there was an error in the quality of your print job, we will be happy to
                            look in to the issue you are having. One of the main problems we encounter is based on what
                            you see on a screen versus what is printed out from our machines. There are many variables
                            that can sometimes change the appearance of colors, brightness, and contrast of your images.
                            So if we do find that we need to reprint your order, we may ask for your assistance to get
                            the order right, and might request a photo or further instructions before reproducing your
                            reprinted order. We just want to know how to make it right!
                        </StyledTypography>
                        <TitleTypography gutterBottom variant="h5" tabIndex={0}>
                            Refunds
                        </TitleTypography>
                        <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                            We will process your refund request within 2 business days. Once we submit a refund to your
                            bank or credit card company, it can take up to 4 business days to see the credit on your
                            statement. This usually has to do with the policies and procedures of your bank or credit
                            card company.
                        </StyledTypography>
                        <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                            If you haven’t received a refund yet, contact your bank or credit card company. They should
                            be able to answer any questions as to the delay.
                        </StyledTypography>
                        <TitleTypography gutterBottom variant="h5" tabIndex={0}>
                            Our guarantee
                        </TitleTypography>
                        <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                            We want you to know that we stand behind our products, our process, and our print quality.
                            Our guarantee is to stand behind this quality and service. We don’t assume liability for
                            lost sales, labor costs, or other costs associated with your order if there are issues with
                            your order, but we definitely have you covered on reprinting your order and the shipping
                            costs. As we do guarantee the quality of our prints, shipping is not guaranteed to arrive on
                            time since we use USPS and UPS.
                        </StyledTypography>
                        <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                            We appreciate your business, and thank you for choosing AADesigns! We hope to print another
                            order for you soon!
                        </StyledTypography>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}
