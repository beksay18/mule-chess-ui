import * as React from 'react';
import {
    Box,
    Button,
    Card,
    Container,
    Typography,
    Paper,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import {useCart} from "./cart-context";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Avatar from "@mui/material/Avatar";
import ClearIcon from '@mui/icons-material/Clear';
import {useRouter} from "../../../../routes/hooks";

export default function CartPage() {
    const router = useRouter();
    const { cartItems, setCartItems, removeItem } = useCart();

    const getDiscountForQuantity = (
        quantity: number,
        tiers: { quantity: number; percentage: number }[] = []
    ): number =>
        tiers.reduce((max, tier) =>
                quantity >= tier.quantity && tier.percentage > max
                    ? tier.percentage
                    : max,
            0
        );


    const handleQuantityChange = (index: number, newQuantity: number) => {
        if (newQuantity < 1) return;

        const updated = [...cartItems];
        const item = updated[index];

        const newDiscount = getDiscountForQuantity(newQuantity, item.discountTiers);
        updated[index] = { ...item, quantity: newQuantity, percentage: newDiscount };

        setCartItems(updated);
    };

    const subtotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const totalDiscount = cartItems.reduce(
        (total, item) => total + item.price * item.quantity * (item.percentage / 100),
        0
    );

    const orderTotal = subtotal - totalDiscount;

    const handleCheckout = () => {
        router.push('/checkout');
    };

    return (
        <Box
            id="hero"
            sx={{
                width: '100%',
                backgroundRepeat: 'no-repeat',
                backgroundImage:
                    'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
                py: 8,
            }}
        >
            <Container id="features">
                <Typography
                    component="h2"
                    variant="h2"
                    gutterBottom
                    sx={{ color: 'text.primary', textAlign: 'left', mb: 3 }}
                >
                    CART
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 4,
                    }}
                >
                    <Card
                        sx={{
                            flex: 6,
                            backgroundColor: 'transparent',
                            boxShadow: 'none',
                        }}
                    >
                    <Table>
                            <TableHead>
                                <TableRow sx={{
                                    backgroundColor: 'transparent',
                                    '& > th': {
                                        color: 'black',
                                        fontWeight: 'bold',
                                    },
                                    borderBottom: '1px dotted #ccc',
                                }}>
                                    <TableCell>Product</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cartItems.map((item, i) => (
                                    <TableRow key={i}
                                              sx={{
                                                  borderBottom: '1px dotted #ccc',
                                              }}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar
                                                    variant="rounded"
                                                    sx={{
                                                        width: 70,
                                                        height: 70,
                                                        flexShrink: 0,
                                                        bgcolor: 'primary.main',
                                                        fontSize: 20,
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    {item.name.charAt(0)}
                                                </Avatar>

                                                <Box>
                                                    <Typography variant="body1">{item.name}</Typography>
                                                    <Typography variant="body2">
                                                        {item.width}&quot; × {item.height}&quot;
                                                    </Typography>
                                                    <Typography variant="body2">{item.lamination}</Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() => handleQuantityChange(i, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                    sx={{ minWidth: 32, px: 0 }}
                                                >
                                                    –
                                                </Button>

                                                <TextField
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => {
                                                        const newQuantity = parseInt(e.target.value, 10);
                                                        if (!isNaN(newQuantity)) {
                                                            handleQuantityChange(i, newQuantity);
                                                        }
                                                    }}
                                                    inputProps={{ min: 1, style: { textAlign: 'center', width: '3rem' } }}
                                                    size="small"
                                                />

                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() => handleQuantityChange(i, item.quantity + 1)}
                                                    sx={{ minWidth: 32, px: 0 }}
                                                >
                                                    +
                                                </Button>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            {item.percentage > 0 ? (
                                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                                                    >
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight="bold">
                                                        ${(item.price * item.quantity * (1 - item.percentage / 100)).toFixed(2)}
                                                    </Typography>
                                                    <Typography variant="caption" color="success">
                                                        ({item.percentage}% off)
                                                    </Typography>
                                                </Box>
                                            ) : (
                                                <Typography variant="body1" fontWeight="bold">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <ClearIcon
                                                onClick={() => removeItem(i)}
                                                sx={{ cursor: 'pointer' }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>

                    <Box sx={{ flex: 4 }}>
                    <Paper
                        elevation={4}
                        sx={{
                            p: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                            backgroundColor: '#fdfdfd',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            minHeight: 300,
                        }}
                    >
                        <Typography variant="h6" fontWeight="bold">
                            Order Summary
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body1">Subtotal:</Typography>
                            <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body1">Savings:</Typography>
                            <Typography variant="body1" sx={{ color: 'error.main' }}>
                                -${totalDiscount.toFixed(2)}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                borderTop: '1px solid #ccc',
                                pt: 2,
                            }}
                        >
                            <Typography variant="body1" fontWeight="bold">
                                Order Total:
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">
                                ${orderTotal.toFixed(2)}
                            </Typography>
                        </Box>

                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            size="large"
                            endIcon={<LockIcon />}
                            sx={{
                                textTransform: 'none',
                                height: 60,
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                            }}
                            onClick={handleCheckout}
                        >
                            Checkout
                        </Button>

                        <Typography
                            variant="body1"
                            sx={{
                                cursor: 'pointer',
                                '&:hover': {
                                    color: 'primary.dark',
                                },
                            }}
                            onClick={() => router.push('/')}
                        >
                            or continue shopping
                        </Typography>
                    </Paper>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
