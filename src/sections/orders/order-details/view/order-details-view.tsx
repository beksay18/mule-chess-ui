import {
    Box,
    Typography,
    Card,
    CardContent,
    Divider,
    Avatar,
    Stack,
    Chip, Button,
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import {useParams, useSearchParams} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CustomerOrderResponse, getOrderById } from '../../../../api/orderDetails';
import { Icon } from '@iconify/react';
import {useRouter} from "../../../../routes/hooks";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export function OrderDetailsView() {
    const router = useRouter();
    const { id } = useParams();
    const [order, setOrder] = useState<CustomerOrderResponse | null>(null);
    const baseURL = import.meta.env.VITE_API_BASE_IMAGE_URL;

    const [searchParams] = useSearchParams();
    const page = searchParams.get('page') || '0';

    useEffect(() => {
        if (id) getOrderById(Number(id)).then(setOrder);
    }, [id]);

    if (!order) return <DashboardContent maxWidth="xl">Loading...</DashboardContent>;

    return (
        <DashboardContent maxWidth="xl">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={() => router.push(`/orders?page=${page}`)}
                            variant="outlined"
                            size="small"
                            sx={{ textTransform: 'none' }}
                        >
                            Back
                        </Button>
                        <Typography variant="h4" noWrap>
                            Order #{order.orderNumber}
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        Placed on {new Date(order.dateCreated).toLocaleString()}
                    </Typography>
                </Box>
                <Chip
                    label={order.orderStatus.toUpperCase()}
                    color={
                        order.orderStatus === 'CANCELLED'
                            ? 'error'
                            : order.orderStatus === 'READY_TO_SHIP'
                                ? 'warning'
                                : order.orderStatus === 'NEW'
                                    ? 'primary'
                                    : 'success'
                    }
                    size="medium"
                    sx={{ fontWeight: 500 }}
                />
            </Box>


            <Box display="flex" flexDirection={{ xs: 'column', lg: 'row' }} gap={3}>

                <Box flex={2} display="flex" flexDirection="column" gap={3}>

                    <Card elevation={2} sx={{ borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                <Icon icon="mdi:cart" style={{ marginRight: 8 }} />
                                Products
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            {order.lineItems.map((item, index) => (
                                <Box key={index} sx={{ mb: 2 }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Box display="flex" alignItems="center" flex={1}>
                                            <Avatar src={item.imageUrl} variant="rounded" sx={{ width: 56, height: 56, mr: 2 }} />
                                            <Box>
                                                <Typography fontWeight={500}>{item.productName}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {item.width}&quot; x {item.height}&quot; · {item.isCustomDimension ? 'Custom' : 'Standard'}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Typography variant="body2" color="text.secondary" flex={1}>
                                            Qty: {item.quantity}
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                                            {item.percentage}%
                                        </Typography>
                                    </Stack>
                                    {item.artworks && item.artworks.length > 0 && (
                                        <Box sx={{ mt: 1, ml: 8, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {item.artworks.map((url, i) => (
                                                <img
                                                    key={i}
                                                    src={`${baseURL}${url}`}
                                                    alt={`Artwork ${i + 1}`}
                                                    style={{ width: 80, height: 'auto', borderRadius: 4, border: '1px solid #ccc' }}
                                                />
                                            ))}
                                        </Box>
                                    )}
                                    {index < order.lineItems.length - 1 && <Divider sx={{ my: 2 }} />}
                                </Box>
                            ))}
                        </CardContent>
                    </Card>

                </Box>

                <Box flex={1} display="flex" flexDirection="column" gap={3}>

                    <Card elevation={2} sx={{ borderRadius: 2 }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6">
                                    Order Summary
                                </Typography>
                                {order.payment ? (
                                    <Chip
                                        label={order.payment.paymentStatus.toUpperCase()}
                                        color={order.payment.paymentStatus === 'paid' ? 'success' : 'warning'}
                                        sx={{ fontWeight: 500 }}
                                    />
                                ) : (
                                    <Chip
                                        label="UNPAID"
                                        color="warning"
                                        sx={{ fontWeight: 500 }}
                                    />
                                )}
                            </Box>

                            <Divider sx={{ mb: 2 }} />

                            <Stack spacing={1}>
                                <Typography>  Subtotal: ${order.payment ? order.payment.amount.toFixed(2) : '0.00'}</Typography>
                                <Typography>Discount: $0.00</Typography>
                                <Typography>Shipping: $0.00</Typography>
                                <Typography variant="subtitle1" fontWeight={600} mt={1}>
                                   Order Total: ${order.totalAmount.toFixed(2)}
                                </Typography>
                            </Stack>
                        </CardContent>
                    </Card>

                    <Card elevation={2} sx={{ borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                <Icon icon="mdi:account-outline" style={{ marginRight: 8 }} />
                                Customer
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Typography fontWeight={500}>{order.customerFirstName} {order.customerLastName}</Typography>
                            <Typography variant="body2">{order.customerEmail}</Typography>
                            <Typography variant="body2">{order.customerPhone}</Typography>
                        </CardContent>
                    </Card>

                    <Card elevation={2} sx={{ borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                <Icon icon="mdi:truck-delivery-outline" style={{ marginRight: 8 }} />
                                Shipping Address
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Typography>{order.shippingAddress.addressLine1}</Typography>
                            {order.shippingAddress.addressLine2 && (
                                <Typography>{order.shippingAddress.addressLine2}</Typography>
                            )}
                            <Typography>{order.shippingAddress.city}, {order.shippingAddress.state}</Typography>
                            <Typography>{order.shippingAddress.postalCode}, {order.shippingAddress.country}</Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </DashboardContent>
    );
}
