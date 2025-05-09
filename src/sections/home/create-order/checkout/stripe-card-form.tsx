import React, { useState } from 'react';
import {
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { Box, Button, Typography, InputLabel, Paper } from '@mui/material';

type Props = {
    onPaymentSuccess: (paymentMethodId: string) => void;
};

export default function StripeCardForm({ onPaymentSuccess }: Props) {
    const stripe = useStripe();
    const elements = useElements();
    const [status, setStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleConfirmCard = async () => {
        setLoading(true);
        setStatus(null);

        const cardElement = elements?.getElement(CardNumberElement);
        if (!stripe || !cardElement) return;

        try {
            const { paymentMethod, error } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });

            if (error) {
                setStatus(`❌ ${error.message}`);
            } else if (paymentMethod) {
                setStatus('✅ Card details confirmed');
                onPaymentSuccess(paymentMethod.id);
            }
        } catch (err) {
            console.error(err);
            setStatus('❌ Failed to confirm card.');
        } finally {
            setLoading(false);
        }
    };

    const elementStyle = {
        base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
                color: '#aab7c4',
            },
        },
        invalid: {
            color: '#9e2146',
        },
    };

    return (
        <Paper sx={{ p: 3, mt: 4 }} variant="outlined">
            <Typography variant="h6" gutterBottom>Card Details</Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                    <InputLabel shrink>Card Number</InputLabel>
                    <Box sx={{ border: '1px solid #ccc', borderRadius: 1, p: 1, mt: 0.5 }}>
                        <CardNumberElement options={{ style: elementStyle }} />
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                        <InputLabel shrink>Expiry Date</InputLabel>
                        <Box sx={{ border: '1px solid #ccc', borderRadius: 1, p: 1, mt: 0.5 }}>
                            <CardExpiryElement options={{ style: elementStyle }} />
                        </Box>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <InputLabel shrink>CVC</InputLabel>
                        <Box sx={{ border: '1px solid #ccc', borderRadius: 1, p: 1, mt: 0.5 }}>
                            <CardCvcElement options={{ style: elementStyle }} />
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Button
                variant="outlined"
                color="primary"
                onClick={handleConfirmCard}
                disabled={!stripe || !elements || loading}
                sx={{ mt: 3 }}
            >
                {loading ? 'Checking...' : 'Confirm Card Details'}
            </Button>

            {status && (
                <Typography
                    variant="body2"
                    color={status.startsWith('✅') ? 'success.main' : 'error.main'}
                    sx={{ mt: 1 }}
                >
                    {status}
                </Typography>
            )}
        </Paper>
    );
}
