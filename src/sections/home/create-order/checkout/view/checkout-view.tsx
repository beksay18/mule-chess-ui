import Header from '../../../header';
import Footer from '../../../footer';
import CheckoutWrapper from '../checkout-wrapper';
import { useEffect, useState } from 'react';
import {useCart} from "../../cart/cart-context";
import {getCurrentUser} from "../../../../../api";
import {createPaymentIntent, LineItemRequest, ShippingAddressRequest} from "../../../../../api/order";

export function CheckoutView() {
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

    if (!clientSecret) return null;

    return (
        <>
            <Header />
            <CheckoutWrapper clientSecret={clientSecret} />
            <Footer />
        </>
    );
}
