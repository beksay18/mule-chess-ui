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
            variables: {
                colorPrimary: '#175195',
                colorText: '#0f172a',
                colorDanger: '#b42318',
                borderRadius: '12px',
                fontFamily: 'DM Sans, system-ui, sans-serif',
            },
        },
        paymentMethodOrder: ['card'],
        wallets: {
            applePay: 'never',
            googlePay: 'never',
            link: 'never',
        },
    } as StripeElementsOptions;


    return (
        <Elements stripe={stripePromise} options={options}>
            <CheckoutPage />
        </Elements>
    );
}
