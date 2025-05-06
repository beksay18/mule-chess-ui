import * as React from 'react';
import {
    Container,
} from '@mui/material';
import {useRouter} from "../../../../routes/hooks";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {useSearchParams} from "react-router-dom";

export default function OrderConfirmationPage() {
    const router = useRouter();
    const [searchParams] = useSearchParams();
    const orderNumber = searchParams.get('orderNumber');

    return (
            <Container id="features">
                <Stack spacing={2} useFlexGap sx={{mt: 5}}>
                    <Typography variant="h1">📦</Typography>
                    <Typography variant="h5">Thank you for your order!</Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        Your order number is
                        <strong>&nbsp;#{orderNumber}</strong>. We have emailed your order
                        confirmation and will update you once its shipped.
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{ alignSelf: 'start', width: { xs: '100%', sm: 'auto' } }}
                    >
                        Continue shopping
                    </Button>
                </Stack>
            </Container>
    );
}
