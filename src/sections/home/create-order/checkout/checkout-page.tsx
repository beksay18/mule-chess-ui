import * as React from 'react';
import {
    Box,
    Button,
    Card,
    Container, FormControl, Paper, Typography,
} from '@mui/material';
import { useRouter } from '../../../../routes/hooks';
import { useCart } from '../cart/cart-context';
import {createOrder, LineItemRequest, OrderRequest, ShippingAddressRequest, usStates} from '../../../../api/order';
import {getCurrentUser, SessionStorage} from '../../../../api';
import OrderSummary from "./order-summary";
import ShippingInfoSection from "./shipping-info-section";
import ContactInfoSection from "./contact-info-section";
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import StripeCardForm from "./stripe-card-form";
import {
    createOrUpdateShippingAddress,
    getShippingAddresses,
    ShippingAddressResponse
} from "../../../../api/shippingAddress";
import EditIcon from '@mui/icons-material/Edit';

export default function CheckoutPage() {
    const router = useRouter();
    const { cartItems, setCartItems } = useCart();
    const user = getCurrentUser();
    const stripePromise = loadStripe('pk_test_51RMtxDFkgHwmDM7GHaAGBSIdkkVLdjmEGwHoEgLcNEmAgPk4IlAN8AoV76HzYwC1qLJnQvWLPXklGWoJp9504akp00Bo7DOm1d');
    const [paymentConfirmed, setPaymentConfirmed] = React.useState(false);
    const [paymentMethodId, setPaymentMethodId] = React.useState<string | null>(null);
    const [defaultAddress, setDefaultAddress] = React.useState<ShippingAddressResponse | null>(null);
    const [showEdit, setShowEdit] = React.useState(false);
    const [saveToAddressBook, setSaveToAddressBook] = React.useState(false);

    const [isPlacingOrder, setIsPlacingOrder] = React.useState(false);
    const [customerEmail, setCustomerEmail] = React.useState('');
    const [customerPhone, setCustomerPhone] = React.useState('');
    const [customerFirstName, setCustomerFirstName] = React.useState('');
    const [customerLastName, setCustomerLast] = React.useState('');
    const [shipping, setShipping] = React.useState<ShippingAddressRequest>({
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

        if (!paymentConfirmed || !paymentMethodId) {
            alert("Please confirm card details before placing the order.");
            return;
        }

        setIsPlacingOrder(true);

        const payload: OrderRequest = {
            userId: user?.userId,
            customerEmail,
            customerPhone,
            customerFirstName,
            customerLastName,
            totalAmount: subtotal,
            lineItems,
            shippingAddress: shipping,
            paymentMethodId
        };

        if (
            saveToAddressBook &&
            user?.userId &&
            (showEdit || !defaultAddress)
        ) {
            await createOrUpdateShippingAddress(user.userId, {
                ...shipping,
                isDefault: true,
            });
        }

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

    React.useEffect(() => {
        if (user?.person) {
            setCustomerFirstName(user.person.firstName || '');
            setCustomerLast(user.person.lastName || '');
            setCustomerPhone(user.person.phoneNumber || '');
            setCustomerEmail(user.username || '');
        }

        const fetchDefaultShipping = async () => {
            if (user?.userId) {
                const addresses = await getShippingAddresses(user.userId);
                const defaultAddr = addresses.find((addr) => addr.isDefault);
                if (defaultAddr) {
                    setDefaultAddress(defaultAddr);
                    setShipping(defaultAddr);
                }
            }
        };

        fetchDefaultShipping();
    }, [user?.userId]);

    return (
        <Box sx={{ width: '100%', py: 8 }}>
            <Container>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                    <Card sx={{ flex: 7, backgroundColor: 'transparent', boxShadow: 'none' }}>

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
