import * as React from 'react';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Chip,
    CircularProgress,
    Container,
    Paper,
    Stack,
    Typography,
    Pagination,
} from '@mui/material';
import { getCurrentUser } from '../../../../api';
import { getMyOrders, MyOrderResponsePage } from '../../../../api/order';

export default function MyOrdersPage() {
    const user = getCurrentUser();
    const [orders, setOrders] = React.useState<MyOrderResponsePage | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [page, setPage] = React.useState(1); // MUI Pagination is 1-based
    const pageSize = 5;
    const baseImageUrl = import.meta.env.VITE_API_BASE_IMAGE_URL;

    const fetchOrders = async (currentPage: number) => {
        setLoading(true);
        try {
            const result = await getMyOrders({
                page: currentPage - 1,
                size: pageSize,
                userId: user?.userId,
            });
            setOrders(result);
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchOrders(page);
    }, [page, user?.userId]);

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <Container sx={{ mt: 5 }}>
            <Typography variant="h5" gutterBottom>
                My Orders
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            ) : orders?.content?.length ? (
                <Stack spacing={4}>
                    {orders.content.map((order) => (
                        <Paper key={order.orderNumber} elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
                                <Box flex={3} display="flex" flexWrap="wrap" gap={2}>
                                    {order.lineItems.map((item, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                width: { xs: '100%', sm: 'calc(50% - 12px)' },
                                                display: 'flex',
                                            }}
                                        >
                                            <Card
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    width: '100%',
                                                    alignItems: 'center',
                                                }}
                                                elevation={2}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 100,
                                                        height: 100,
                                                        backgroundColor: '#f4f4f4',
                                                        flexShrink: 0,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <CardMedia
                                                        component="img"
                                                        image={item.imageUrl ? `${baseImageUrl}${item.imageUrl}` : undefined}
                                                        alt={item.productName}
                                                        sx={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'contain',
                                                        }}
                                                    />
                                                </Box>

                                                <CardContent sx={{ flex: 1 }}>
                                                    <Typography variant="subtitle1" fontWeight={600}>
                                                        {item.productName}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" mt={1}>
                                                        Quantity: {item.quantity}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Size: {item.width}&ldquo; x {item.height}&ldquo;
                                                    </Typography>
                                                    {item.isCustomDimension && (
                                                        <Typography variant="caption" color="primary">
                                                            Custom Dimension
                                                        </Typography>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </Box>
                                    ))}
                                </Box>

                                <Box flex={1} minWidth="250px">
                                    <Stack spacing={1}>
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            Order #: {order.orderNumber}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Date: {new Date(order.dateCreated).toLocaleDateString()}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Total: ${order.totalAmount.toFixed(2)}
                                        </Typography>
                                        <Chip label={order.orderStatus} color="primary" size="small" sx={{ mt: 1 }} />
                                    </Stack>
                                </Box>
                            </Box>
                        </Paper>
                    ))}

                    {orders.totalPages > 1 && (
                        <Box display="flex" justifyContent="center" mt={2}>
                            <Pagination
                                count={orders.totalPages}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </Box>
                    )}
                </Stack>
            ) : (
                <Typography variant="body1" mt={4}>
                    No orders found.
                </Typography>
            )}
        </Container>
    );
}
