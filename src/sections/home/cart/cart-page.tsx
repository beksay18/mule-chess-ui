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

export default function CartPage() {
    const { cartItems, setCartItems } = useCart();

    const handleQuantityChange = (index: number, quantity: number) => {
        const updated = [...cartItems];
        updated[index].quantity = quantity;
        setCartItems(updated);
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
                                <TableRow>
                                    <TableCell><strong>Product</strong></TableCell>
                                    <TableCell><strong>Size</strong></TableCell>
                                    <TableCell><strong>Finish</strong></TableCell>
                                    <TableCell><strong>Quantity</strong></TableCell>
                                    <TableCell><strong>Total</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cartItems.map((item, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.width}&quot; × {item.height}&quot;</TableCell>
                                        <TableCell>{item.lamination}</TableCell>
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
                                            ${(item.price * item.quantity * (1 - item.percentage / 100)).toFixed(2)}
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
                                    $904
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
                                >
                                    Checkout
                                </Button>
                            </Box>
                            <Typography variant="body1">
                                or continue shopping
                            </Typography>
                        </Paper>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
