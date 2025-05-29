import React, { useEffect, useState } from 'react';
import {Box, Button, Card, Container, FormControl, Paper, Typography} from '@mui/material';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useRouter } from '../../../../routes/hooks';
import { useCart } from '../cart/cart-context';
import {
    createOrder, LineItemRequest, OrderRequest, ShippingAddressRequest, usStates,
} from '../../../../api/order';
import { getCurrentUser } from '../../../../api';
import {
    createOrUpdateShippingAddress,
    getShippingAddresses,
    ShippingAddressResponse,
} from '../../../../api/shippingAddress';
import OrderSummary from './order-summary';
import ShippingInfoSection from './shipping-info-section';
import ContactInfoSection from './contact-info-section';
import EditIcon from "@mui/icons-material/Edit";

export default function CheckoutPage() {
    const router = useRouter();
    const { cartItems, setCartItems } = useCart();
    const user = getCurrentUser();
    const stripe = useStripe();
    const elements = useElements();

    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [defaultAddress, setDefaultAddress] = useState<ShippingAddressResponse | null>(null);
    const [showEdit, setShowEdit] = useState(false);
    const [saveToAddressBook, setSaveToAddressBook] = useState(false);

    const [customerEmail, setCustomerEmail] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerFirstName, setCustomerFirstName] = useState('');
    const [customerLastName, setCustomerLast] = useState('');
    const [shipping, setShipping] = useState<ShippingAddressRequest>({
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'United States',
    });

    const [errors, setErrors] = useState({
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
        artworkFiles: item.artworkFiles,
    }));

    const subtotal = cartItems.reduce((total, item) => {
        const itemTotal = item.price * item.quantity * (1 - item.percentage / 100);
        return total + itemTotal;
    }, 0);

    const handlePlaceOrder = async () => {
        const newErrors = {
            email: customerEmail.trim() === '',
            phone: customerPhone.trim() === '',
            firstName: customerFirstName.trim() === '',
            lastName: customerLastName.trim() === '',
            addressLine1: shipping.addressLine1.trim() === '',
            city: shipping.city.trim() === '',
            state: shipping.state.trim() === '',
            postalCode: shipping.postalCode.trim() === '',
        };

        const hasError = Object.values(newErrors).some(Boolean);
        setErrors(newErrors);
        if (hasError || isPlacingOrder) return;

        if (!stripe || !elements) {
            alert('Stripe is not ready.');
            return;
        }

        setIsPlacingOrder(true);

        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                redirect: 'if_required',
                confirmParams: {
                    return_url: window.location.href,
                },
            });

            if (error || !paymentIntent || paymentIntent.status !== 'succeeded') {
                alert(error?.message || 'Payment failed.');
                return;
            }

            const orderPayload: OrderRequest = {
                userId: user?.userId,
                customerEmail,
                customerPhone,
                customerFirstName,
                customerLastName,
                totalAmount: subtotal,
                lineItems,
                shippingAddress: shipping,
                paymentIntentId: paymentIntent.id,
            };

            if (saveToAddressBook && user?.userId && (showEdit || !defaultAddress)) {
                await createOrUpdateShippingAddress(user.userId, {
                    ...shipping,
                    isDefault: true,
                });
            }

            const order = await createOrder(orderPayload);
            if (order?.orderNumber) {
                setCartItems([]);
                router.push(`/order-confirmation?orderNumber=${order.orderNumber}`);
            } else {
                alert('Order created, but confirmation delayed.');
            }
        } catch (err: any) {
            console.error('Order placement failed', err);
            alert('Order failed: ' + (err?.response?.data?.message || 'Try again.'));
        } finally {
            setIsPlacingOrder(false);
        }
    };

    useEffect(() => {
        if (user?.person) {
            setCustomerFirstName(user.person.firstName || '');
            setCustomerLast(user.person.lastName || '');
            setCustomerPhone(user.person.phoneNumber || '');
            setCustomerEmail(user.username || '');
        }

        const fetchShipping = async () => {
            if (user?.userId) {
                const addresses = await getShippingAddresses(user.userId);
                const def = addresses.find((a) => a.isDefault);
                if (def) {
                    setDefaultAddress(def);
                    setShipping(def);
                }
            }
        };

        fetchShipping();
    }, [user?.userId]);

    return (
        <Box sx={{ width: '100%', py: 8,}}>
            <Container>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                    <Box sx={{ flex: 7, boxShadow: 'none' }}>
                        {user ? (
                            <Paper sx={{ p: 2, mb: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Contact Info
                                </Typography>
                                <Typography>
                                    Name: {customerFirstName} {customerLastName}
                                </Typography>
                                <Typography>
                                    Email: {customerEmail}
                                </Typography>
                                <Typography>
                                    Phone: {customerPhone}
                                </Typography>
                            </Paper>
                        ) : (
                            <ContactInfoSection
                                customerFirstName={customerFirstName}
                                setCustomerFirstName={setCustomerFirstName}
                                customerLastName={customerLastName}
                                setCustomerLastName={setCustomerLast}
                                customerEmail={customerEmail}
                                setCustomerEmail={setCustomerEmail}
                                customerPhone={customerPhone}
                                setCustomerPhone={setCustomerPhone}
                                errors={errors}
                            />
                        )}
                        {user?.userId && defaultAddress && !showEdit ? (
                            <Paper sx={{ p: 2, mt: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="h6" gutterBottom>
                                        Shipping Address
                                    </Typography>
                                    <Button variant="text" onClick={() => setShowEdit(true)}>
                                        <EditIcon fontSize="small" /> Edit
                                    </Button>
                                </Box>
                                <Typography>{defaultAddress.addressLine1}</Typography>
                                {defaultAddress.addressLine2 && <Typography>{defaultAddress.addressLine2}</Typography>}
                                <Typography>{defaultAddress.city}, {defaultAddress.state} {defaultAddress.postalCode}</Typography>
                                <Typography>{defaultAddress.country}</Typography>
                            </Paper>
                        ) : (
                            <>
                                <ShippingInfoSection
                                    shipping={shipping}
                                    setShipping={setShipping}
                                    errors={errors}
                                    usStates={usStates}
                                />
                                {!defaultAddress && user?.userId && (
                                    <Box sx={{ mt: 2 }}>
                                        <FormControl>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={saveToAddressBook}
                                                    onChange={(e) => setSaveToAddressBook(e.target.checked)}
                                                />{" "}
                                                Save this address to my profile
                                            </label>
                                        </FormControl>
                                    </Box>
                                )}
                            </>
                        )}

                        <Box sx={{ mt: 2 }}>
                            <PaymentElement />
                        </Box>

                        <Button
                            variant="contained"
                            color="warning"
                            size="large"
                            fullWidth
                            onClick={handlePlaceOrder}
                            disabled={isPlacingOrder}
                            sx={{
                                mt: 3,
                                py: 1.8,
                                borderRadius: '12px',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                letterSpacing: '0.5px',
                                textTransform: 'none',
                                boxShadow: 3,
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    boxShadow: 5,
                                    transform: 'translateY(-1px)',
                                },
                                '&:disabled': {
                                    backgroundColor: 'grey.400',
                                    color: 'white',
                                    cursor: 'not-allowed',
                                },
                            }}
                        >
                            {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
                        </Button>
                    </Box>
                    <Box sx={{ flex: 3}}>
                        <OrderSummary items={cartItems} />
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
