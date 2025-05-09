import * as React from 'react';
import {
    Box,
    Button,
    Card,
    Container, Paper,
} from '@mui/material';
import { useRouter } from '../../../../routes/hooks';
import { useCart } from '../cart/cart-context';
import {createOrder, LineItemRequest, OrderRequest, ShippingAddressRequest, usStates} from '../../../../api/order';
import { getCurrentUser } from '../../../../api';
import OrderSummary from "./order-summary";
import ShippingInfoSection from "./shipping-info-section";
import ContactInfoSection from "./contact-info-section";
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import StripeCardForm from "./stripe-card-form";

export default function CheckoutPage() {
    const router = useRouter();
    const { cartItems, setCartItems } = useCart();
    const user = getCurrentUser();
    const stripePromise = loadStripe('pk_test_51RMtxDFkgHwmDM7GHaAGBSIdkkVLdjmEGwHoEgLcNEmAgPk4IlAN8AoV76HzYwC1qLJnQvWLPXklGWoJp9504akp00Bo7DOm1d');
    const [paymentConfirmed, setPaymentConfirmed] = React.useState(false);
    const [paymentMethodId, setPaymentMethodId] = React.useState<string | null>(null);

    const [isPlacingOrder, setIsPlacingOrder] = React.useState(false);
    const [customerEmail, setCustomerEmail] = React.useState('');
    const [customerPhone, setCustomerPhone] = React.useState('');
    const [shipping, setShipping] = React.useState<ShippingAddressRequest>({
        firstName: '',
        lastName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'United States',
    });

    const [errors, setErrors] = React.useState({
        email: false,
        phone: false,
        firstName: false,
        lastName: false,
        addressLine1: false,
        city: false,
        state: false,
        postalCode: false,
    });

    const lineItems: LineItemRequest[] = cartItems.map((item) => ({
        productId: item.productId,
        width: item.width,
        height: item.height,
        quantity: item.quantity,
        percentage: item.percentage,
        customDimension: item.customDimension,
    }));

    const subtotal = cartItems.reduce((total, item) => {
        const itemTotal = item.price * item.quantity * (1 - item.percentage / 100);
        return total + itemTotal;
    }, 0);

    const handlePlaceOrder = async () => {
        const newErrors = {
            email: customerEmail.trim() === '',
            phone: customerPhone.trim() === '',
            firstName: shipping.firstName.trim() === '',
            lastName: shipping.lastName.trim() === '',
            addressLine1: shipping.addressLine1.trim() === '',
            city: shipping.city.trim() === '',
            state: shipping.state.trim() === '',
            postalCode: shipping.postalCode.trim() === '',
        };

        const hasError = Object.values(newErrors).some(Boolean);
        setErrors(newErrors);
        if (hasError || isPlacingOrder) return;

        if (!paymentConfirmed || !paymentMethodId) {
            alert("Please confirm card details before placing the order.");
            return;
        }

        setIsPlacingOrder(true);

        const payload: OrderRequest = {
            userId: user?.userId,
            customerEmail,
            customerPhone,
            totalAmount: subtotal,
            lineItems,
            shippingAddress: shipping,
            paymentMethodId
        };

        try {
            const order = await createOrder(payload);
            if (order?.orderNumber) {
                setCartItems([]);
                router.push(`/order-confirmation?orderNumber=${order.orderNumber}`);
            } else {
                alert('Order placed, but confirmation is delayed. Check email.');
            }
        } catch (error: any) {
            console.error('Order placement failed', error);
            alert('Order failed: ' + (error?.response?.data?.message || 'Please try again.'));
        } finally {
            setIsPlacingOrder(false);
        }
    };

    return (
        <Box sx={{ width: '100%', py: 8 }}>
            <Container>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                    <Card sx={{ flex: 7, backgroundColor: 'transparent', boxShadow: 'none' }}>

                        <ContactInfoSection
                            customerEmail={customerEmail}
                            setCustomerEmail={setCustomerEmail}
                            customerPhone={customerPhone}
                            setCustomerPhone={setCustomerPhone}
                            errors={errors}
                        />

                        <ShippingInfoSection
                            shipping={shipping}
                            setShipping={setShipping}
                            errors={errors}
                            usStates={usStates}
                        />

                        <Elements stripe={stripePromise}>
                            <StripeCardForm onPaymentSuccess={(id) => {
                                setPaymentMethodId(id);
                                setPaymentConfirmed(true);
                            }} />
                        </Elements>

                        <Box sx={{ mt: 2 }}>
                            <Button
                                variant="contained"
                                color="warning"
                                size="large"
                                onClick={handlePlaceOrder}
                                disabled={isPlacingOrder}
                                sx={{
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                    fontSize: '1.1rem',
                                    py: 1.5,
                                    borderRadius: 2,
                                }}
                            >
                                {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
                            </Button>
                        </Box>
                    </Card>

                    <Box sx={{ flex: 3 }}>
                        <OrderSummary subtotal={subtotal} />
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
