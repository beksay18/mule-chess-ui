import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Header from '../../../header';
import Footer from '../../../footer';
import CheckoutWrapper from '../checkout-wrapper';
import {useCart} from "../../cart/cart-context";
import {getCurrentUser} from "../../../../../api";
import {createPaymentIntent, LineItemRequest, ShippingAddressRequest} from "../../../../../api/order";
import { useRouter } from '../../../../../routes/hooks';

export function CheckoutView() {
    const router = useRouter();
    const [clientSecret, setClientSecret] = useState('');
    const { cartItems } = useCart();
    const user = getCurrentUser();

    useEffect(() => {
        const fetchSecret = async () => {
            const lineItems: LineItemRequest[] = cartItems.map(item => ({
                productId: item.productId,
                width: item.width,
                height: item.height,
                quantity: item.quantity,
                percentage: item.percentage,
                customDimension: item.customDimension,
            }));

            const subtotal = cartItems.reduce((total, item) =>
                total + item.price * item.quantity * (1 - item.percentage / 100), 0);

            if (subtotal === 0) return;

            const shipping: ShippingAddressRequest = {
                addressLine1: 'Temp',
                addressLine2: '',
                city: 'Temp',
                state: 'IL',
                postalCode: '00000',
                country: 'United States',
            };

            const intent = await createPaymentIntent({
                totalAmount: subtotal,
                lineItems,
                shippingAddress: shipping,
                customerEmail: user?.username ?? '',
                customerPhone: user?.person?.phoneNumber ?? '',
                customerFirstName: user?.person?.firstName ?? '',
                customerLastName: user?.person?.lastName ?? '',
            });

            setClientSecret(intent.clientSecret);
        };

        fetchSecret();
    }, [cartItems]);

    if (cartItems.length === 0) {
        return (
            <>
                <Header />
                <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', mb: 1 }}>
                        Your cart is empty
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                        Add a sticker before checking out.
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => router.push('/cart')}
                        sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#175195' }}
                    >
                        Go to cart
                    </Button>
                </Container>
                <Footer />
            </>
        );
    }

    if (!clientSecret) {
        return (
            <>
                <Header />
                <Box sx={{ py: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <CircularProgress sx={{ color: '#175195' }} />
                    <Typography color="text.secondary">Preparing secure checkout…</Typography>
                </Box>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <CheckoutWrapper clientSecret={clientSecret} />
            <Footer />
        </>
    );
}
