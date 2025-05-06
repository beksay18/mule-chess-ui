import * as React from 'react';
import {
    Box,
    Button,
    Card,
    Container,
    Typography,
    Paper,
} from '@mui/material';
import {useRouter} from "../../../../routes/hooks";
import {useCart} from "../cart/cart-context";
import TextField from "@mui/material/TextField";
import {createOrder, LineItemRequest, OrderRequest, ShippingAddressRequest} from "../../../../api/order";
import {getCurrentUser} from "../../../../api";

export default function CheckoutPage() {
    const router = useRouter();
    const { cartItems , setCartItems} = useCart();
    const user = getCurrentUser();

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
        country: '',
    });

    const lineItems: LineItemRequest[] = cartItems.map(item => ({
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

        const payload: OrderRequest = {
            userId: user?.userId,
            customerEmail,
            customerPhone,
            totalAmount: subtotal,
            lineItems,
            shippingAddress: shipping,
        };

        try {
            const order = await createOrder(payload);
            setCartItems([]);
            router.push(`/order-confirmation?orderNumber=${order.orderNumber}`);
        } catch (error) {
            console.error('Order placement failed', error);
            alert('Failed to place order. Please try again.');
        }
    };

    return (
        <Box
            id="hero"
            sx={{
                width: '100%',
                backgroundRepeat: 'no-repeat',
                py: 8,
            }}
        >
            <Container id="features">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 4,
                    }}
                >
                    <Card
                        sx={{
                            flex: 7,
                            backgroundColor: 'transparent',
                            boxShadow: 'none',
                        }}
                    >
                        <Box>
                            <Typography
                                component="h2"
                                variant="h6"
                                gutterBottom
                                sx={{ color: 'text.primary', mb: 2 }}
                            >
                                Contact Info
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', md: 'row' },
                                    gap: 2,
                                }}
                            >
                                <TextField
                                    label="Email"
                                    fullWidth
                                    value={customerEmail}
                                    onChange={(e) => setCustomerEmail(e.target.value)}
                                />
                                <TextField
                                    label="Phone Number"
                                    fullWidth
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                />
                            </Box>
                        </Box>

                        <Box>
                            <Typography
                                component="h2"
                                variant="h6"
                                gutterBottom
                                sx={{ color: 'text.primary', mb: 2, mt: 2 }}
                            >
                                Shipping Info
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                                    <TextField
                                        label="First Name"
                                        fullWidth
                                        value={shipping.firstName}
                                        onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })}
                                    />
                                    <TextField
                                        label="Last Name"
                                        fullWidth
                                        value={shipping.lastName}
                                        onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })}
                                    />
                                </Box>

                                <TextField
                                    label="Address Line 1"
                                    fullWidth
                                    value={shipping.addressLine1}
                                    onChange={(e) => setShipping({ ...shipping, addressLine1: e.target.value })}
                                />

                                <TextField
                                    label="Address Line 2"
                                    fullWidth
                                    value={shipping.addressLine2}
                                    onChange={(e) => setShipping({ ...shipping, addressLine2: e.target.value })}
                                />

                                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                                    <TextField
                                        label="City"
                                        fullWidth
                                        value={shipping.city}
                                        onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                                    />
                                    <TextField
                                        label="State"
                                        fullWidth
                                        value={shipping.state}
                                        onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                                    />
                                </Box>

                                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                                    <TextField
                                        label="Postal Code"
                                        fullWidth
                                        value={shipping.postalCode}
                                        onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                                    />
                                    <TextField
                                        label="Country"
                                        fullWidth
                                        value={shipping.country}
                                        onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                                    />
                                </Box>
                            </Box>
                        </Box>

                        <Box sx={{ mt: 2 }}>
                            <Button
                                variant="contained"
                                color="warning"
                                size="large"
                                onClick={handlePlaceOrder}
                                sx={{
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                    fontSize: '1.1rem',
                                    py: 1.5,
                                    borderRadius: 2,
                                }}
                            >
                                Place Order
                            </Button>
                        </Box>
                    </Card>

                    <Box sx={{ flex: 3 }}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                            }}
                        >
                            <Typography variant="body1" fontWeight="bold">Order Summary </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography variant="body1" fontWeight="bold" sx={{mr: 1}}>Subtotal: </Typography>
                                <Typography variant="body1">
                                    ${subtotal.toFixed(2)}
                                </Typography>
                            </Box>
                        </Paper>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
