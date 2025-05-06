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
import {useRouter} from "../../../routes/hooks";

export default function CartPage() {
    const router = useRouter();
    const { cartItems, setCartItems, removeItem } = useCart();

    const handleQuantityChange = (index: number, quantity: number) => {
        const updated = [...cartItems];
        updated[index].quantity = quantity;
        setCartItems(updated);
    };

    const subtotal = cartItems.reduce((total, item) => {
        const itemTotal = item.price * item.quantity * (1 - item.percentage / 100);
        return total + itemTotal;
    }, 0);

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
                            flex: 7,
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
                                            <TextField
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    handleQuantityChange(i, parseInt(e.target.value))
                                                }
                                                inputProps={{ min: 1 }}
                                                sx={{ width: 80 }}
                                            />
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

                            <Box sx={{ display: 'flex',}}>
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
                            </Box>
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
