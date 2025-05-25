import React from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutPage from './checkout-page';

const stripePromise = loadStripe('pk_test_51RMtxDFkgHwmDM7GHaAGBSIdkkVLdjmEGwHoEgLcNEmAgPk4IlAN8AoV76HzYwC1qLJnQvWLPXklGWoJp9504akp00Bo7DOm1d');

export default function CheckoutWrapper({ clientSecret }: { clientSecret: string }) {
    const options = {
        clientSecret,
        appearance: {
            theme: 'stripe',
            labels: 'floating',
        },
        paymentMethodOrder: ['card'],
        wallets: {
            link: 'never',
            applePay: 'never',
            googlePay: 'never',
        },
    } as any;


    return (
        <Elements stripe={stripePromise} options={options}>
            <CheckoutPage />
        </Elements>
    );
}
