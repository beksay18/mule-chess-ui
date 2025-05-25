import React, { useState } from 'react';
import {
    useStripe,
    useElements,
    PaymentElement
} from '@stripe/react-stripe-js';
import { Box, Button, Typography } from '@mui/material';

interface Props {
    onPaymentSuccess: (paymentIntentId: string) => void;
    isPlacingOrder: boolean;
    setIsPlacingOrder: (val: boolean) => void;
}

export default function StripePaymentForm({ onPaymentSuccess, isPlacingOrder, setIsPlacingOrder }: Props) {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState<string | null>(null);

    const handleConfirmPayment = async () => {

        if (!stripe || !elements) {
            alert('Stripe is not ready.');
            return;
        }

        setIsPlacingOrder(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required',
            confirmParams: {
                return_url: window.location.href,
            },
        });

        if (error || !paymentIntent || paymentIntent.status !== 'succeeded') {
            setMessage(error?.message || 'Payment failed.');
            setIsPlacingOrder(false);
        } else {
            onPaymentSuccess(paymentIntent.id);
        }
    };

    return (
        <Box sx={{ mt: 2 }}>
            <PaymentElement />
            {message && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                    {message}
                </Typography>
            )}
            <Button
                variant="contained"
                color="warning"
                fullWidth
                onClick={handleConfirmPayment}
                disabled={isPlacingOrder}
                sx={{ mt: 2 }}
            >
                {isPlacingOrder ? 'Processing Payment...' : 'Place Order'}
            </Button>
        </Box>
    );
}
