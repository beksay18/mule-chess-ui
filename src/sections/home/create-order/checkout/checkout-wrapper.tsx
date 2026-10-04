import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutPage from './checkout-page';

const stripePromise = loadStripe('pk_test_51RMtxDFkgHwmDM7GHaAGBSIdkkVLdjmEGwHoEgLcNEmAgPk4IlAN8AoV76HzYwC1qLJnQvWLPXklGWoJp9504akp00Bo7DOm1d');

export default function CheckoutWrapper({ clientSecret }: { clientSecret: string }) {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutPage clientSecret={clientSecret} />
        </Elements>
    );
}
