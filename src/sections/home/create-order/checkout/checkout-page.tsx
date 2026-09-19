import React, { useEffect, useState } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';

import { getCurrentUser } from '../../../../api';
import {
    createOrder,
    LineItemRequest,
    OrderRequest,
    ShippingAddressRequest,
    usStates,
} from '../../../../api/order';
import {
    createOrUpdateShippingAddress,
    getShippingAddresses,
    ShippingAddressResponse,
} from '../../../../api/shippingAddress';
import { useRouter } from '../../../../routes/hooks';
import { formatUsPhoneNumber, isValidUsPhoneNumber, stripPhoneDigits } from '../../../../utils/validator';
import { useCart } from '../cart/cart-context';
import ContactInfoSection from './contact-info-section';
import OrderSummary from './order-summary';
import ShippingInfoSection from './shipping-info-section';

const BRAND_BLUE = '#175195';

const sectionCardSx = {
    p: { xs: 2.5, md: 3 },
    borderRadius: 3,
    border: `1px solid ${alpha(BRAND_BLUE, 0.12)}`,
    boxShadow: `0 4px 24px ${alpha(BRAND_BLUE, 0.05)}`,
};

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
            phone: !isValidUsPhoneNumber(customerPhone),
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
                customerPhone: stripPhoneDigits(customerPhone),
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
            setCustomerPhone(formatUsPhoneNumber(user.person.phoneNumber || ''));
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

    const placeOrderButton = (
        <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
            endIcon={<LockOutlinedIcon />}
            sx={{
                py: 1.6,
                borderRadius: 50,
                fontSize: '1rem',
                fontWeight: 800,
                textTransform: 'none',
                bgcolor: BRAND_BLUE,
                boxShadow: `0 8px 24px ${alpha(BRAND_BLUE, 0.28)}`,
                '&:hover': {
                    bgcolor: '#124578',
                    boxShadow: `0 10px 28px ${alpha(BRAND_BLUE, 0.35)}`,
                },
                '&:disabled': {
                    bgcolor: alpha(BRAND_BLUE, 0.35),
                    color: '#ffffff',
                },
            }}
        >
            {isPlacingOrder ? 'Placing order...' : 'Place order'}
        </Button>
    );

    return (
        <Box sx={{ width: '100%', bgcolor: '#f8fafc', py: { xs: 4, md: 6 } }}>
            <Container maxWidth="lg">
                <Stack spacing={3}>
                    <Box>
                        <Typography
                            component="h1"
                            sx={{
                                fontWeight: 800,
                                fontSize: { xs: '1.5rem', md: '1.75rem' },
                                letterSpacing: '-0.02em',
                                color: '#0f172a',
                            }}
                        >
                            Checkout
                        </Typography>
                        <Typography
                            component="button"
                            onClick={() => router.push('/cart')}
                            sx={{
                                mt: 0.75,
                                border: 0,
                                p: 0,
                                bgcolor: 'transparent',
                                color: BRAND_BLUE,
                                fontWeight: 700,
                                cursor: 'pointer',
                                '&:hover': { textDecoration: 'underline' },
                            }}
                        >
                            Back to cart
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', lg: '1fr 360px' },
                            gap: { xs: 3, lg: 4 },
                            alignItems: 'start',
                        }}
                    >
                        <Stack spacing={2.5}>
                            {user ? (
                                <Paper elevation={0} sx={sectionCardSx}>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                                        <PersonOutlineIcon sx={{ color: BRAND_BLUE }} />
                                        <Typography sx={{ fontWeight: 800, fontSize: '1.0625rem', color: '#0f172a' }}>
                                            Contact
                                        </Typography>
                                    </Stack>
                                    <Typography fontWeight={700}>
                                        {customerFirstName} {customerLastName}
                                    </Typography>
                                    <Typography color="text.secondary">{customerEmail}</Typography>
                                    <Typography color="text.secondary">
                                        {formatUsPhoneNumber(customerPhone)}
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
                                <Paper elevation={0} sx={sectionCardSx}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <LocalShippingOutlinedIcon sx={{ color: BRAND_BLUE }} />
                                            <Typography sx={{ fontWeight: 800, fontSize: '1.0625rem', color: '#0f172a' }}>
                                                Shipping address
                                            </Typography>
                                        </Stack>
                                        <Button
                                            variant="text"
                                            onClick={() => setShowEdit(true)}
                                            startIcon={<EditIcon />}
                                            sx={{ textTransform: 'none', fontWeight: 700, color: BRAND_BLUE }}
                                        >
                                            Edit
                                        </Button>
                                    </Box>
                                    <Typography fontWeight={600}>{defaultAddress.addressLine1}</Typography>
                                    {defaultAddress.addressLine2 && (
                                        <Typography color="text.secondary">{defaultAddress.addressLine2}</Typography>
                                    )}
                                    <Typography color="text.secondary">
                                        {defaultAddress.city}, {defaultAddress.state} {defaultAddress.postalCode}
                                    </Typography>
                                    <Typography color="text.secondary">{defaultAddress.country}</Typography>
                                </Paper>
                            ) : (
                                <Stack spacing={1.5}>
                                    <ShippingInfoSection
                                        shipping={shipping}
                                        setShipping={setShipping}
                                        errors={errors}
                                        usStates={usStates}
                                    />
                                    {!defaultAddress && user?.userId && (
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={saveToAddressBook}
                                                    onChange={(event) => setSaveToAddressBook(event.target.checked)}
                                                    sx={{ color: BRAND_BLUE, '&.Mui-checked': { color: BRAND_BLUE } }}
                                                />
                                            }
                                            label="Save this address to my profile"
                                            sx={{ pl: 0.5, '& .MuiFormControlLabel-label': { fontWeight: 600 } }}
                                        />
                                    )}
                                </Stack>
                            )}

                            <Paper elevation={0} sx={sectionCardSx}>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                    <CreditCardOutlinedIcon sx={{ color: BRAND_BLUE }} />
                                    <Typography sx={{ fontWeight: 800, fontSize: '1.0625rem', color: '#0f172a' }}>
                                        Payment
                                    </Typography>
                                </Stack>
                                <PaymentElement
                                    options={{
                                        layout: 'tabs',
                                        wallets: {
                                            applePay: 'never',
                                            googlePay: 'never',
                                        },
                                        fields: {
                                            billingDetails: {
                                                name: 'never',
                                                email: 'never',
                                                phone: 'never',
                                                address: 'never',
                                            },
                                        },
                                    }}
                                />
                            </Paper>

                            <Box sx={{ display: { xs: 'block', lg: 'none' } }}>{placeOrderButton}</Box>
                        </Stack>

                        <Box sx={{ position: { lg: 'sticky' }, top: { lg: 24 } }}>
                            <Stack spacing={2}>
                                <OrderSummary items={cartItems} />
                                <Box sx={{ display: { xs: 'none', lg: 'block' } }}>{placeOrderButton}</Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ display: { xs: 'none', lg: 'block' }, textAlign: 'center' }}
                                >
                                    Secure checkout. Your payment is encrypted.
                                </Typography>
                            </Stack>
                        </Box>
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
}
